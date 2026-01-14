"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Container } from "@/components/common/container";
import { RegistrationDialog } from "@/components/registration";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Update active section based on scroll position
      const sections = NAV_LINKS.map((link) => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && element.getBoundingClientRect().top <= 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image
                src="/hala.png"
                alt="هله بغداد"
                width={48}
                height={48}
                className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg lg:text-xl text-foreground">
                هله بغداد
              </h1>
              <p className="text-xs text-muted-foreground">
                يوم النظافة العام ٢٠٢٦
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  activeSection === link.href.slice(1)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </motion.button>
            ))}
            <Link href="/vote">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 transition-all"
              >
                🗳️ التصويت
              </motion.div>
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <RegistrationDialog
              trigger={
                <Button
                  size="lg"
                  className="rounded-full px-6 shadow-lg shadow-primary/25"
                >
                  سجّل الآن
                </Button>
              }
            />
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center gap-3 pb-6 border-b">
                  <Image
                    src="/hala.png"
                    alt="هله بغداد"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                  <div>
                    <h2 className="font-bold text-lg">هله بغداد</h2>
                    <p className="text-xs text-muted-foreground">
                      يوم النظافة العام ٢٠٢٦
                    </p>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className={cn(
                        "px-4 py-3 rounded-lg text-right font-medium transition-colors",
                        activeSection === link.href.slice(1)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      {link.label}
                    </button>
                  ))}
                  <Link
                    href="/vote"
                    className="px-4 py-3 rounded-lg text-right font-medium bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 transition-all"
                  >
                    🗳️ التصويت
                  </Link>
                </nav>

                <RegistrationDialog
                  trigger={
                    <Button
                      size="lg"
                      className="w-full rounded-full mt-4"
                    >
                      سجّل الآن
                    </Button>
                  }
                />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </Container>
    </motion.header>
  );
}
