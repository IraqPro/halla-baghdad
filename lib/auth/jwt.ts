import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production-immediately"
);
const ACCESS_TOKEN_EXPIRY = "15m"; // Short-lived access token
const REFRESH_TOKEN_EXPIRY = "7d"; // Longer-lived refresh token

export interface TokenPayload extends JWTPayload {
  userId: string;
  username: string;
  role: string;
  type: "access" | "refresh";
}

// Generate Access Token
export async function generateAccessToken(payload: {
  userId: string;
  username: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    ...payload,
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .setJti(crypto.randomUUID()) // Unique token ID to prevent replay attacks
    .sign(JWT_SECRET);
}

// Generate Refresh Token
export async function generateRefreshToken(payload: {
  userId: string;
  username: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    ...payload,
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setJti(crypto.randomUUID())
    .sign(JWT_SECRET);
}

// Verify Token
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

// Set secure HTTP-only cookies
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
): Promise<void> {
  const cookieStore = await cookies();
  
  // Access token cookie - short-lived
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  // Refresh token cookie - longer-lived
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin/auth/refresh",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// Clear auth cookies
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin/auth/refresh",
    maxAge: 0,
  });
}

// Get current user from cookies
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  const payload = await verifyToken(accessToken);
  
  if (!payload || payload.type !== "access") {
    return null;
  }

  return payload;
}
