"use client";

import { useAtom } from "jotai";
import { sidebarCollapsedAtom, sidebarMobileOpenAtom } from "@/store/sidebar";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckCircle2,
  Inbox,
  BarChart3,
  Users,
  Target,
  Settings,
  LogOut,
  Star,
  PanelLeftClose,
  PanelLeft,
  LucideIcon,
  ChevronRight,
  CreditCard,
  Building2,
  Bell,
  Kanban,
  Users2,
  Briefcase
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  badge?: number;
  isFavourite?: boolean;
  favouriteColor?: string;
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
  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [];

    // Enterprise Section (OWNER only)
    if (role === "OWNER" && companyId) {
      items.push({ section: "Entreprise" });
      items.push({ icon: LayoutDashboard, label: "Vue d'ensemble", href: `/company/${companyId}` });
      items.push({ icon: Building2, label: "Unités", href: `/company/${companyId}/units` });
      items.push({ icon: Users2, label: "Équipe globale", href: `/company/${companyId}/team` });
      items.push({ icon: CreditCard, label: "Facturation", href: `/company/${companyId}/settings/billing` });
    }

    // Unit Section (OWNER or ADMIN)
    if ((role === "OWNER" || role === "ADMIN") && unitId) {
      items.push({ section: "Unité Opérationnelle" });
      items.push({ icon: LayoutDashboard, label: "Tableau de bord", href: `/unite/${unitId}` });
      items.push({ icon: Briefcase, label: "Projets", href: `/unite/${unitId}/projects` });
      items.push({ icon: Kanban, label: "Kanban", href: `/unite/${unitId}/kanban` });
      items.push({ icon: Users, label: "Clients", href: `/unite/${unitId}/clients` });
      items.push({ icon: Users2, label: "Membres", href: `/unite/${unitId}/members` });
      items.push({ icon: Bell, label: "Notifications", href: `/unite/${unitId}/notifications`, badge: 3 });
      items.push({ icon: Settings, label: "Paramètres", href: `/unite/${unitId}/settings` });
    }

    // User/Collaborator Section
    if (role === "USER") {
      items.push({ section: "Mon Espace" });
      items.push({ icon: LayoutDashboard, label: "Tableau de bord", href: `/dashboard` });
      items.push({ icon: CheckCircle2, label: "Mes Tâches", href: `/dashboard/tasks` });
      items.push({ icon: Inbox, label: "Messages", href: `/dashboard/messages`, badge: 5 });
      items.push({ icon: BarChart3, label: "Reporting", href: `/dashboard/reporting` });
    }

    // Recent Projects Section (if not collapsed)
    if (!collapsed) {
      items.push({ section: "Projets Récents" });
      items.push({ 
        icon: Star, 
        label: "Neo-Brutalist HQ", 
        href: `/unite/${unitId}/p-neo`, 
        isFavourite: true, 
        favouriteColor: "primary" 
      });
      items.push({ 
        icon: Star, 
        label: "Vertical Garden", 
        href: `/unite/${unitId}/p-garden`, 
        isFavourite: true, 
        favouriteColor: "secondary" 
      });
    }

    return items;
  };

  const navItems = getNavItems();
  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (pathname.startsWith(href) && href !== "/dashboard");
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low text-sidebar-foreground overflow-hidden">
      {/* Header section with brand and toggle */}
      <div className="flex items-center gap-3 px-6 h-20 shrink-0">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 transition-transform hover:rotate-3">
          <Target className="w-6 h-6 text-on-primary" />
        </div>
        <div className={cn(
          "flex flex-col leading-tight transition-all duration-500",
          collapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"
        )}>
          <span className="text-lg font-extrabold tracking-tighter text-foreground">AGORA</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Gestion Pro</span>
        </div>
      </div>

      {/* Navigation section */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-6 px-4 flex flex-col gap-1 scrollbar-hide">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (collapsed) return <div key={idx} className="h-px bg-outline-variant/30 my-4 mx-4" />;
            return (
              <div
                key={idx}
                className="text-label text-muted-foreground/40 mt-6 mb-2 px-4 transition-all"
              >
                {item.section}
              </div>
            );
          }

          const active = isActive(item.href);

          return (
            <Link
              key={item.href || idx}
              href={item.href || "#"}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-sidebar transition-all duration-300",
                active 
                  ? "bg-surface-container-lowest text-foreground shadow-sm font-bold" 
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-container/50"
              )}
            >
              {/* Active Indicator Bar */}
              {active && !collapsed && (
                <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-primary rounded-r-full" />
              )}
              
              {item.isFavourite ? (
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125",
                  active ? "ring-4 ring-primary/10" : "",
                  item.favouriteColor === "secondary" ? "bg-amber-400" : "bg-primary"
                )} />
              ) : (
                item.icon && (
                  <item.icon
                    className={cn(
                      "w-5 h-5 shrink-0 transition-all group-hover:scale-110",
                      active ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary"
                    )}
                  />
                )
              )}

              <span className={cn(
                "text-[13px] font-medium whitespace-nowrap transition-all duration-500",
                collapsed ? "opacity-0 invisible w-0" : "opacity-100 visible"
              )}>
                {item.label}
              </span>

              {!collapsed && active && (
                <ChevronRight className="ml-auto w-4 h-4 text-primary/40" />
              )}
              
              {item.badge && !collapsed && (
                <span className="ml-auto bg-primary text-on-primary text-[10px] font-black px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer quick actions */}
      <div className="p-4 flex flex-col gap-2 shrink-0">
        <div className="bg-surface-container rounded-2xl p-2 flex flex-col gap-1">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-muted-foreground hover:text-foreground hover:bg-surface-container-high group"
          >
            {collapsed ? (
              <PanelLeft className="w-5 h-5 shrink-0 transition-transform group-hover:rotate-12" />
            ) : (
              <PanelLeftClose className="w-5 h-5 shrink-0 transition-transform group-hover:-rotate-12" />
            )}
            {!collapsed && <span className="text-xs font-bold uppercase tracking-wider transition-all">Réduire</span>}
          </button>
        </div>

        {/* User profile section */}
        <div className={cn(
          "relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-500 overflow-hidden group",
          "bg-white dark:bg-surface-container-highest shadow-sm",
          collapsed ? "justify-center" : "px-4"
        )}>
          <Avatar className="w-10 h-10 rounded-xl shrink-0 transition-transform group-hover:scale-105">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="rounded-xl bg-primary text-on-primary font-black text-xs">
              {user.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-black truncate text-foreground leading-tight">
                {user.fullName || "Utilisateur"}
              </span>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase mt-0.5">
                {role || "Collaborateur"}
              </span>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-1"
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

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
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
        <SheetContent side="left" className="p-0 w-[280px] bg-transparent border-0 shadow-none">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SheetDescription className="sr-only">Naviguer dans l&apos;application agora</SheetDescription>
          <div className="h-full w-full rounded-r-2xl overflow-hidden shadow-2xl">
            <SidebarContent {...sharedProps} />
          </div>
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          "hidden md:flex h-screen sticky top-0 z-30 shrink-0 flex-col transition-all duration-500 ease-in-out",
          collapsed ? "w-[80px]" : "w-[260px]"
        )}
      >
        <SidebarContent {...sharedProps} />
      </aside>
    </>
  );
}
