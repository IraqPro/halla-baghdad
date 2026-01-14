import { NextRequest, NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/auth/middleware";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Allowed image types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Validate file type by checking magic bytes (more secure than just extension)
function validateImageMagicBytes(buffer: Buffer): { valid: boolean; type: string | null } {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, type: "jpeg" };
  }
  
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, type: "png" };
  }
  
  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { valid: true, type: "gif" };
  }
  
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, type: "webp" };
  }
  
  return { valid: false, type: null };
}

// Sanitize filename to prevent path traversal
function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  return filename
    .replace(/[/\\:*?"<>|]/g, "")
    .replace(/\x00/g, "")
    .replace(/\.\./g, "");
}

// Generate unique filename
function generateUniqueFilename(originalName: string, detectedType: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitized = sanitizeFilename(originalName);
  const nameWithoutExt = sanitized.replace(/\.[^/.]+$/, "");
  const safeName = nameWithoutExt.substring(0, 50); // Limit name length
  
  return `${safeName}-${timestamp}-${random}.${detectedType}`;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (only admin and super_admin can upload)
    const authResult = await protectApiRoute(request, ["admin", "super_admin"]);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "لم يتم اختيار ملف" },
        { status: 400 }
      );
    }

    // Validate MIME type (client-provided, not fully trusted)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          error: "نوع الملف غير مدعوم",
          details: "الأنواع المدعومة: JPG, PNG, WebP, GIF" 
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          error: "حجم الملف كبير جداً",
          details: "الحد الأقصى: 5 ميجابايت" 
        },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (more secure validation)
    const magicValidation = validateImageMagicBytes(buffer);
    
    if (!magicValidation.valid || !magicValidation.type) {
      return NextResponse.json(
        { 
          error: "الملف ليس صورة صالحة",
          details: "تأكد من أن الملف صورة حقيقية" 
        },
        { status: 400 }
      );
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "celebrities");
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name, magicValidation.type);
    const filepath = path.join(uploadDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/celebrities/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: magicValidation.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    
    return NextResponse.json(
      { error: "حدث خطأ في رفع الصورة" },
      { status: 500 }
    );
  }
}

// GET - Return upload constraints for client validation
export async function GET() {
  return NextResponse.json({
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / (1024 * 1024),
    allowedTypes: ALLOWED_TYPES,
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  });
}
