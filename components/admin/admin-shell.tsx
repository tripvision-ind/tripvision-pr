"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Package,
  MapPin,
  FileText,
  Star,
  Mail,
  Settings,
  Menu,
  X,
  LogOut,
  Globe,
  HelpCircle,
  DollarSign,
  User,
  Home,
  Search,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/currencies", label: "Currencies", icon: DollarSign },
  { href: "/admin/seo", label: "SEO Settings", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="size-5 text-primary-foreground" />
              </div>
              <span className="font-bold">{BRAND.name}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <link.icon className="size-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          {/* User */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                <User className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/">
                  <Home className="size-4 mr-1" />
                  Site
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="size-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex-1" />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
