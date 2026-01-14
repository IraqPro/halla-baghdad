"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Calendar, Mail } from "lucide-react";
import { Container } from "@/components/common/container";
import { Separator } from "@/components/ui/separator";
import { NAV_LINKS, FADE_IN_UP } from "@/lib/constants";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
};

const socialLinks = [
  { platform: "facebook" as const, url: "#", label: "فيسبوك" },
  { platform: "instagram" as const, url: "#", label: "انستغرام" },
  { platform: "twitter" as const, url: "#", label: "تويتر" },
  { platform: "youtube" as const, url: "#", label: "يوتيوب" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
      </div>

      <Container className="relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/hala.png"
                alt="هله بغداد"
                width={56}
                height={56}
                className="h-14 w-14 object-contain brightness-0 invert"
              />
              <div>
                <h3 className="font-bold text-xl">هله بغداد</h3>
                <p className="text-sm text-background/70">يوم النظافة العام</p>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              أكبر حدث مجتمعي سنوي على مستوى العراق لتعزيز ثقافة النظافة والوعي البيئي.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <motion.a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-bold text-lg mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Event Info */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-bold text-lg mb-6">معلومات الفعالية</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">١٣- ١٤ شباط ٢٠٢٦</p>
                  <p className="text-sm text-background/60">بداية عطلة نصف السنة</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">ساحة الاحتفالات الكبرى</p>
                  <p className="text-sm text-background/60">بغداد، العراق</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-bold text-lg mb-6">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a
                  href="mailto:info@halabaghdad.com"
                  className="text-background/70 hover:text-primary transition-colors text-sm"
                >
                  info@halabaghdad.com
                </a>
              </li>
            </ul>

            {/* Organizers */}
            <div className="mt-8">
              <p className="text-sm text-background/50 mb-3">بتنظيم من:</p>
              <div className="flex flex-wrap gap-2">
                {["هله بغداد", "أمانة بغداد", "Holo Mix"].map((org) => (
                  <span
                    key={org}
                    className="px-3 py-1 rounded-full bg-background/10 text-xs"
                  >
                    {org}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <Separator className="my-10 bg-background/20" />

        {/* Copyright */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right"
        >
          <p className="text-sm text-background/60">
            © {currentYear} هله بغداد. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-background/60">
            صُنع بـ 💚 في بغداد
          </p>
        </motion.div>
      </Container>
    </footer>
  );
}
