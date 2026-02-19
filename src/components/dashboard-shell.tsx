"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";

type Props = {
  userEmail: string;
  children: React.ReactNode;
};

export function DashboardShell({ userEmail, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Backdrop móvel */}
      <button
        type="button"
        aria-label="Fechar menu"
        className={cn(
          "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMenuOpen(false)}
      />
      <AppSidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="min-h-screen pl-0 transition-[padding] lg:pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 border-b border-border/60 bg-card/95 px-4 shadow-[var(--shadow-sm)] backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="truncate text-sm text-muted-foreground max-w-[180px] sm:max-w-none">
              {userEmail}
            </span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="icon" title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
