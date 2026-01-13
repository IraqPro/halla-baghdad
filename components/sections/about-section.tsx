"use client";

import { motion } from "framer-motion";
import { Target, Leaf, Users, Trophy, Heart, Sparkles } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { GlassCard } from "@/components/common/glass-card";
import { STAGGER_CONTAINER, FADE_IN_UP } from "@/lib/constants";
import type { LocalizedText } from "@/lib/types";

interface AboutSectionProps {
  objectives: LocalizedText[];
}

const objectiveIcons = [
  Target,
  Leaf,
  Users,
  Trophy,
  Heart,
  Sparkles,
];

export function AboutSection({ objectives }: AboutSectionProps) {
  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      
      <Container className="relative">
        <SectionHeader
          title="عن الفعالية"
          subtitle="نعمل معاً لبناء مجتمع أنظف وأجمل من خلال فعاليات متنوعة تجمع بين الرياضة والبيئة والثقافة"
        />

        {/* Objectives Grid */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {objectives.slice(0, 6).map((objective, index) => {
            const Icon = objectiveIcons[index % objectiveIcons.length];
            return (
              <GlassCard key={index} glow className="group">
                <motion.div
                  variants={FADE_IN_UP}
                  className="flex flex-col gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {objective.arabic}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {objective.english}
                  </p>
                </motion.div>
              </GlassCard>
            );
          })}
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 border border-primary/20">
            <p className="text-xl lg:text-2xl font-medium text-foreground leading-relaxed max-w-3xl">
              &ldquo;النظافة سلوك حضاري يعكس وعي المجتمع وتقدمه&rdquo;
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
