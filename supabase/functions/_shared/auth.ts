/**
 * Shared authentication utilities for Supabase Edge Functions
 * Provides JWT validation against Supabase Auth
 */

import { createClient, SupabaseClient, User } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

export interface AuthResult {
  user: User | null;
  error: string | null;
  supabase: SupabaseClient;
}

/**
 * Validates the JWT token from the Authorization header
 * Returns the authenticated user or an error
 */
export async function validateAuth(req: Request): Promise<AuthResult> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return { user: null, error: 'Missing Authorization header', supabase };
  }

  if (!authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Invalid Authorization header format', supabase };
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    return { user: null, error: 'Missing token', supabase };
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error) {
    return { user: null, error: `Invalid token: ${error.message}`, supabase };
  }

  if (!user) {
    return { user: null, error: 'User not found', supabase };
  }

  return { user, error: null, supabase };
}

/**
 * Creates an unauthorized response with proper headers
 */
export function unauthorizedResponse(message: string): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: 401, 
      headers: { 
        "Content-Type": "application/json",
        "WWW-Authenticate": "Bearer"
      } 
    }
  );
}

/**
 * Middleware-style function that validates auth and returns user or error response
 * Usage:
 *   const authResult = await requireAuth(req);
 *   if (authResult instanceof Response) return authResult; // Auth failed
 *   const { user, supabase } = authResult; // Auth success
 */
export async function requireAuth(req: Request): Promise<AuthResult | Response> {
  const result = await validateAuth(req);
  
  if (result.error) {
    return unauthorizedResponse(result.error);
  }
  
  return result;
}

