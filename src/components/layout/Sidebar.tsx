"use client";

import { useAtom } from "jotai";
import { sidebarCollapsedAtom, sidebarMobileOpenAtom } from "@/store/sidebar";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Briefcase,
  KanbanSquare,
  Network,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
  LucideIcon
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Minimal User interface to satisfy types without @clerk/types dependency
interface SidebarUser {
  imageUrl: string;
  firstName: string | null;
  fullName: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
}

interface NavItem {
  icon?: LucideIcon;
  label?: string;
  href?: string;
  section?: string;
}

const SidebarContent = ({
  collapsed,
  setCollapsed,
  pathname,
  user,
  role,
  companyId,
  unitId,
  handleSignOut,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  pathname: string;
  user: SidebarUser;
  role: string | undefined;
  companyId: string | undefined;
  unitId: string | undefined;
  handleSignOut: () => void;
}) => {
  const getNavItems = () => {
    const items: NavItem[] = [];

    if (role === "OWNER" && companyId) {
      items.push({ section: "Entreprise" });
      items.push({ icon: Building2, label: "Vue d'ensemble", href: `/company/${companyId}` });
      items.push({ icon: Network, label: "Unités", href: `/company/${companyId}/units` });
      items.push({ icon: Users, label: "Équipe globale", href: `/company/${companyId}/team` });
      items.push({ icon: CreditCard, label: "Abonnement", href: `/company/${companyId}/settings/billing` });
    }

    if ((role === "OWNER" || role === "ADMIN") && unitId) {
      items.push({ section: "Unité Opérationnelle" });
      items.push({ icon: LayoutDashboard, label: "Tableau de bord", href: `/unite/${unitId}` });
      items.push({ icon: Briefcase, label: "Projets", href: `/unite/${unitId}/projects` });
      items.push({ icon: KanbanSquare, label: "Kanban", href: `/unite/${unitId}/kanban` });
      items.push({ icon: Users, label: "Clients", href: `/unite/${unitId}/clients` });
      items.push({ icon: UserIcon, label: "Membres", href: `/unite/${unitId}/members` });
      items.push({ icon: Settings, label: "Paramètres", href: `/unite/${unitId}/settings` });
    }

    if (role === "USER") {
      items.push({ section: "Mon Espace" });
      items.push({ icon: LayoutDashboard, label: "Tableau de bord", href: `/dashboard` });
      items.push({ icon: Briefcase, label: "Mes Projets", href: `/dashboard/projects` });
      items.push({ icon: KanbanSquare, label: "Mes Tâches", href: `/dashboard/tasks` });

      if (unitId) {
        items.push({ icon: KanbanSquare, label: "Kanban Unité", href: `/unite/${unitId}/kanban` });
      }
    }

    items.push({ section: "Personnel" });
    items.push({ icon: Bell, label: "Notifications", href: `/dashboard/notifications` });

    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-3xl border-r border-border shadow-sm text-foreground overflow-hidden">
      <div className="flex items-center justify-between h-14 shrink-0 px-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-xs tracking-tight">PM</span>
          </div>
          {!collapsed && <span className="font-bold text-sm tracking-tight truncate">PMA SYSTEM</span>}
        </div>

        <button
          className="hidden md:flex w-6 h-6 rounded-full bg-muted items-center justify-center hover:bg-muted-foreground/20 transition-colors shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-1.5 custom-scrollbar">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (collapsed) return <div key={idx} className="h-4 mt-2 mb-1 border-b border-border/50 mx-2" />;
            return (
              <div
                key={idx}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-1 px-2"
              >
                {item.section}
              </div>
            );
          }

          const isActive = pathname === item.href || (pathname.startsWith(item.href!) && item.href !== "/dashboard");

          return (
            <Link
              key={item.href}
              href={item.href!}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all group relative overflow-hidden",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />}
              {item.icon && (
                <item.icon
                  className={cn(
                    "w-[1.15rem] h-[1.15rem] shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
              )}

              <span
                className={cn(
                  "whitespace-nowrap transition-opacity duration-200",
                  collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-border mt-auto shrink-0 bg-background/50">
        <div className="flex items-center gap-3 w-full p-2 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all cursor-pointer overflow-hidden group">
          <Avatar className="w-8 h-8 rounded-lg shrink-0 border border-border">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="rounded-lg">{user.firstName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>

          <div
            className={cn(
              "flex flex-col flex-1 min-w-0 transition-opacity duration-200",
              collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto"
            )}
          >
            <span className="text-sm font-semibold truncate text-foreground">
              {user.fullName || user.emailAddresses[0].emailAddress}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center justify-between">
              {role || "USER"}
            </span>
          </div>

          {!collapsed && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSignOut();
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const [mobileOpen, setMobileOpen] = useAtom(sidebarMobileOpenAtom);

  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  if (!isLoaded || !user) return null;

  const role = user.publicMetadata?.role as "OWNER" | "ADMIN" | "USER" | undefined;
  const companyId = user.publicMetadata?.companyId as string | undefined;
  const unitId = user.publicMetadata?.unitId as string | undefined;

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  const sharedProps = {
    collapsed,
    setCollapsed,
    pathname,
    user,
    role,
    companyId,
    unitId,
    handleSignOut,
  };

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-transparent border-0 shadow-none">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SheetDescription className="sr-only">Naviguer dans l&apos;application PMA System</SheetDescription>
          <div className="h-full w-full bg-card rounded-r-2xl overflow-hidden shadow-2xl">
            <SidebarContent {...sharedProps} />
          </div>
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "hidden md:block h-screen sticky top-0 transition-all duration-300 z-30 shrink-0",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent {...sharedProps} />
      </aside>
    </>
  );
}
