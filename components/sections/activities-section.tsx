"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Users, 
  Trophy, 
  Leaf, 
  Award,
  PartyPopper,
  Footprints,
  ArrowLeft
} from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { Badge } from "@/components/ui/badge";
import { STAGGER_CONTAINER, FADE_IN_UP } from "@/lib/constants";
import type { Activity } from "@/lib/types";

interface ActivitiesSectionProps {
  activities: Activity[];
}

const activityIcons: Record<string, React.ElementType> = {
  parade: Users,
  marathon: Footprints,
  martial_arts: Trophy,
  competition: Award,
  environmental_campaign: Leaf,
  ceremony: PartyPopper,
};

// Images for each activity type - change these to your actual images
const activityImages: Record<string, string> = {
  parade: "/cards/parade.jpg",
  marathon: "/cards/marathon.jpg",
  martial_arts: "/cards/martial-arts.jpg",
  competition: "/cards/competition.jpeg",
  environmental_campaign: "/cards/environmental-campaign.jpeg",
  ceremony: "/cards/ceremony.jpg",
};

// Gradient overlays for activity images
const activityGradients: Record<string, string> = {
  parade: "from-blue-600/80 via-blue-500/50 to-transparent",
  marathon: "from-emerald-600/80 via-teal-500/50 to-transparent",
  martial_arts: "from-red-600/80 via-rose-500/50 to-transparent",
  competition: "from-amber-500/80 via-yellow-500/50 to-transparent",
  environmental_campaign: "from-green-600/80 via-emerald-500/50 to-transparent",
  ceremony: "from-purple-600/80 via-violet-500/50 to-transparent",
};

export function ActivitiesSection({ activities }: ActivitiesSectionProps) {
  return (
    <section id="activities" className="relative py-24 lg:py-32">
      <Container>
        <SectionHeader
          title="فعاليات الحدث"
          subtitle="مجموعة متنوعة من الفعاليات الرياضية والثقافية والبيئية التي تجمع أبناء المجتمع"
        />

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || Users;
            const gradientClass = activityGradients[activity.type] || "from-primary/80 via-primary/50 to-transparent";
            const imageUrl = activityImages[activity.type] || "/demo.jpg";
            
            return (
              <motion.div
                key={activity.id}
                variants={FADE_IN_UP}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative h-full bg-card rounded-3xl border border-border/50 shadow-lg overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-shadow duration-500"
                >
                  {/* Image Area */}
                  <div className="relative h-52 overflow-hidden">
                    {/* Actual Image */}
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Image
                        src={imageUrl}
                        alt={activity.name.arabic}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradientClass}`} />
                    
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-150 group-hover:scale-[2] transition-transform duration-500" />
                        
                        {/* Icon Container */}
                        <motion.div 
                          className="relative w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl"
                          whileHover={{ boxShadow: "0 0 40px rgba(255,255,255,0.4)" }}
                        >
                          <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Edition Badge */}
                    {activity.edition && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="absolute top-4 left-4"
                      >
                        <Badge className="bg-white/90 text-foreground backdrop-blur-sm shadow-lg border-0 px-3 py-1">
                          النسخة {activity.edition}
                        </Badge>
                      </motion.div>
                    )}

                    {/* Hover Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4"
                    >
                      <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-white text-sm font-medium flex items-center gap-1"
                      >
                        اعرف المزيد
                        <ArrowLeft className="w-4 h-4" />
                      </motion.span>
                    </motion.div>

                    {/* Bottom Curve */}
                    <div className="absolute -bottom-1 left-0 right-0 h-8 bg-card" style={{ borderRadius: "100% 100% 0 0" }} />
                  </div>

                  {/* Content Area */}
                  <div className="p-6 pt-2 space-y-4">
                    <motion.h3 
                      className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {activity.name.arabic}
                    </motion.h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {activity.description.arabic}
                    </p>

                    {/* Activity-specific details with animations */}
                    <motion.div 
                      className="pt-4 border-t border-border/50 space-y-3"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                    >

                      {activity.target && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">الهدف: </span>
                          <span className="font-bold text-primary">
                            {activity.target.trees_to_plant.toLocaleString("ar-EG")} شجرة
                          </span>
                        </p>
                      )}

                      {activity.participants_count && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">المشاركون: </span>
                          <span className="font-bold text-primary">
                            {activity.participants_count} صانع محتوى
                          </span>
                        </p>
                      )}

                      {!activity.prizes && !activity.target && !activity.participants_count && (
                        <p className="text-sm text-muted-foreground">
                          تفاصيل إضافية قريباً
                        </p>
                      )}
                    </motion.div>
                  </div>

                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
