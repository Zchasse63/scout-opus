/**
 * Shared validators using Zod
 */
import { z } from 'zod';
import { PASS_TYPES, BOOKING_STATUSES, PUSH_TYPES, EMAIL_TYPES } from './constants';

// Email validator
export const emailSchema = z.string().email('Invalid email address');

// Phone validator (basic international format)
export const phoneSchema = z.string().regex(
  /^\+?[1-9]\d{1,14}$/,
  'Invalid phone number format'
);

// UUID validator
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Date string validator (YYYY-MM-DD)
export const dateStringSchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must be in YYYY-MM-DD format'
);

// Location validator
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Pass type validator
export const passTypeSchema = z.enum(PASS_TYPES);

// Booking status validator
export const bookingStatusSchema = z.enum(BOOKING_STATUSES);

// Push notification type validator
export const pushTypeSchema = z.enum(PUSH_TYPES);

// Email type validator
export const emailTypeSchema = z.enum(EMAIL_TYPES);

// Booking request validator
export const bookingRequestSchema = z.object({
  gymId: z.number().int().positive(),
  passType: passTypeSchema,
  bookingDate: dateStringSchema,
});

// Review validator
export const reviewSchema = z.object({
  gymId: z.number().int().positive(),
  bookingId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

// Support ticket validator
export const supportTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// Partner application validator
export const partnerApplicationSchema = z.object({
  gymName: z.string().min(2).max(200),
  address: z.string().min(10).max(500),
  contactName: z.string().min(2).max(100),
  contactEmail: emailSchema,
  contactPhone: phoneSchema.optional(),
  website: z.string().url().optional(),
  description: z.string().max(2000).optional(),
});

// Price validator
export const priceSchema = z.number().positive().multipleOf(0.01);

// Gym pricing validator
export const gymPricingSchema = z.object({
  dayPassPrice: priceSchema.min(5),
  weekPassPrice: priceSchema.min(20).optional(),
  monthPassPrice: priceSchema.min(50).optional(),
});

// Search query validator
export const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  location: locationSchema.optional(),
  filters: z.array(z.string()).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

// Voice query validator
export const voiceQuerySchema = z.object({
  transcript: z.string().min(1).max(1000),
  userLocation: locationSchema.optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
  previousIntent: z.record(z.unknown()).optional(),
});

// Helper function to validate and return typed result
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.errors.map(e => e.message).join(', ') };
}

