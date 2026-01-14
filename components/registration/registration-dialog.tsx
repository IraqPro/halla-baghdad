"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { 
  User, 
  Phone, 
  MapPin, 
  Heart, 
  Dumbbell, 
  Loader2, 
  CheckCircle2,
  Download,
  X
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  participantSchema,
  type ParticipantFormData,
  sportLevelOptions,
  healthConditionOptions,
  iraqiCities,
} from "@/lib/validations/participant";

interface RegistrationDialogProps {
  trigger?: React.ReactNode;
}

interface RegistrationSuccess {
  id: string;
  name: string;
}

export function RegistrationDialog({ trigger }: RegistrationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<RegistrationSuccess | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      residence: "",
      healthCondition: "",
      sportLevel: "",
    },
  });

  const onSubmit = async (data: ParticipantFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "حدث خطأ في التسجيل");
      }

      setSuccess({
        id: result.data.id,
        name: result.data.name,
      });
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setSuccess(null);
      setError(null);
      form.reset();
    }, 300);
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `marathon-ticket-${success?.id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const qrCodeData = success
    ? JSON.stringify({
        type: "HALA_BAGHDAD_MARATHON",
        id: success.id,
        name: success.name,
        event: "يوم النظافة العام 2026",
        date: "2026-02-06",
      })
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="rounded-full px-8">
            سجّل الآن
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {success ? (
            // Success State with QR Code
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </motion.div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                تم التسجيل بنجاح! 🎉
              </h2>
              <p className="text-muted-foreground mb-6">
                مرحباً {success.name}، تم تسجيلك في ماراثون هله بغداد
              </p>

              {/* QR Code */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-lg inline-block mb-6"
              >
                <QRCodeSVG
                  id="qr-code"
                  value={qrCodeData}
                  size={200}
                  level="H"
                  includeMargin
                  imageSettings={{
                    src: "/hala.png",
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </motion.div>

              <p className="text-sm text-muted-foreground mb-4">
                احتفظ برمز QR هذا لتأكيد حضورك يوم الفعالية
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={downloadQRCode} className="gap-2">
                  <Download className="w-4 h-4" />
                  تحميل التذكرة
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  إغلاق
                </Button>
              </div>

              {/* Ticket Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-accent/50 rounded-xl text-sm"
              >
                <p className="font-medium mb-1">رقم التسجيل</p>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {success.id}
                </p>
              </motion.div>
            </motion.div>
          ) : (
            // Registration Form
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="text-center pb-4">
                <DialogTitle className="text-2xl font-bold text-right mt-10">
                  التسجيل في الماراثون
                </DialogTitle>
                <DialogDescription className="text-right">
                  سجّل الآن للمشاركة في ماراثون هله بغداد - النسخة الثالثة
                </DialogDescription>
              </DialogHeader>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"
                >
                  <X className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          الاسم الكامل
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="أدخل اسمك الكامل"
                            {...field}
                            className="text-right"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="07XX XXX XXXX"
                            {...field}
                            className="text-right"
                            dir="ltr"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Residence Field */}
                  <FormField
                    control={form.control}
                    name="residence"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          مكان الإقامة
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full" dir="rtl">
                              <SelectValue placeholder="اختر المحافظة" className="text-right w-full" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-right w-full">
                            {iraqiCities.map((city) => (
                              <SelectItem key={city} value={city} className="text-right w-full">
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Health Condition Field */}
                  <FormField
                    control={form.control}
                    name="healthCondition"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          الحالة الصحية
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full" dir="rtl">
                              <SelectValue placeholder="اختر حالتك الصحية" className="text-right w-full" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-right w-full">
                            {healthConditionOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-right w-full">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sport Level Field */}
                  <FormField
                    control={form.control}
                    name="sportLevel"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="flex items-center gap-2">
                          <Dumbbell className="w-4 h-4" />
                          المستوى الرياضي
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full" dir="rtl">
                              <SelectValue placeholder="اختر مستواك الرياضي" className="text-right w-full" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="text-right w-full">
                            {sportLevelOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-right w-full" >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        جاري التسجيل...
                      </>
                    ) : (
                      "تسجيل"
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
