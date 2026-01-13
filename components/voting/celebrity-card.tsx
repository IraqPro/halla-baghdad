"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Heart, 
  Check, 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Loader2,
  Crown,
  Flame,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TikTokIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { SocialLink } from "@/lib/db/schema";

interface CelebrityCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  socialLinks: SocialLink[];
  voteCount: number;
  totalVotes: number;
  hasVoted: boolean;
  votedForThis: boolean;
  onVote: (id: string) => Promise<void>;
  isVoting: boolean;
  rank: number;
}

const socialIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: TikTokIcon,
};

const categoryLabels: Record<string, string> = {
  influencer: "مؤثر",
  artist: "فنان",
  athlete: "رياضي",
  content_creator: "صانع محتوى",
  actor: "ممثل",
  singer: "مغني",
  other: "أخرى",
};

const rankColors: Record<number, { bg: string; text: string; glow: string }> = {
  1: { bg: "from-amber-400 to-yellow-500", text: "text-amber-900", glow: "shadow-amber-400/50" },
  2: { bg: "from-slate-300 to-slate-400", text: "text-slate-800", glow: "shadow-slate-300/50" },
  3: { bg: "from-orange-400 to-orange-500", text: "text-orange-900", glow: "shadow-orange-400/50" },
};

export function CelebrityCard({
  id,
  name,
  image,
  description,
  category,
  socialLinks,
  voteCount,
  totalVotes,
  hasVoted,
  votedForThis,
  onVote,
  isVoting,
  rank,
}: CelebrityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
  const isTopThree = rank <= 3;

  const handleVote = async () => {
    if (!hasVoted && !isVoting) {
      await onVote(id);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && votedForThis && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  opacity: 0,
                  scale: 1,
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200 - 100,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 z-50 pointer-events-none"
              >
                <Sparkles className={cn(
                  "w-6 h-6",
                  i % 3 === 0 ? "text-amber-400" : i % 3 === 1 ? "text-primary" : "text-pink-400"
                )} />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Glow Effect for Top 3 */}
      {isTopThree && (
        <motion.div
          animate={{ 
            opacity: isHovered ? 0.6 : 0.3,
            scale: isHovered ? 1.02 : 1,
          }}
          className={cn(
            "absolute -inset-1 rounded-[2rem] bg-gradient-to-r blur-xl transition-all duration-500",
            rankColors[rank]?.bg
          )}
        />
      )}

      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "relative h-full bg-card/90 backdrop-blur-xl rounded-3xl border overflow-hidden transition-all duration-500",
          votedForThis
            ? "border-primary/50 shadow-2xl shadow-primary/20 ring-2 ring-primary/30"
            : isTopThree
            ? `border-transparent shadow-2xl ${rankColors[rank]?.glow}`
            : "border-border/30 shadow-xl hover:shadow-2xl hover:border-primary/20"
        )}
      >
        {/* Rank Badge */}
        {isTopThree && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="absolute top-4 left-4 z-20"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
              rankColors[rank]?.bg,
              rankColors[rank]?.glow
            )}>
              {rank === 1 ? (
                <Crown className={cn("w-6 h-6", rankColors[rank]?.text)} />
              ) : (
                <span className={cn("text-xl font-black", rankColors[rank]?.text)}>
                  {rank}
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Image Area */}
        <div className="relative h-72 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 right-4 z-10"
          >
            <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-3 py-1">
              {categoryLabels[category] || category}
            </Badge>
          </motion.div>

          {/* Voted Check Badge */}
          <AnimatePresence>
            {votedForThis && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="absolute top-4 left-4 z-10"
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50">
                  <Check className="w-6 h-6 text-white" strokeWidth={3} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Stats Card with solid background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/0.5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {voteCount > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                    >
                      <Flame className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                  <div>
                    <span className="text-3xl font-black text-white">
                      {voteCount.toLocaleString("ar-EG")}
                    </span>
                    <p className="text-white/60 text-xs font-medium">صوت</p>
                  </div>
                </div>
                
                <div className="text-left bg-white/10 rounded-xl px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-2xl font-black text-white">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    isTopThree 
                      ? `bg-gradient-to-r ${rankColors[rank]?.bg}` 
                      : "bg-gradient-to-r from-primary via-emerald-400 to-primary"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <motion.h3 
            className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {name}
          </motion.h3>

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Social Links */}
          {socialLinks && socialLinks.length > 0 && (
            <motion.div 
              className="flex items-center gap-2 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {socialLinks.map((link, index) => {
                const Icon = socialIcons[link.type] || Instagram;
                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-accent/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 border border-border/50"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </motion.div>
          )}

          {/* Vote Button */}
          <motion.div 
            className="pt-2"
            whileHover={{ scale: hasVoted ? 1 : 1.02 }} 
            whileTap={{ scale: hasVoted ? 1 : 0.98 }}
          >
            <Button
              onClick={handleVote}
              disabled={hasVoted || isVoting}
              size="lg"
              className={cn(
                "w-full rounded-2xl py-7 text-lg font-bold transition-all duration-300 relative overflow-hidden",
                votedForThis
                  ? "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30"
                  : hasVoted
                  ? "bg-muted text-muted-foreground"
                  : "bg-gradient-to-r from-primary via-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              )}
            >
              {/* Button shine effect */}
              {!hasVoted && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
              
              <span className="relative flex items-center justify-center gap-2">
                {isVoting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري التصويت...
                  </>
                ) : votedForThis ? (
                  <>
                    <Check className="w-5 h-5" />
                    تم التصويت ✓
                  </>
                ) : hasVoted ? (
                  "لقد صوّتت لشخص آخر"
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    صوّت الآن
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
