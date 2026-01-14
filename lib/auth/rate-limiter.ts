// Simple in-memory rate limiter for login attempts
// In production, use Redis for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Max 5 attempts per window
const LOCKOUT_MULTIPLIER = 2; // Double lockout time after each failure

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of loginAttempts.entries()) {
    if (now > entry.resetTime) {
      loginAttempts.delete(key);
    }
  }
}, 60000); // Clean up every minute

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  retryAfter?: number; // Seconds until rate limit resets
  message?: string;
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  // If no entry or entry has expired, allow
  if (!entry || now > entry.resetTime) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  // If within window and under limit
  if (entry.count < MAX_ATTEMPTS) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - entry.count,
    };
  }

  // Rate limited
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  return {
    allowed: false,
    remainingAttempts: 0,
    retryAfter,
    message: `تم تجاوز عدد المحاولات. يرجى الانتظار ${Math.ceil(retryAfter / 60)} دقيقة`,
  };
}

export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First attempt or expired entry
    loginAttempts.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
  } else {
    // Increment count and potentially extend lockout
    const newCount = entry.count + 1;
    const lockoutExtension = newCount >= MAX_ATTEMPTS 
      ? WINDOW_MS * Math.pow(LOCKOUT_MULTIPLIER, newCount - MAX_ATTEMPTS)
      : 0;
    
    loginAttempts.set(identifier, {
      count: newCount,
      resetTime: Math.max(entry.resetTime, now + lockoutExtension),
    });
  }
}

export function clearRateLimit(identifier: string): void {
  loginAttempts.delete(identifier);
}

// Get combined identifier from IP and username
export function getRateLimitKey(ip: string, username: string): string {
  return `${ip}:${username}`;
}
