"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/container";
import type { Event } from "@/lib/types";

interface HeroSectionProps {
  event: Event;
}

export function HeroSection({ event }: HeroSectionProps) {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-background via-accent/30 to-primary/10" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/30"
            initial={{ opacity: 0 }}
            animate={{
              y: [0, -150, -300],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            style={{
              left: `${5 + (i * 6.5)}%`,
              top: `${70 + (i % 3) * 10}%`,
            }}
          />
        ))}
      </div>

      {/* Decorative Circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full border-2 border-primary"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary"
      />

      <Container className="relative z-10 py-32">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo - Appears First */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center justify-center"
          >
            <Image
              src="/holo.png"
              alt="هله بغداد"
              width={140}
              height={140}
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain drop-shadow-2xl"
              priority
            />
                        <Image
              src="/hala.png"
              alt="هله بغداد"
              width={140}
              height={140}
              className="h-28 w-28 sm:h-36 sm:w-36 object-contain drop-shadow-2xl"
              priority
            />
                        <Image
              src="/amana.png"
              alt="هله بغداد"
              width={140}
              height={140}
              className="h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Main Title - Appears with Logo */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
          >
            {event.name.arabic}
          </motion.h1>

          {/* Tagline Badge - After title */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.8,
              ease: "easeOut",
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm font-medium text-primary">
              {event.tagline.arabic}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.0,
              ease: "easeOut",
            }}
            className="max-w-3xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            {event.description.arabic}
          </motion.p>

          {/* Event Info Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.2,
              ease: "easeOut",
            }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm"
            >
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">١٣- ١٤ شباط ٢٠٢٦</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-sm"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">
                {event.location.arabic}، بغداد
              </span>
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.7, 
              delay: 1.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                onClick={() => scrollToSection("#register")}
              >
                سجّل الآن في الماراثون
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.85 }}
            >
              <Link href="/vote">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 border-0"
                >
                   صوت لصانع محتوى 
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            onClick={() => scrollToSection("#about")}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-sm">اكتشف المزيد</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 2.5 }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </Container>
    </section>
  );
}
