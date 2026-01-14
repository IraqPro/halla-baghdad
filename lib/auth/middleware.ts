import { NextRequest, NextResponse } from "next/server";
import { verifyToken, TokenPayload } from "./jwt";

export type AdminRole = "super_admin" | "admin" | "moderator";

// Protect API route and get current user
export async function protectApiRoute(
  request: NextRequest,
  allowedRoles?: AdminRole[]
): Promise<{ success: true; user: TokenPayload } | { success: false; response: NextResponse }> {
  // Get token from cookie
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "غير مصرح - يرجى تسجيل الدخول" },
        { status: 401 }
      ),
    };
  }

  // Verify token
  const payload = await verifyToken(accessToken);

  if (!payload || payload.type !== "access") {
    return {
      success: false,
      response: NextResponse.json(
        { error: "انتهت صلاحية الجلسة - يرجى تسجيل الدخول مجدداً" },
        { status: 401 }
      ),
    };
  }

  // Check role if specified
  if (allowedRoles && !allowedRoles.includes(payload.role as AdminRole)) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "غير مصرح - ليس لديك صلاحيات كافية" },
        { status: 403 }
      ),
    };
  }

  return {
    success: true,
    user: payload,
  };
}

// CSRF Token validation for state-changing operations
export function validateCsrfToken(request: NextRequest): boolean {
  const csrfCookie = request.cookies.get("csrf_token")?.value;
  const csrfHeader = request.headers.get("x-csrf-token");

  if (!csrfCookie || !csrfHeader) {
    return false;
  }

  return csrfCookie === csrfHeader;
}

// Generate CSRF token
export function generateCsrfToken(): string {
  return crypto.randomUUID();
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Extract client IP from request
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}
