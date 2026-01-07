import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="bg-gradient-to-br from-background via-background to-muted/30">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 sticky top-0 z-10 bg-background/60 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1 hover:bg-muted/50 transition-colors" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-border/40" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium text-muted-foreground/80">Dashboard</h1>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};