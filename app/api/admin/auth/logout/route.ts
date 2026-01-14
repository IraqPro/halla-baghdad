import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST() {
  try {
    // Clear all auth cookies
    await clearAuthCookies();

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    });
  } catch (error) {
    console.error("Logout error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في تسجيل الخروج" },
      { status: 500 }
    );
  }
}
