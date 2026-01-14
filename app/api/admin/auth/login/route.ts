import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from "@/lib/auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  getRateLimitKey,
} from "@/lib/auth/rate-limiter";
import { getClientIP } from "@/lib/auth/middleware";

// Login schema with strict validation
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "اسم المستخدم قصير جداً")
    .max(50, "اسم المستخدم طويل جداً")
    .regex(/^[a-zA-Z0-9_]+$/, "اسم المستخدم يجب أن يحتوي على أحرف وأرقام فقط"),
  password: z
    .string()
    .min(8, "كلمة المرور قصيرة جداً")
    .max(128, "كلمة المرور طويلة جداً"),
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "بيانات غير صالحة",
          details: validation.error.issues.map(issue => issue.message)
        },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Check rate limit
    const rateLimitKey = getRateLimitKey(clientIP, username);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: rateLimit.message,
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter || 60),
          }
        }
      );
    }

    // Find admin user (case-insensitive username match)
    const [admin] = await db
      .select()
      .from(admins)
      .where(
        and(
          eq(admins.username, username.toLowerCase()),
          eq(admins.isActive, true)
        )
      )
      .limit(1);

    // If no admin found, record failed attempt and return generic error
    // Use generic error to prevent username enumeration
    if (!admin) {
      recordFailedAttempt(rateLimitKey);
      
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      return NextResponse.json(
        { error: "اسم المستخدم أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (admin.lockedUntil && new Date(admin.lockedUntil) > new Date()) {
      const remainingMinutes = Math.ceil(
        (new Date(admin.lockedUntil).getTime() - Date.now()) / 60000
      );
      
      return NextResponse.json(
        { 
          error: `الحساب مقفل. يرجى المحاولة بعد ${remainingMinutes} دقيقة`,
          lockedUntil: admin.lockedUntil 
        },
        { status: 423 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, admin.passwordHash);

    if (!isValidPassword) {
      recordFailedAttempt(rateLimitKey);
      
      // Update login attempts in database
      const currentAttempts = parseInt(admin.loginAttempts || "0") + 1;
      
      // Lock account after 5 failed attempts
      const shouldLock = currentAttempts >= 5;
      const lockUntil = shouldLock 
        ? new Date(Date.now() + 15 * 60 * 1000) // 15 minutes lockout
        : null;

      await db
        .update(admins)
        .set({ 
          loginAttempts: String(currentAttempts),
          lockedUntil: lockUntil,
          updatedAt: new Date()
        })
        .where(eq(admins.id, admin.id));

      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

      return NextResponse.json(
        { 
          error: "اسم المستخدم أو كلمة المرور غير صحيحة",
          remainingAttempts: rateLimit.remainingAttempts - 1
        },
        { status: 401 }
      );
    }

    // Successful login - clear rate limit and reset login attempts
    clearRateLimit(rateLimitKey);

    // Update admin record
    await db
      .update(admins)
      .set({
        lastLoginAt: new Date(),
        loginAttempts: "0",
        lockedUntil: null,
        updatedAt: new Date()
      })
      .where(eq(admins.id, admin.id));

    // Generate tokens
    const tokenPayload = {
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    };

    const accessToken = await generateAccessToken(tokenPayload);
    const refreshToken = await generateRefreshToken(tokenPayload);

    // Set secure cookies
    await setAuthCookies(accessToken, refreshToken);

    // Return success response (without sensitive data)
    return NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        username: admin.username,
        displayName: admin.displayName,
        role: admin.role,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في تسجيل الدخول" },
      { status: 500 }
    );
  }
}
