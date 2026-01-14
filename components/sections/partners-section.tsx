"use client";

import { motion } from "framer-motion";
import { Tv, BookOpen, Users } from "lucide-react";
import { Container } from "@/components/common/container";
import { SectionHeader } from "@/components/common/section-header";
import { STAGGER_CONTAINER, FADE_IN_UP } from "@/lib/constants";
import type { MediaPartners } from "@/lib/types";

interface PartnersSectionProps {
  mediaPartners: MediaPartners;
}

export function PartnersSection({ mediaPartners }: PartnersSectionProps) {
  return (
    <section id="partners" className="relative py-24 lg:py-32 bg-accent/20">
      <Container>
        <SectionHeader
          title="شركاؤنا الإعلاميون"
          subtitle="تغطية إعلامية واسعة عبر أهم القنوات والمنصات العراقية"
        />

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          {/* TV Channels */}
          <motion.div variants={FADE_IN_UP} className="space-y-6">
            <div className="flex items-center gap-3 justify-center">
              <Tv className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">القنوات الفضائية</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {mediaPartners.satellite_channels.map((channel, index) => (
                <motion.div
                  key={channel}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-6 py-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
                >
                  <span className="font-medium text-foreground">{channel}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Magazines */}
          <motion.div variants={FADE_IN_UP} className="space-y-6">
            <div className="flex items-center gap-3 justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">المجلات والمنشورات</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {mediaPartners.magazines.map((magazine, index) => (
                <motion.div
                  key={magazine}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-6 py-3 rounded-xl bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
                >
                  <span className="font-medium text-foreground">{magazine}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Participants Types */}
          <motion.div variants={FADE_IN_UP} className="space-y-6">
            <div className="flex items-center gap-3 justify-center">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-foreground">المشاركون</h3>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {mediaPartners.participants_types.map((type, index) => (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 shadow-sm hover:shadow-md transition-all cursor-default"
                >
                  <span className="font-medium text-primary">{type}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Media Coverage Note */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            حظي مراثون هله بغداد بتغطية إعلامية واسعة عبر القنوات الفضائية، والمواقع الإخبارية، 
            ومنصات التواصل الاجتماعي، مع تفاعل كبير من الجمهور والمؤثرين
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
