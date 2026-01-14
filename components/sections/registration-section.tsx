"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { RegistrationDialog } from "@/components/registration";
import { FADE_IN_UP, SCALE_IN } from "@/lib/constants";

export function RegistrationSection() {
  return (
    <section id="register" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full border-2 border-white/10"
      />
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full border-2 border-white/10"
      />

      <Container className="relative text-center text-primary-foreground">
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            variants={SCALE_IN}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">التسجيل مفتوح الآن</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            انضم إلينا في أكبر حدث مجتمعي
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
            كن جزءاً من التغيير الإيجابي في مجتمعنا وشارك في فعاليات يوم النظافة العام
          </p>

          {/* Event Details */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>١٣- ١٤ شباط ٢٠٢٦</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>ساحة الاحتفالات الكبرى</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>التسجيل مجاني</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <RegistrationDialog
                trigger={
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-10 py-7 text-lg font-bold shadow-xl group"
                  >
                    اضغط هنا للتسجيل في الماراثون
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  </Button>
                }
              />
            </motion.div>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
            <span>✓ التسجيل مجاني</span>
            <span>✓ شهادة مشاركة</span>
            <span>✓ هدايا للمشاركين</span>
            <span>✓ جوائز قيمة</span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
