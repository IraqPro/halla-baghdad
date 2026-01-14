"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { STATS, STAGGER_CONTAINER, FADE_IN_UP } from "@/lib/constants";

export function StatsSection() {
  return (
    <section className="relative py-20 bg-primary text-primary-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:24px_24px]" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
      />

      <Container className="relative">
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12"
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              variants={FADE_IN_UP}
              className="text-center min-h-[100px]"
            >
              <div className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  duration={2.5}
                />
              </div>
              <p className="text-xs sm:text-base opacity-90 leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
