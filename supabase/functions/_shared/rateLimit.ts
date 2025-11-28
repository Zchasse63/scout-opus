/**
 * Rate limiting utility for Edge Functions
 * Uses in-memory storage with sliding window algorithm
 * Note: In production, consider using Redis or Supabase for distributed rate limiting
 */

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Max requests per window
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (per-instance, resets on cold start)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
const CLEANUP_INTERVAL = 60000; // 1 minute
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

// Preset configurations
export const RATE_LIMITS = {
  // AI/LLM endpoints - stricter limits due to cost
  AI: { windowMs: 60000, maxRequests: 10 },      // 10 per minute
  
  // Standard API endpoints
  STANDARD: { windowMs: 60000, maxRequests: 60 }, // 60 per minute
  
  // Auth endpoints - prevent brute force
  AUTH: { windowMs: 60000, maxRequests: 5 },      // 5 per minute
  
  // Webhook endpoints - higher limits for integrations
  WEBHOOK: { windowMs: 60000, maxRequests: 100 }, // 100 per minute
  
  // Search endpoints - moderate limits
  SEARCH: { windowMs: 60000, maxRequests: 30 },   // 30 per minute
} as const;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (e.g., user ID, IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpiredEntries();
  
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);
  
  // No existing entry or window expired - create new
  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, newEntry);
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newEntry.resetAt,
    };
  }
  
  // Within window - check limit
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  
  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Create rate limit response headers
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
    ...(result.retryAfter && { 'Retry-After': result.retryAfter.toString() }),
  };
}

/**
 * Create a 429 Too Many Requests response
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...rateLimitHeaders(result),
      },
    }
  );
}

/**
 * Extract identifier from request (user ID or IP)
 */
export function getIdentifier(req: Request, userId?: string): string {
  if (userId) return `user:${userId}`;
  
  // Try to get IP from headers (Cloudflare, etc.)
  const ip = req.headers.get('cf-connecting-ip') 
    || req.headers.get('x-forwarded-for')?.split(',')[0]
    || req.headers.get('x-real-ip')
    || 'unknown';
  
  return `ip:${ip}`;
}

