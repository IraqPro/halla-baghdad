"use client";

import { motion } from "framer-motion";

export function CelebritySkeleton() {
  return (
    <div className="relative h-full bg-card/90 backdrop-blur-xl rounded-3xl border border-border/30 shadow-xl overflow-hidden">
      {/* Image Area Skeleton */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Badge skeleton */}
        <div className="absolute top-4 right-4">
          <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
        </div>
        
        {/* Stats skeleton */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between mb-3">
            <div className="space-y-2">
              <div className="h-10 w-20 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-10 w-14 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Name skeleton */}
        <div className="h-7 w-2/3 bg-muted rounded-lg animate-pulse" />
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted/70 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-muted/70 rounded animate-pulse" />
        </div>
        
        {/* Social links skeleton */}
        <div className="flex gap-2 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
        
        {/* Button skeleton */}
        <div className="pt-2">
          <div className="h-14 w-full bg-gradient-to-r from-muted to-muted/70 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function CelebritySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <CelebritySkeleton />
        </motion.div>
      ))}
    </div>
  );
}
