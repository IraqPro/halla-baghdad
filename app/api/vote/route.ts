import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { celebrities, votes } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

// Validation schema for voting
const voteSchema = z.object({
  celebrityId: z.string().uuid("معرف المشهور غير صالح"),
  fingerprint: z.string().min(32, "البصمة غير صالحة"),
  screenResolution: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0] : "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Hash fingerprint for additional security
function hashFingerprint(fingerprint: string, ip: string): string {
  return crypto
    .createHash("sha256")
    .update(`${fingerprint}-${ip}-hala-baghdad-vote`)
    .digest("hex");
}

// GET - Fetch all celebrities with vote counts
export async function GET() {
  try {
    const result = await db
      .select({
        id: celebrities.id,
        name: celebrities.name,
        image: celebrities.image,
        description: celebrities.description,
        category: celebrities.category,
        socialLinks: celebrities.socialLinks,
        voteCount: sql<number>`COALESCE(COUNT(${votes.id}), 0)::int`,
      })
      .from(celebrities)
      .leftJoin(votes, eq(celebrities.id, votes.celebrityId))
      .where(eq(celebrities.isActive, true))
      .groupBy(celebrities.id)
      .orderBy(desc(sql`COUNT(${votes.id})`));

    // Calculate total votes
    const totalVotes = result.reduce((sum, c) => sum + c.voteCount, 0);

    return NextResponse.json({
      success: true,
      data: {
        celebrities: result,
        totalVotes,
      },
    });
  } catch (error) {
    console.error("Error fetching celebrities:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في جلب البيانات" },
      { status: 500 }
    );
  }
}

// POST - Submit a vote
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getRateLimitKey(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "تم تجاوز الحد المسموح. حاول لاحقاً." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = voteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.issues[0]?.message || "بيانات غير صالحة" 
        },
        { status: 400 }
      );
    }

    const { celebrityId, fingerprint, screenResolution, timezone, language } = validation.data;

    // Hash the fingerprint with IP for extra security
    const hashedFingerprint = hashFingerprint(fingerprint, ip);

    // Check if celebrity exists
    const celebrity = await db
      .select()
      .from(celebrities)
      .where(eq(celebrities.id, celebrityId))
      .limit(1);

    if (celebrity.length === 0) {
      return NextResponse.json(
        { success: false, error: "المشهور غير موجود" },
        { status: 404 }
      );
    }

    // Check if this device already voted (using hashed fingerprint)
    const existingVote = await db
      .select()
      .from(votes)
      .where(eq(votes.deviceFingerprint, hashedFingerprint))
      .limit(1);

    if (existingVote.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: "لقد قمت بالتصويت مسبقاً. يمكنك التصويت مرة واحدة فقط.",
          alreadyVoted: true,
          votedFor: existingVote[0].celebrityId,
        },
        { status: 409 }
      );
    }

    // Insert the vote
    const userAgent = request.headers.get("user-agent") || "";

    await db.insert(votes).values({
      celebrityId,
      deviceFingerprint: hashedFingerprint,
      ipAddress: ip,
      userAgent,
      screenResolution,
      timezone,
      language,
    });

    // Get updated vote count
    const voteCount = await db
      .select({ count: sql<number>`COUNT(*)::int` })
      .from(votes)
      .where(eq(votes.celebrityId, celebrityId));

    return NextResponse.json(
      {
        success: true,
        message: "تم تسجيل صوتك بنجاح! شكراً لمشاركتك.",
        data: {
          celebrityId,
          newVoteCount: voteCount[0]?.count || 1,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في تسجيل الصوت" },
      { status: 500 }
    );
  }
}

// Check vote status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { success: false, error: "البصمة مطلوبة" },
        { status: 400 }
      );
    }

    const ip = getRateLimitKey(request);
    const hashedFingerprint = hashFingerprint(fingerprint, ip);

    const existingVote = await db
      .select({ celebrityId: votes.celebrityId })
      .from(votes)
      .where(eq(votes.deviceFingerprint, hashedFingerprint))
      .limit(1);

    return NextResponse.json({
      success: true,
      hasVoted: existingVote.length > 0,
      votedFor: existingVote[0]?.celebrityId || null,
    });
  } catch (error) {
    console.error("Error checking vote status:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ" },
      { status: 500 }
    );
  }
}
