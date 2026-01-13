"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { FADE_IN_UP } from "@/lib/constants";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      variants={FADE_IN_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50",
        "bg-card/80 backdrop-blur-md",
        "p-6 shadow-lg",
        "transition-shadow duration-300",
        hover && "hover:shadow-xl hover:border-primary/30",
        glow && "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-transparent before:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
