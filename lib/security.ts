import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Secure storage keys
export const SECURE_KEYS = {
  AUTH_TOKEN: 'scout_auth_token',
  REFRESH_TOKEN: 'scout_refresh_token',
  USER_ID: 'scout_user_id',
  BIOMETRIC_ENABLED: 'scout_biometric_enabled',
} as const;

// Secure storage wrapper with encryption
export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error('SecureStore set error:', error);
      throw new Error('Failed to store secure data');
    }
  },

  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore get error:', error);
      return null;
    }
  },

  async delete(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore delete error:', error);
    }
  },

  async clearAll(): Promise<void> {
    const keys = Object.values(SECURE_KEYS);
    await Promise.all(keys.map((key) => this.delete(key)));
  },
};

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password strength validation
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Password should be at least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Include both uppercase and lowercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Include at least one number');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('Include at least one special character');

  return {
    score: Math.min(score, 4),
    feedback,
    isStrong: score >= 3,
  };
}

// Rate limiting for sensitive operations
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60000
): { allowed: boolean; remainingAttempts: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetIn: windowMs };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remainingAttempts: 0,
      resetIn: record.resetTime - now,
    };
  }

  record.count++;
  return {
    allowed: true,
    remainingAttempts: maxAttempts - record.count,
    resetIn: record.resetTime - now,
  };
}

// Security headers for API requests
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

// Mask sensitive data for logging
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length);
  }
  const start = data.slice(0, visibleChars);
  const end = data.slice(-visibleChars);
  const masked = '*'.repeat(data.length - visibleChars * 2);
  return `${start}${masked}${end}`;
}

// Validate Stripe payment data (PCI compliance)
export function validatePaymentData(cardNumber: string): boolean {
  // Luhn algorithm for card number validation
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

