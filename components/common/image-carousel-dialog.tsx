"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageCarouselDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title: string;
  description?: string;
}

export function ImageCarouselDialog({
  isOpen,
  onClose,
  images,
  title,
  description,
}: ImageCarouselDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToPrev(); // RTL
      if (e.key === "ArrowLeft") goToNext(); // RTL
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state when dialog closes (use key prop pattern instead)
  // The parent component should use a key prop on the dialog to reset state

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Content */}
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative z-10 flex items-center justify-between p-4 md:p-6"
            >
              <div className="text-white">
                <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
                {description && (
                  <p className="text-white/70 text-sm mt-1 max-w-md line-clamp-1">
                    {description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Image counter */}
                <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                  {currentIndex + 1} / {images.length}
                </div>

                {/* Zoom toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>

                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>

            {/* Main Image Area */}
            <div className="flex-1 relative flex items-center justify-center px-4 md:px-20">
              {/* Navigation - Previous (Right in RTL) */}
              {images.length > 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={goToPrev}
                  className="absolute right-4 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </motion.button>
              )}

              {/* Image Container */}
              <div className={cn(
                "relative w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-2xl",
                isZoomed && "cursor-zoom-out"
              )}>
                <AnimatePresence mode="popLayout" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onClick={() => isZoomed && setIsZoomed(false)}
                    className={cn(
                      "absolute inset-0 transition-transform duration-300",
                      isZoomed ? "scale-150 cursor-zoom-out" : "scale-100"
                    )}
                  >
                    <Image
                      src={images[currentIndex]}
                      alt={`${title} - صورة ${currentIndex + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 80vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation - Next (Left in RTL) */}
              {images.length > 1 && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={goToNext}
                  className="absolute left-4 md:left-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </motion.button>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 p-4 md:p-6"
              >
                <div className="flex items-center justify-center gap-2 md:gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300",
                        currentIndex === index
                          ? "ring-2 ring-white ring-offset-2 ring-offset-black/50 scale-110"
                          : "opacity-50 hover:opacity-80"
                      )}
                    >
                      <Image
                        src={image}
                        alt={`صورة مصغرة ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
