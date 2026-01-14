import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

// This route creates an initial super_admin user
// IMPORTANT: Delete this route or disable it in production after creating the admin
export async function POST(request: NextRequest) {
  try {
    // Security: Only allow in development or with a secret key
    const authHeader = request.headers.get("x-seed-secret");
    const seedSecret = process.env.ADMIN_SEED_SECRET;

    if (!seedSecret || authHeader !== seedSecret) {
      return NextResponse.json(
        { error: "غير مصرح" },
        { status: 403 }
      );
    }

    // Parse body
    const body = await request.json();
    const { username, password, displayName } = body;

    if (!username || !password || !displayName) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة: username, password, displayName" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username.toLowerCase()))
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { error: "اسم المستخدم موجود بالفعل" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create super admin
    const [newAdmin] = await db
      .insert(admins)
      .values({
        username: username.toLowerCase(),
        passwordHash,
        displayName,
        role: "super_admin",
        isActive: true,
      })
      .returning({
        id: admins.id,
        username: admins.username,
        displayName: admins.displayName,
        role: admins.role,
      });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء المدير بنجاح",
      admin: newAdmin,
    }, { status: 201 });
  } catch (error) {
    console.error("Seed admin error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في إنشاء المدير" },
      { status: 500 }
    );
  }
}
