"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ExternalLink,
  Search,
  Bell,
  Check,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

interface Counts {
  enquiries: number;
  reviews: number;
  notifications: number;
  packages: number;
  destinations: number;
  blogs: number;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, countKey: null },
  { href: "/admin/packages", label: "Packages", icon: Package, countKey: null },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin, countKey: null },
  { href: "/admin/blogs", label: "Blogs", icon: FileText, countKey: null },
  { href: "/admin/reviews", label: "Reviews", icon: Star, countKey: "reviews" as const },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail, countKey: "enquiries" as const },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, countKey: null },
  { href: "/admin/currencies", label: "Currencies", icon: DollarSign, countKey: null },
  { href: "/admin/seo", label: "SEO Settings", icon: Search, countKey: null },
  { href: "/admin/settings", label: "Settings", icon: Settings, countKey: null },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<Counts>({
    enquiries: 0,
    reviews: 0,
    notifications: 0,
    packages: 0,
    destinations: 0,
    blogs: 0,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/admin/counts");
        if (response.ok) {
          const data = await response.json();
          setCounts(data);
        }
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/admin/notifications?limit=5");
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mark notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
      setCounts((prev) => ({ ...prev, notifications: 0 }));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

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
              {sidebarLinks.map((link) => {
                const badgeCount = link.countKey ? counts[link.countKey] : 0;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="size-5" />
                      {link.label}
                    </div>
                    {badgeCount > 0 && (
                      <Badge
                        variant={pathname === link.href ? "secondary" : "destructive"}
                        className="ml-auto text-xs px-1.5 py-0.5 min-w-[20px] text-center"
                      >
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}

              {/* Notifications Link in Sidebar */}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setNotificationOpen(true);
                }}
                className={cn(
                  "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <Bell className="size-5" />
                  Notifications
                </div>
                {counts.notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-auto text-xs px-1.5 py-0.5 min-w-[20px] text-center"
                  >
                    {counts.notifications > 99 ? "99+" : counts.notifications}
                  </Badge>
                )}
              </Link>
            </nav>
          </ScrollArea>

          {/* User Section */}
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
                <Link href="/" target="_blank">
                  <ExternalLink className="size-4 mr-1" />
                  Visit Site
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
        <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-5" />
                  {counts.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                      {counts.notifications > 9 ? "9+" : counts.notifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {counts.notifications > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={markAllAsRead}
                    >
                      <Check className="size-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} asChild>
                      <Link
                        href={notification.link || "#"}
                        className={cn(
                          "flex flex-col items-start gap-1 p-3 cursor-pointer",
                          !notification.isRead && "bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <div className="size-2 bg-primary rounded-full" />
                          )}
                          <span className="font-medium text-sm">
                            {notification.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{session?.user?.name || "Admin"}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">
                    <Settings className="size-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/" target="_blank">
                    <ExternalLink className="size-4 mr-2" />
                    Visit Site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
