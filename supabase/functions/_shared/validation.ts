/**
 * Shared validation utilities using Zod
 * 
 * Usage:
 * import { validateRequest, schemas } from '../_shared/validation.ts';
 * 
 * const result = await validateRequest(req, schemas.voiceProcess);
 * if (!result.success) {
 *   return new Response(JSON.stringify({ error: result.error }), { status: 400 });
 * }
 * const data = result.data;
 */

import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// ============================================================================
// COMMON SCHEMAS
// ============================================================================

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// ============================================================================
// EDGE FUNCTION REQUEST SCHEMAS
// ============================================================================

export const schemas = {
  // Voice processing
  voiceProcess: z.object({
    transcript: z.string().min(1).max(1000),
    userLocation: locationSchema.optional(),
    conversationHistory: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
    previousIntent: z.record(z.unknown()).optional(),
  }),

  // Gym personalization
  gymPersonalize: z.object({
    gymIds: z.array(z.string()).min(1).max(50),
  }),

  // Travel alert notification
  travelAlert: z.object({
    userId: z.string().uuid(),
    destination: z.string().min(1),
    daysUntilTrip: z.number().int().min(0),
    gymCount: z.number().int().min(0),
    pushToken: z.string().optional(),
  }),

  // Send push notification
  sendPush: z.object({
    pushTokens: z.array(z.string()).min(1).max(100),
    type: z.enum([
      'booking_confirmed',
      'booking_reminder',
      'payment_received',
      'support_update',
      'travel_alert',
      'streak_reminder',
      'badge_earned',
    ]),
    data: z.record(z.union([z.string(), z.number()])),
  }),

  // Send email
  sendEmail: z.object({
    to: z.string().email(),
    type: z.enum([
      'partner_approved',
      'partner_rejected',
      'booking_confirmed',
      'booking_cancelled',
      'refund_processed',
      'support_reply',
      'welcome',
    ]),
    data: z.record(z.union([z.string(), z.number()])),
  }),

  // Calendar extract destination
  calendarExtract: z.object({
    title: z.string().min(1),
    location: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),

  // Places search
  placesSearch: z.object({
    query: z.string().min(1).max(200),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().int().min(100).max(50000).default(5000),
  }),

  // Booking QR validation
  bookingValidateQr: z.object({
    bookingId: z.number().int().positive(),
    gymId: z.number().int().positive(),
    scannedBy: z.string().uuid(),
  }),

  // Notify admin
  notifyAdmin: z.object({
    type: z.enum(['partner_application', 'support_ticket', 'content_flagged', 'payment_issue']),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
    metadata: z.record(z.unknown()).optional(),
  }),

  // Firecrawl scrape
  firecrawlScrape: z.object({
    url: z.string().url(),
    gymId: z.number().int().positive().optional(),
  }),

  // Payments create intent
  paymentsCreateIntent: z.object({
    gymId: z.number().int().positive(),
    passType: z.enum(['day', 'week', 'month']),
    bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
};

// ============================================================================
// VALIDATION HELPER
// ============================================================================

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; details?: z.ZodError };

export async function validateRequest<T extends z.ZodSchema>(
  req: Request,
  schema: T
): Promise<ValidationResult<z.infer<T>>> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: `Validation failed: ${errors}`, details: result.error };
    }
    
    return { success: true, data: result.data };
  } catch {
    return { success: false, error: 'Invalid JSON body' };
  }
}

export { z };

