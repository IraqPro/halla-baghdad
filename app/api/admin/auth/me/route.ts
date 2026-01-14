import { NextRequest, NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/auth/middleware";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await protectApiRoute(request);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get fresh admin data from database
    const [admin] = await db
      .select({
        id: admins.id,
        username: admins.username,
        displayName: admins.displayName,
        role: admins.role,
        lastLoginAt: admins.lastLoginAt,
      })
      .from(admins)
      .where(eq(admins.id, authResult.user.userId))
      .limit(1);

    if (!admin) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: admin,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في جلب بيانات المستخدم" },
      { status: 500 }
    );
  }
}
