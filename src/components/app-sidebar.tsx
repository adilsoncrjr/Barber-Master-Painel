"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  MessageSquare,
  BarChart2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/barbershops", label: "Barbearias", icon: Store },
  { href: "/admins", label: "Admins das barbearias", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/support", label: "Suporte", icon: MessageSquare },
  { href: "/reports", label: "Relatórios SaaS", icon: BarChart2 },
];

type AppSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function AppSidebar({ mobileOpen = false, onClose }: AppSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen w-56 flex-col border-r border-border/60 bg-card shadow-[var(--shadow-md)] transition-transform duration-200 ease-out lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
      aria-hidden={!mobileOpen}
    >
      <div className="flex h-14 shrink-0 items-center border-b px-5">
        <Link
          href="/dashboard"
          className="font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          Barber Hub Painel
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <span className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/80">
          Menu
        </span>
        {navItems.map((item) => {
          const isActive =
            pathname != null &&
            (pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href)));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0 opacity-90" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
