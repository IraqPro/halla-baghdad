"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FADE_IN_UP } from "@/lib/constants";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={FADE_IN_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-12 space-y-4",
        centered && "text-center",
        className
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "h-1 w-24 rounded-full bg-gradient-to-l from-primary to-primary/50",
          centered && "mx-auto"
        )}
      />
    </motion.div>
  );
}
