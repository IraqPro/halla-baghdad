import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { participantSchema } from "@/lib/validations/participant";

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
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

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." 
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Server-side validation
    const validationResult = participantSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { 
          success: false, 
          error: "بيانات غير صالحة", 
          errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Sanitize inputs (basic XSS prevention)
    const sanitizedData = {
      name: data.name.trim().replace(/<[^>]*>/g, ""),
      phoneNumber: data.phoneNumber.trim().replace(/<[^>]*>/g, ""),
      residence: data.residence.trim().replace(/<[^>]*>/g, ""),
      healthCondition: data.healthCondition.trim().replace(/<[^>]*>/g, ""),
      sportLevel: data.sportLevel.trim().replace(/<[^>]*>/g, ""),
    };

    // Insert into database
    const result = await db
      .insert(participants)
      .values(sanitizedData)
      .returning({ id: participants.id });

    const participantId = result[0].id;

    return NextResponse.json(
      {
        success: true,
        message: "تم التسجيل بنجاح!",
        data: {
          id: participantId,
          name: sanitizedData.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Check for duplicate entry or other DB errors
    if (error instanceof Error) {
      if (error.message.includes("duplicate")) {
        return NextResponse.json(
          { 
            success: false, 
            error: "هذا المشارك مسجل مسبقاً" 
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "حدث خطأ في الخادم. يرجى المحاولة لاحقاً." 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
