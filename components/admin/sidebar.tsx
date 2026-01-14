"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Leaf,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

interface SidebarProps {
  user: AdminUser;
}

const navItems = [
  {
    title: "الرئيسية",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "المشاركين",
    href: "/admin/participants",
    icon: Users,
  },
  {
    title: "المشاهير",
    href: "/admin/celebrities",
    icon: Star,
  },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "مدير عام";
      case "admin":
        return "مدير";
      case "moderator":
        return "مشرف";
      default:
        return role;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Leaf size={20} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="font-bold text-sidebar-foreground whitespace-nowrap">
                  هله بغداد
                </h1>
                <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">
                  لوحة التحكم
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }
              `}
            >
              <item.icon size={20} className={isActive ? "text-primary" : ""} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={`flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/30 mb-2 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Shield size={18} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <p className="font-medium text-sm text-sidebar-foreground truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {getRoleLabel(user.role)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 ${isCollapsed ? "justify-center px-0" : ""}`}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                تسجيل الخروج
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -left-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
      >
        <ChevronLeft
          size={14}
          className={`transition-transform ${isCollapsed ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground shadow-lg"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed right-0 top-0 bottom-0 w-72 bg-sidebar border-l border-sidebar-border z-50 shadow-2xl"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute left-4 top-4 w-8 h-8 rounded-lg flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 72 : 256 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="hidden lg:block fixed right-0 top-0 bottom-0 bg-sidebar border-l border-sidebar-border z-30 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
