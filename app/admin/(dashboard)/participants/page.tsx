"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Phone,
  MapPin,
  Heart,
  Activity,
  Calendar,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/common/glass-card";

interface Participant {
  id: string;
  name: string;
  phoneNumber: string;
  residence: string;
  healthCondition: string;
  sportLevel: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchParticipants = useCallback(async (page: number, searchQuery: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/admin/participants?${params}`);
      const data = await res.json();

      if (data.success) {
        setParticipants(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParticipants(pagination.page, search);
  }, [pagination.page, fetchParticipants, search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (pagination.page === 1) {
        fetchParticipants(1, search);
      } else {
        setPagination((prev) => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, fetchParticipants, pagination.page]);

  const getSportLevelBadge = (level: string) => {
    const colors: Record<string, string> = {
      مبتدئ: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      متوسط: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      محترف: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };
    return colors[level] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">المشاركين</h1>
            <p className="text-muted-foreground text-sm">
              {pagination.total} مشترك مسجل
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="بحث بالاسم أو رقم الهاتف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Participants Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Users size={48} className="opacity-20 mb-4" />
              <p>لا يوجد مشاركين</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-right p-4 font-medium text-muted-foreground">#</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الاسم</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الهاتف</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">السكن</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">الحالة الصحية</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">المستوى</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {participants.map((participant, index) => (
                    <motion.tr
                      key={participant.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-muted-foreground">
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-foreground">
                          {participant.name}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone size={14} />
                          <span dir="ltr">{participant.phoneNumber}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin size={14} />
                          <span>{participant.residence}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart size={14} />
                          <span>{participant.healthCondition}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getSportLevelBadge(participant.sportLevel)}`}>
                          <Activity size={12} />
                          {participant.sportLevel}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Calendar size={14} />
                          <span>
                            {new Date(participant.createdAt).toLocaleDateString("ar-IQ")}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                صفحة {pagination.page} من {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  <ChevronRight size={16} />
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                >
                  التالي
                  <ChevronLeft size={16} />
                </Button>
              </div>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
