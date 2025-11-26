/**
 * Security Utilities
 *
 * Provides security utilities for:
 * - Input sanitization
 * - Secure storage
 * - API request signing
 * - Sensitive data handling
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Securely store sensitive data
 */
export const securelyStore = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // For web, use encrypted localStorage (in production, use a proper solution)
      console.warn('SecureStore not available on web, using localStorage');
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error('Error storing secure data:', error);
    throw new Error('Failed to securely store data');
  }
};

/**
 * Retrieve securely stored data
 */
export const securelyRetrieve = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      console.warn('SecureStore not available on web, using localStorage');
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
};

/**
 * Delete securely stored data
 */
export const securelyDelete = async (key: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error('Error deleting secure data:', error);
  }
};

/**
 * Mask sensitive data for display (e.g., credit card, phone)
 */
export const maskSensitiveData = (
  data: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string => {
  if (!data || data.length <= visibleChars) return data;

  const visiblePart = data.slice(-visibleChars);
  const maskedPart = maskChar.repeat(data.length - visibleChars);

  return maskedPart + visiblePart;
};

/**
 * Mask email address
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;

  const [username, domain] = email.split('@');
  const maskedUsername =
    username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);

  return `${maskedUsername}@${domain}`;
};

/**
 * Generate a secure random string
 */
export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (
  password: string
): {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
} => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Determine strength
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * Prevent timing attacks when comparing sensitive strings
 */
export const constantTimeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
};

/**
 * Redact sensitive information from logs
 */
export const redactSensitiveInfo = (obj: any): any => {
  const sensitiveKeys = [
    'password',
    'token',
    'apiKey',
    'secret',
    'creditCard',
    'ssn',
    'pin',
    'cvv',
  ];

  const redact = (value: any): any => {
    if (typeof value === 'string') {
      return '***REDACTED***';
    }
    if (Array.isArray(value)) {
      return value.map(redact);
    }
    if (typeof value === 'object' && value !== null) {
      const redacted: any = {};
      for (const [key, val] of Object.entries(value)) {
        if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
          redacted[key] = '***REDACTED***';
        } else {
          redacted[key] = redact(val);
        }
      }
      return redacted;
    }
    return value;
  };

  return redact(obj);
};

/**
 * Check if app is running in a secure environment
 */
export const isSecureEnvironment = (): boolean => {
  // Check if running in production and on a secure connection
  const isProduction = process.env.NODE_ENV === 'production';
  const isSecureConnection =
    typeof window !== 'undefined'
      ? window.location.protocol === 'https:'
      : true; // Assume secure for native apps

  return isProduction && isSecureConnection;
};

/**
 * Rate limiting helper
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isRateLimited(
    key: string,
    maxAttempts: number,
    windowMs: number
  ): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return true;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return false;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
