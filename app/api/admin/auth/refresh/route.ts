import { NextRequest, NextResponse } from "next/server";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "لا يوجد رمز تحديث" },
        { status: 401 }
      );
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken);

    if (!payload || payload.type !== "refresh") {
      await clearAuthCookies();
      
      return NextResponse.json(
        { error: "رمز التحديث غير صالح" },
        { status: 401 }
      );
    }

    // Verify user still exists and is active
    const [admin] = await db
      .select()
      .from(admins)
      .where(
        and(
          eq(admins.id, payload.userId),
          eq(admins.isActive, true)
        )
      )
      .limit(1);

    if (!admin) {
      await clearAuthCookies();
      
      return NextResponse.json(
        { error: "المستخدم غير موجود أو غير نشط" },
        { status: 401 }
      );
    }

    // Generate new tokens
    const tokenPayload = {
      userId: admin.id,
      username: admin.username,
      role: admin.role,
    };

    const newAccessToken = await generateAccessToken(tokenPayload);
    const newRefreshToken = await generateRefreshToken(tokenPayload);

    // Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({
      success: true,
      message: "تم تحديث الجلسة بنجاح",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    
    // Clear cookies on any error
    await clearAuthCookies();
    
    return NextResponse.json(
      { error: "حدث خطأ في تحديث الجلسة" },
      { status: 500 }
    );
  }
}
