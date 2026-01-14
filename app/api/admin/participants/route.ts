import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { protectApiRoute } from "@/lib/auth/middleware";
import { desc, sql } from "drizzle-orm";

// GET - List all participants with pagination
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await protectApiRoute(request);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Build query
    let query = db.select().from(participants);
    
    // Search filter
    if (search) {
      query = query.where(
        sql`${participants.name} ILIKE ${"%" + search + "%"} OR ${participants.phoneNumber} ILIKE ${"%" + search + "%"}`
      ) as typeof query;
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(participants)
      .where(
        search 
          ? sql`${participants.name} ILIKE ${"%" + search + "%"} OR ${participants.phoneNumber} ILIKE ${"%" + search + "%"}`
          : undefined
      );

    // Get paginated results
    const results = await query
      .orderBy(desc(participants.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  } catch (error) {
    console.error("Get participants error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في جلب المشاركين" },
      { status: 500 }
    );
  }
}
