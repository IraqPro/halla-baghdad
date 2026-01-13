"use client";

import { motion } from "framer-motion";
import { Leaf, PenTool, TreeDeciduous, ArrowLeft, Lightbulb } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/common/glass-card";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { FADE_IN_UP, STAGGER_CONTAINER } from "@/lib/constants";
import type { Activity } from "@/lib/types";

interface EcoPenSectionProps {
  ecoPen: Activity;
}

const steps = [
  {
    icon: PenTool,
    title: "استخدم القلم",
    description: "استخدم القلم البيئي للكتابة كأي قلم عادي",
  },
  {
    icon: Leaf,
    title: "افتح الكبسولة",
    description: "بعد الانتهاء من الحبر، افتح كبسولة البذور",
  },
  {
    icon: TreeDeciduous,
    title: "ازرع الشجرة",
    description: "ازرع البذور في التربة وشاهدها تنمو",
  },
];

// Pre-generated leaf animation values
const leafAnimations = [
  { x: 12, duration: 18, delay: 2 },
  { x: 45, duration: 22, delay: 5 },
  { x: 78, duration: 16, delay: 8 },
  { x: 23, duration: 20, delay: 1 },
  { x: 56, duration: 24, delay: 6 },
  { x: 89, duration: 17, delay: 3 },
  { x: 34, duration: 21, delay: 9 },
  { x: 67, duration: 19, delay: 4 },
];

export function EcoPenSection({ ecoPen }: EcoPenSectionProps) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-transparent to-accent/20" />
      
      {/* Floating Leaves Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {leafAnimations.map((leaf, i) => (
          <motion.div
            key={i}
            className="absolute text-primary/20"
            initial={{ 
              x: `${leaf.x}%`, 
              y: -20,
              rotate: 0 
            }}
            animate={{ 
              y: "120vh",
              rotate: 360,
              x: `calc(${leaf.x}% + ${Math.sin(i) * 50}px)`
            }}
            transition={{
              duration: leaf.duration,
              repeat: Infinity,
              delay: leaf.delay,
              ease: "linear"
            }}
          >
            <Leaf className="w-8 h-8" />
          </motion.div>
        ))}
      </div>

      <Container className="relative">
        <SectionHeader
          title="القلم البيئي"
          subtitle="ابتكار عراقي فريد يجمع بين الكتابة وزراعة الأشجار"
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Innovation Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                أول تجربة من نوعها في العراق
              </span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold text-foreground leading-relaxed">
              {ecoPen.description.arabic}
            </h3>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {ecoPen.eco_pen_concept?.arabic}
            </p>

            {/* Target Counter */}
            <GlassCard glow className="inline-block !p-8">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                  <AnimatedCounter 
                    value={ecoPen.target?.trees_to_plant || 10000} 
                    duration={2.5} 
                  />
                </div>
                <p className="text-lg text-foreground font-medium">شجرة ستُزرع</p>
                <p className="text-sm text-muted-foreground mt-1">
                  من خلال توزيع الأقلام البيئية
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Right: Steps */}
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h4 className="text-xl font-bold text-foreground mb-6">
              كيف يعمل القلم البيئي؟
            </h4>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={FADE_IN_UP}
                className="relative"
              >
                <GlassCard className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                    {index + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <step.icon className="w-5 h-5 text-primary" />
                      <h5 className="font-bold text-foreground">{step.title}</h5>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </GlassCard>

                {/* Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute -bottom-3 right-6 text-primary/50">
                    <ArrowLeft className="w-5 h-5 rotate-[-90deg]" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
