import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { AppSidebar } from "@/components/app-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-muted/30">
      <AppSidebar />
      <div className="pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-end border-b border-border/60 bg-card/95 px-6 shadow-[var(--shadow-sm)] backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{session.email}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="icon" title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
