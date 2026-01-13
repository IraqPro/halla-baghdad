"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  ArrowRight, 
  RefreshCw, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Vote,
  Sparkles,
  Crown,
  Flame,
  TrendingUp,
  Timer
} from "lucide-react";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CelebrityCard } from "./celebrity-card";
import { CelebritySkeletonGrid } from "./celebrity-skeleton";
import { useFingerprint } from "@/lib/hooks/use-fingerprint";
import type { SocialLink } from "@/lib/db/schema";

interface Celebrity {
  id: string;
  name: string;
  image: string;
  description: string;
  category: string;
  socialLinks: SocialLink[];
  voteCount: number;
}

interface VoteResponse {
  success: boolean;
  message?: string;
  error?: string;
  alreadyVoted?: boolean;
  votedFor?: string;
}

// Animated counter component
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span className={className}>{displayValue.toLocaleString("ar-EG")}</span>;
}

// Pre-generated particle positions
const particleData = [
  { x: 50, y: 100, duration: 7, delay: 1 },
  { x: 200, y: 300, duration: 8, delay: 2 },
  { x: 350, y: 150, duration: 6, delay: 0.5 },
  { x: 500, y: 400, duration: 9, delay: 3 },
  { x: 150, y: 250, duration: 7.5, delay: 1.5 },
  { x: 400, y: 50, duration: 6.5, delay: 4 },
  { x: 600, y: 350, duration: 8.5, delay: 2.5 },
  { x: 250, y: 500, duration: 7, delay: 0 },
  { x: 700, y: 200, duration: 9.5, delay: 3.5 },
  { x: 100, y: 450, duration: 6, delay: 1 },
  { x: 450, y: 300, duration: 8, delay: 4.5 },
  { x: 550, y: 100, duration: 7, delay: 2 },
  { x: 300, y: 400, duration: 9, delay: 0.5 },
  { x: 650, y: 250, duration: 6.5, delay: 3 },
  { x: 180, y: 350, duration: 8.5, delay: 1.5 },
  { x: 520, y: 450, duration: 7.5, delay: 4 },
  { x: 380, y: 200, duration: 6, delay: 2.5 },
  { x: 80, y: 300, duration: 9, delay: 0 },
  { x: 620, y: 400, duration: 7, delay: 3.5 },
  { x: 280, y: 150, duration: 8, delay: 1 },
];

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleData.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/20"
          initial={{
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            y: [null, -100],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

export function VotingPage() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { deviceInfo, isLoading: isFingerprintLoading } = useFingerprint();

  // Fetch celebrities
  const fetchCelebrities = useCallback(async () => {
    try {
      const response = await fetch("/api/vote");
      const data = await response.json();

      if (data.success) {
        setCelebrities(data.data.celebrities);
        setTotalVotes(data.data.totalVotes);
        setLastUpdate(new Date());
      } else {
        setError(data.error || "فشل في تحميل البيانات");
      }
    } catch {
      setError("فشل في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check existing vote
  const checkExistingVote = useCallback(async () => {
    if (!deviceInfo) return;

    try {
      const response = await fetch("/api/vote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: deviceInfo.fingerprint }),
      });

      const data = await response.json();
      if (data.hasVoted) {
        setVotedFor(data.votedFor);
      }
    } catch (err) {
      console.error("Error checking vote status:", err);
    }
  }, [deviceInfo]);

  useEffect(() => {
    fetchCelebrities();
  }, [fetchCelebrities]);

  useEffect(() => {
    if (deviceInfo) {
      checkExistingVote();
    }
  }, [deviceInfo, checkExistingVote]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCelebrities();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchCelebrities]);

  // Handle vote
  const handleVote = async (celebrityId: string) => {
    if (!deviceInfo || isVoting || votedFor) return;

    setIsVoting(true);
    setError(null);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          celebrityId,
          fingerprint: deviceInfo.fingerprint,
          screenResolution: deviceInfo.screenResolution,
          timezone: deviceInfo.timezone,
          language: deviceInfo.language,
        }),
      });

      const data: VoteResponse = await response.json();

      if (data.success) {
        setVotedFor(celebrityId);
        setSuccessMessage(data.message || "تم التصويت بنجاح!");
        fetchCelebrities();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else if (data.alreadyVoted) {
        setVotedFor(data.votedFor || null);
        setError(data.error || "لقد قمت بالتصويت مسبقاً");
      } else {
        setError(data.error || "فشل في التصويت");
      }
    } catch {
      setError("فشل في الاتصال بالخادم");
    } finally {
      setIsVoting(false);
    }
  };

  // Loading state
  if (isLoading || isFingerprintLoading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/30">
          <Container>
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/hala.png"
                  alt="هلة بغداد"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <h1 className="font-bold text-lg">هلة بغداد</h1>
                  <p className="text-xs text-muted-foreground">التصويت</p>
                </div>
              </Link>
            </div>
          </Container>
        </header>

        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin mb-4" />
              <p className="text-muted-foreground">جاري التحميل...</p>
            </div>
            <CelebritySkeletonGrid count={6} />
          </Container>
        </section>
      </div>
    );
  }

  const leader = celebrities[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background relative">
      <FloatingParticles />

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/30"
      >
        <Container>
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div whileHover={{ rotate: 10 }}>
                <Image
                  src="/hala.png"
                  alt="هلة بغداد"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </motion.div>
              <div>
                <h1 className="font-bold text-lg group-hover:text-primary transition-colors">هلة بغداد</h1>
                <p className="text-xs text-muted-foreground">مسابقة التصويت</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Timer className="w-4 h-4 text-primary" />
                </motion.div>
                <span className="text-sm font-medium text-primary">مباشر</span>
              </motion.div>
              
              <Link href="/">
                <Button variant="ghost" className="gap-2 rounded-full">
                  العودة
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </motion.header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 4 }}
          />
        </div>

        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-primary/20 border border-amber-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-5 h-5 text-amber-500" />
              </motion.div>
              <span className="text-sm font-bold bg-gradient-to-r from-amber-500 to-primary bg-clip-text text-transparent">
                مسابقة أفضل صانع محتوى ٢٠٢٦
              </span>
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight"
            >
              صوّت لصانع المحتوى
              <br />
              <span className="bg-gradient-to-r from-primary via-emerald-500 to-primary bg-clip-text text-transparent">
                المفضل لديك
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              شارك في اختيار أفضل صانع محتوى اجتماعي وتوعوي لسنة ٢٠٢٦
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              {/* Total Votes */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <AnimatedNumber 
                    value={totalVotes} 
                    className="text-3xl font-black text-foreground"
                  />
                  <p className="text-sm text-muted-foreground">إجمالي الأصوات</p>
                </div>
              </motion.div>

              {/* Candidates */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-foreground">
                    {celebrities.length.toLocaleString("ar-EG")}
                  </span>
                  <p className="text-sm text-muted-foreground">مرشح</p>
                </div>
              </motion.div>

              {/* Leader */}
              {leader && (
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 shadow-lg"
                >
                  <div className="relative">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{leader.name}</p>
                    <p className="text-sm text-amber-600">المتصدر حالياً</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Messages */}
      <Container>
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-primary">{successMessage}</p>
                <p className="text-sm text-muted-foreground">شكراً لمشاركتك في التصويت</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-8 p-5 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-destructive">{error}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="rounded-full"
              >
                إغلاق
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voted Info */}
        {votedFor && !successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-5 rounded-2xl bg-accent/30 backdrop-blur-sm border border-border/50 flex items-center justify-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground font-medium">
              لقد قمت بالتصويت. شكراً لمشاركتك!
            </p>
          </motion.div>
        )}
      </Container>

      {/* Celebrities Grid */}
      <section className="pb-24">
        <Container>
          {celebrities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 px-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <Vote className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground font-medium">
                لا يوجد مرشحون حالياً
              </p>
              <p className="text-muted-foreground/70 mt-2">
                سيتم إضافة المرشحين قريباً
              </p>
            </motion.div>
          ) : (
            <>
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">المرشحون</h2>
                    <p className="text-sm text-muted-foreground">مرتبين حسب الأصوات</p>
                  </div>
                </div>

                <Badge variant="outline" className="gap-2 px-4 py-2">
                  <TrendingUp className="w-4 h-4" />
                  تحديث تلقائي
                </Badge>
              </motion.div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {celebrities.map((celebrity, index) => (
                  <CelebrityCard
                    key={celebrity.id}
                    {...celebrity}
                    totalVotes={totalVotes}
                    hasVoted={!!votedFor}
                    votedForThis={votedFor === celebrity.id}
                    onVote={handleVote}
                    isVoting={isVoting}
                    rank={index + 1}
                  />
                ))}
              </div>
            </>
          )}

          {/* Refresh Button */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              onClick={fetchCelebrities}
              className="gap-2 rounded-full px-6"
            >
              <RefreshCw className="w-4 h-4" />
              تحديث النتائج
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              آخر تحديث: {lastUpdate.toLocaleTimeString("ar-EG")}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <Container>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Image
                src="/hala.png"
                alt="هلة بغداد"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
              <span className="font-bold">هلة بغداد</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © ٢٠٢٦ هلة بغداد. جميع الحقوق محفوظة.
            </p>
            <p className="text-xs text-muted-foreground/70">
              🔒 يمكن لكل جهاز التصويت مرة واحدة فقط لضمان نزاهة المسابقة
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
