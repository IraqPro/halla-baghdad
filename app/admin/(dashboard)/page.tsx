"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  Vote,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";
import { GlassCard } from "@/components/common/glass-card";
import { AnimatedCounter } from "@/components/common/animated-counter";

interface Stats {
  totalParticipants: number;
  totalCelebrities: number;
  totalVotes: number;
  recentActivity: {
    type: string;
    count: number;
    label: string;
  }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalParticipants: 0,
    totalCelebrities: 0,
    totalVotes: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch participants count
      const participantsRes = await fetch("/api/admin/participants?limit=1");
      const participantsData = await participantsRes.json();

      // Fetch celebrities count
      const celebritiesRes = await fetch("/api/admin/celebrities?limit=1");
      const celebritiesData = await celebritiesRes.json();

      // Fetch votes count (from public API)
      const votesRes = await fetch("/api/vote");
      const votesData = await votesRes.json();

      const totalVotes = votesData.celebrities?.reduce(
        (sum: number, c: { votes: number }) => sum + c.votes,
        0
      ) || 0;

      setStats({
        totalParticipants: participantsData.pagination?.total || 0,
        totalCelebrities: celebritiesData.pagination?.total || 0,
        totalVotes,
        recentActivity: [
          {
            type: "participants",
            count: participantsData.pagination?.total || 0,
            label: "مشترك جديد هذا الأسبوع",
          },
          {
            type: "votes",
            count: totalVotes,
            label: "صوت تم إدلائه",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "إجمالي المشاركين",
      value: stats.totalParticipants,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "المشاهير",
      value: stats.totalCelebrities,
      icon: Star,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "إجمالي الأصوات",
      value: stats.totalVotes,
      icon: Vote,
      color: "from-primary to-primary/80",
      bgColor: "bg-primary/10",
    },
    {
      title: "معدل المشاركة",
      value: stats.totalCelebrities > 0 
        ? Math.round(stats.totalVotes / stats.totalCelebrities) 
        : 0,
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-500/10",
      suffix: " صوت/مشهور",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            لوحة التحكم
          </h1>
          <p className="text-muted-foreground mt-1">
            مرحباً بك في لوحة تحكم مهرجان هله بغداد
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString("ar-IQ", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon 
                    size={24} 
                    className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                    style={{ color: stat.color.includes("blue") ? "#3b82f6" : stat.color.includes("amber") ? "#f59e0b" : stat.color.includes("emerald") ? "#10b981" : "var(--primary)" }}
                  />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-foreground">
                  {isLoading ? (
                    <div className="h-9 w-20 bg-muted animate-pulse rounded" />
                  ) : (
                    <AnimatedCounter value={stat.value} duration={1.5} />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.title}
                  {stat.suffix && (
                    <span className="text-xs opacity-70">{stat.suffix}</span>
                  )}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity size={24} className="text-primary" />
            <h2 className="text-xl font-bold text-foreground">إجراءات سريعة</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/admin/participants"
              className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">عرض المشاركين</h3>
                <p className="text-sm text-muted-foreground">إدارة قائمة المشاركين</p>
              </div>
            </a>

            <a
              href="/admin/celebrities"
              className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <Star size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">إدارة المشاهير</h3>
                <p className="text-sm text-muted-foreground">إضافة وتعديل المشاهير</p>
              </div>
            </a>

            <a
              href="/vote"
              target="_blank"
              className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background border border-border/50 transition-colors group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Vote size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">صفحة التصويت</h3>
                <p className="text-sm text-muted-foreground">معاينة صفحة التصويت</p>
              </div>
            </a>
          </div>
        </GlassCard>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 border border-primary/20"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/20 text-primary shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground mb-1">نصيحة اليوم</h3>
            <p className="text-muted-foreground">
              يمكنك إضافة مشاهير جدد من قسم &quot;المشاهير&quot; وتفعيلهم أو إيقافهم حسب الحاجة.
              كما يمكنك متابعة نتائج التصويت مباشرة من صفحة التصويت العامة.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
