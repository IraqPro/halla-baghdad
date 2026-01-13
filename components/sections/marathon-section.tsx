"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Route, MapPin, Calendar, Sparkles, Car } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/common/glass-card";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { Badge } from "@/components/ui/badge";
import { FADE_IN_UP, FADE_IN_LEFT, FADE_IN_RIGHT } from "@/lib/constants";
import type { Activity } from "@/lib/types";

interface MarathonSectionProps {
  marathon: Activity;
}

// Images for each edition year - change these to your actual images
const editionImages: Record<number, string> = {
  2024: "/cards/first.jpg",
  2025: "/cards/second.jpg",
};

export function MarathonSection({ marathon }: MarathonSectionProps) {
  const previousEditions = marathon.previous_editions || [];

  return (
    <section id="marathon" className="relative py-24 lg:py-32 bg-accent/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_var(--primary)_25%,_var(--primary)_26%,_transparent_26%,_transparent_75%,_var(--primary)_75%,_var(--primary)_76%,_transparent_76%)] bg-[length:60px_60px] opacity-5" />
      </div>

      <Container className="relative">
        <SectionHeader
          title="ماراثون هلة بغداد"
          subtitle="النسخة الثالثة من أكبر ماراثون مجتمعي في العراق"
        />

        {/* Main Marathon Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left: Description */}
          <motion.div
            variants={FADE_IN_RIGHT}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1">
                النسخة الثالثة ٢٠٢٦
              </Badge>
              <Badge variant="outline" className="px-4 py-1">
                <Sparkles className="w-3 h-3 ml-1" />
                تجربة مختلفة
              </Badge>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
              ليس مجرد جري... بل تجربة لا تُنسى
            </h3>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {marathon.features_2026?.arabic}
            </p>

          </motion.div>

          {/* Right: Stats Cards */}
          <motion.div
            variants={FADE_IN_LEFT}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <GlassCard className="text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">
                <AnimatedCounter value={3120} suffix="+" duration={2} />
              </div>
              <p className="text-sm text-muted-foreground">مشارك سابق</p>
            </GlassCard>

            <GlassCard className="text-center">
              <Route className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground mb-1">
                <AnimatedCounter value={6} suffix=" كم" duration={1.5} />
              </div>
              <p className="text-sm text-muted-foreground">مسافة السباق</p>
            </GlassCard>

            <GlassCard className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-bold text-foreground mb-1">ساحة الاحتفالات</p>
              <p className="text-sm text-muted-foreground">بغداد</p>
            </GlassCard>

            <GlassCard className="text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-lg font-bold text-foreground mb-1">٦ فبراير</p>
              <p className="text-sm text-muted-foreground">٢٠٢٦</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Previous Editions Timeline */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold text-center text-foreground">
            النسخ السابقة
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previousEditions.map((edition, index) => {
              const imageUrl = editionImages[edition.year] || "/demo.jpg";
              
              return (
                <motion.div
                  key={edition.edition}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative h-full bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                    {/* Image Area */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <Image
                          src={imageUrl}
                          alt={`ماراثون ${edition.year}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </motion.div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      
                      {/* Edition Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-foreground backdrop-blur-sm shadow-lg border-0 px-3 py-1">
                          النسخة {edition.edition}
                        </Badge>
                      </div>

                      {/* Year Overlay */}
                      <div className="absolute bottom-4 right-4">
                        <span className="text-4xl font-bold text-white drop-shadow-lg">
                          {edition.year}
                        </span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground text-lg">
                            {edition.location.arabic}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {edition.distance_km} كيلومتر
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                          <Users className="w-4 h-4" />
                          <span className="font-bold text-sm">
                            {edition.participants.toLocaleString("ar-EG")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                      <Badge  variant="outline" className="text-xs">
                            مشاركة من مختلف المحافظات
                      </Badge>
                      <Badge  className="text-xs">
                            مشاركة من مختلف الدول والسياح الأجانب
                      </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
