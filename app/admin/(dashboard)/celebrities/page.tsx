"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Star,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Upload,
  FileImage,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/common/glass-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TikTokIcon } from "@/components/icons";

interface SocialLink {
  type: "instagram" | "facebook" | "twitter" | "youtube" | "tiktok";
  url: string;
}

interface Celebrity {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  socialLinks: SocialLink[];
  isActive: boolean;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const socialLinkSchema = z.object({
  type: z.enum(["instagram", "facebook", "twitter", "youtube", "tiktok"]),
  url: z.string().url("رابط غير صالح"),
});

// Custom image validation - accepts URL, local path, or pending upload
const imageSchema = z.string().min(1, "الصورة مطلوبة").refine(
  (val) => {
    // Accept pending uploads
    if (val.startsWith("pending:")) {
      return true;
    }
    // Accept local paths starting with /
    if (val.startsWith("/")) {
      return true;
    }
    // Accept valid URLs
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "رابط الصورة غير صالح" }
);

const celebritySchema = z.object({
  name: z.string().min(2, "الاسم قصير جداً").max(255, "الاسم طويل جداً"),
  image: imageSchema,
  description: z.string().min(10, "الوصف قصير جداً").max(1000, "الوصف طويل جداً"),
  category: z.string().min(2, "التصنيف مطلوب"),
  isActive: z.boolean(),
});

type CelebrityFormData = z.infer<typeof celebritySchema>;

// Client-side image validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const categories = [
  { value: "صانع محتوى", label: "صانع محتوى" },
  { value: "فنان", label: "فنان" },
  { value: "رياضي", label: "رياضي" },
  { value: "إعلامي", label: "إعلامي" },
  { value: "أخرى", label: "أخرى" },
];

const socialPlatforms = [
  { type: "instagram", label: "إنستغرام", icon: Instagram },
  { type: "facebook", label: "فيسبوك", icon: Facebook },
  { type: "twitter", label: "تويتر", icon: Twitter },
  { type: "youtube", label: "يوتيوب", icon: Youtube },
  { type: "tiktok", label: "تيك توك", icon: TikTokIcon },
] as const;

// Client-side validation for image file
function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `نوع الملف غير مدعوم. الأنواع المدعومة: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `حجم الملف كبير جداً. الحد الأقصى: ${MAX_FILE_SIZE / (1024 * 1024)} ميجابايت`,
    };
  }

  // Check file extension
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
    fileName.endsWith(ext)
  );
  if (!hasValidExtension) {
    return {
      valid: false,
      error: `امتداد الملف غير صالح. الامتدادات المدعومة: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  return { valid: true };
}

export default function CelebritiesPage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialLink, setNewSocialLink] = useState<{ type: string; url: string }>({
    type: "instagram",
    url: "",
  });
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CelebrityFormData>({
    resolver: zodResolver(celebritySchema),
    defaultValues: {
      isActive: true,
    },
  });

  const currentImageUrl = watch("image");

  const fetchCelebrities = useCallback(async (page: number, searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/admin/celebrities?${params}`);
      const data = await res.json();

      if (data.success) {
        setCelebrities(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching celebrities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCelebrities(pagination.page, search);
  }, [pagination.page, fetchCelebrities, search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (pagination.page === 1) {
        fetchCelebrities(1, search);
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, fetchCelebrities, pagination.page]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Clean up image preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const resetImageState = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
    setUseUrlInput(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCreateDialog = () => {
    setEditingCelebrity(null);
    setSocialLinks([]);
    resetImageState();
    reset({
      name: "",
      image: "",
      description: "",
      category: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (celebrity: Celebrity) => {
    setEditingCelebrity(celebrity);
    setSocialLinks(celebrity.socialLinks || []);
    resetImageState();
    // If existing image is a URL (not local), use URL input mode
    if (celebrity.image && !celebrity.image.startsWith("/celebrities/")) {
      setUseUrlInput(true);
    }
    setImagePreview(celebrity.image);
    reset({
      name: celebrity.name,
      image: celebrity.image,
      description: celebrity.description,
      category: celebrity.category,
      isActive: celebrity.isActive,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCelebrity(null);
    setSocialLinks([]);
    resetImageState();
    reset();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "خطأ في الملف");
      return;
    }

    setUploadError(null);
    setImageFile(file);
    
    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Set a placeholder value for form validation (will be replaced after upload)
    setValue("image", `pending:${file.name}`);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setUploadError(data.error || "فشل رفع الصورة");
        return null;
      }

      return data.url;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("حدث خطأ في رفع الصورة");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || "خطأ في الملف");
        return;
      }

      setUploadError(null);
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Set a placeholder value for form validation
      setValue("image", `pending:${file.name}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const addSocialLink = () => {
    const validation = socialLinkSchema.safeParse(newSocialLink);
    if (!validation.success) {
      setToast({ type: "error", message: "الرابط غير صالح" });
      return;
    }

    if (socialLinks.some((link) => link.type === newSocialLink.type)) {
      setToast({ type: "error", message: "هذه المنصة مضافة مسبقاً" });
      return;
    }

    setSocialLinks([...socialLinks, validation.data as SocialLink]);
    setNewSocialLink({ type: "instagram", url: "" });
  };

  const removeSocialLink = (type: string) => {
    setSocialLinks(socialLinks.filter((link) => link.type !== type));
  };

  const onSubmit = async (data: CelebrityFormData) => {
    setIsSubmitting(true);

    try {
      let imageUrl = data.image;

      // If there's a new file to upload, upload it first
      if (imageFile && !useUrlInput) {
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const payload = {
        ...data,
        image: imageUrl,
        socialLinks,
        ...(editingCelebrity && { id: editingCelebrity.id }),
      };

      const res = await fetch("/api/admin/celebrities", {
        method: editingCelebrity ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: result.error || "حدث خطأ" });
        return;
      }

      setToast({
        type: "success",
        message: editingCelebrity ? "تم تحديث المشهور بنجاح" : "تم إضافة المشهور بنجاح",
      });
      closeDialog();
      fetchCelebrities(pagination.page, search);
    } catch {
      setToast({ type: "error", message: "حدث خطأ في الاتصال" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCelebrity = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشهور؟")) return;

    try {
      const res = await fetch(`/api/admin/celebrities?id=${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: result.error || "حدث خطأ في الحذف" });
        return;
      }

      setToast({ type: "success", message: "تم حذف المشهور بنجاح" });
      fetchCelebrities(pagination.page, search);
    } catch {
      setToast({ type: "error", message: "حدث خطأ في الاتصال" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-destructive text-destructive-foreground"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Star size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">المشاهير</h1>
            <p className="text-muted-foreground text-sm">
              {pagination.total} مشهور مسجل
            </p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus size={18} />
          إضافة مشهور
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </GlassCard>
      </motion.div>

      {/* Celebrities Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : celebrities.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Star size={48} className="opacity-20 mb-4" />
            <p>لا يوجد مشاهير</p>
            <Button variant="link" onClick={openCreateDialog} className="mt-2">
              إضافة أول مشهور
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {celebrities.map((celebrity, index) => (
              <motion.div
                key={celebrity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="overflow-hidden">
                  {/* Image */}
                  <div className="relative aspect-video bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/demo.jpg";
                      }}
                    />
                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                        celebrity.isActive
                          ? "bg-emerald-500/90 text-white"
                          : "bg-muted/90 text-muted-foreground"
                      }`}
                    >
                      {celebrity.isActive ? "نشط" : "غير نشط"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {celebrity.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {celebrity.description}
                    </p>

                    {/* Category */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {categories.find((c) => c.value === celebrity.category)?.label ||
                          celebrity.category}
                      </span>
                    </div>

                    {/* Social Links */}
                    {celebrity.socialLinks?.length > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        {celebrity.socialLinks.map((link) => {
                          const platform = socialPlatforms.find(
                            (p) => p.type === link.type
                          );
                          if (!platform) return null;
                          const IconComponent = platform.icon;
                          return (
                            <a
                              key={link.type}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                            >
                              <IconComponent size={16} />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => openEditDialog(celebrity)}
                      >
                        <Edit2 size={14} />
                        تعديل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteCelebrity(celebrity.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              صفحة {pagination.page} من {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
              >
                <ChevronRight size={16} />
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
              >
                التالي
                <ChevronLeft size={16} />
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCelebrity ? "تعديل المشهور" : "إضافة مشهور جديد"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input
                id="name"
                placeholder="أدخل اسم المشهور"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>الصورة</Label>
                <button
                  type="button"
                  onClick={() => {
                    setUseUrlInput(!useUrlInput);
                    if (!useUrlInput) {
                      resetImageState();
                    }
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  {useUrlInput ? "رفع صورة" : "استخدام رابط URL"}
                </button>
              </div>

              {useUrlInput ? (
                // URL Input Mode
                <div className="space-y-2">
                  <div className="relative">
                    <ImageIcon
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      placeholder="https://example.com/image.jpg"
                      className="pr-10"
                      {...register("image")}
                    />
                  </div>
                  {currentImageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                // File Upload Mode
                <div className="space-y-3">
                  {/* Dropzone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                      transition-colors duration-200
                      ${uploadError 
                        ? "border-destructive bg-destructive/5" 
                        : "border-border hover:border-primary hover:bg-primary/5"
                      }
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={ALLOWED_TYPES.join(",")}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {imagePreview ? (
                      <div className="space-y-3">
                        <div className="relative aspect-video max-w-[200px] mx-auto rounded-lg overflow-hidden bg-muted">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {imageFile?.name || "الصورة الحالية"}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetImageState();
                            setValue("image", "");
                          }}
                        >
                          <X size={14} className="ml-1" />
                          إزالة الصورة
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                          <FileImage size={32} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            اسحب الصورة هنا أو انقر للاختيار
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            PNG, JPG, WebP, GIF (حتى 5 ميجابايت)
                          </p>
                        </div>
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-xl">
                        <div className="flex items-center gap-2 text-primary">
                          <Loader2 className="animate-spin" size={24} />
                          <span>جاري رفع الصورة...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {uploadError && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle size={16} />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Hidden input for form validation */}
                  <input type="hidden" {...register("image")} />
                </div>
              )}

              {errors.image && !uploadError && (
                <p className="text-destructive text-sm">{errors.image.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <textarea
                id="description"
                placeholder="أدخل وصف المشهور..."
                className="w-full min-h-[100px] px-3 py-2 rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-destructive text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                onValueChange={(value) => setValue("category", value)}
                defaultValue={editingCelebrity?.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-destructive text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <Label>روابط التواصل الاجتماعي</Label>
              
              {/* Existing Links */}
              {socialLinks.length > 0 && (
                <div className="space-y-2">
                  {socialLinks.map((link) => {
                    const platform = socialPlatforms.find(
                      (p) => p.type === link.type
                    );
                    if (!platform) return null;
                    const IconComponent = platform.icon;
                    return (
                      <div
                        key={link.type}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <IconComponent size={16} className="text-muted-foreground" />
                        <span className="text-sm flex-1 truncate">{link.url}</span>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(link.type)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Link */}
              <div className="flex gap-2">
                <Select
                  value={newSocialLink.type}
                  onValueChange={(value) =>
                    setNewSocialLink((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform.type} value={platform.type}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="relative flex-1">
                  <LinkIcon
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={14}
                  />
                  <Input
                    placeholder="أدخل الرابط"
                    className="pr-9"
                    value={newSocialLink.url}
                    onChange={(e) =>
                      setNewSocialLink((prev) => ({ ...prev, url: e.target.value }))
                    }
                  />
                </div>
                <Button type="button" variant="outline" onClick={addSocialLink}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                className="w-4 h-4 rounded border-input"
                {...register("isActive")}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                نشط (يظهر في صفحة التصويت)
              </Label>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="ml-2 animate-spin" size={18} />
                    {isUploading ? "جاري رفع الصورة..." : "جاري الحفظ..."}
                  </>
                ) : editingCelebrity ? (
                  <>
                    <Upload size={18} className="ml-2" />
                    تحديث
                  </>
                ) : (
                  <>
                    <Upload size={18} className="ml-2" />
                    إضافة
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
