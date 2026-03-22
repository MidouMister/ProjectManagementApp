"use client";

import { useAtom } from "jotai";
import { sidebarCollapsedAtom, sidebarMobileOpenAtom } from "@/store/sidebar";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckCircle,
  Inbox,
  BarChart3,
  FolderOpen,
  Users,
  Target,
  Settings,
  LogOut,
  Star,
  PanelLeftClose,
  PanelLeft,
  LucideIcon
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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

const SIDEBAR_WIDTH = "240px";
const SIDEBAR_COLLAPSED_WIDTH = "72px";

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

    if (role === "OWNER" && companyId) {
      items.push({ section: "Entreprise" });
      items.push({ icon: LayoutDashboard, label: "Vue d'ensemble", href: `/company/${companyId}` });
      items.push({ icon: FolderOpen, label: "Unités", href: `/company/${companyId}/units` });
      items.push({ icon: Users, label: "Équipe globale", href: `/company/${companyId}/team` });
      items.push({ icon: Settings, label: "Abonnement", href: `/company/${companyId}/settings/billing` });
    }

    if ((role === "OWNER" || role === "ADMIN") && unitId) {
      items.push({ section: "Unité Opérationnelle" });
      items.push({ icon: LayoutDashboard, label: "Tableau de bord", href: `/unite/${unitId}` });
      items.push({ icon: BarChart3, label: "Projets", href: `/unite/${unitId}/projects` });
      items.push({ icon: CheckCircle, label: "Kanban", href: `/unite/${unitId}/kanban` });
      items.push({ icon: Users, label: "Clients", href: `/unite/${unitId}/clients` });
      items.push({ icon: Settings, label: "Membres", href: `/unite/${unitId}/members` });
      items.push({ icon: Target, label: "Paramètres", href: `/unite/${unitId}/settings` });
    }

    if (role === "USER") {
      items.push({ section: "Mon Espace" });
      items.push({ icon: LayoutDashboard, label: "Tableau de bord", href: `/dashboard` });
      items.push({ icon: CheckCircle, label: "Mes Tâches", href: `/dashboard/tasks` });
      items.push({ icon: Inbox, label: "Boîte de réception", href: `/dashboard/inbox`, badge: 5 });
      items.push({ icon: BarChart3, label: "Reporting", href: `/dashboard/reporting` });
      items.push({ icon: FolderOpen, label: "Portfolio", href: `/dashboard/portfolio` });
      items.push({ icon: Users, label: "Comptes", href: `/dashboard/accounts` });
      items.push({ icon: Target, label: "Objectifs", href: `/dashboard/goals` });

      if (unitId) {
        items.push({ section: "Favoris" });
        items.push({ 
          icon: Star, 
          label: "ABC Projects", 
          href: `/unite/${unitId}`, 
          isFavourite: true, 
          favouriteColor: "tertiary" 
        });
        items.push({ 
          icon: Star, 
          label: "Marketing Ops", 
          href: `/unite/${unitId}/marketing`, 
          isFavourite: true, 
          favouriteColor: "primary" 
        });
      }
    }

    return items;
  };

  const navItems = getNavItems();
  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || (pathname.startsWith(href) && href !== "/dashboard");
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-low dark:bg-sidebar text-sidebar-foreground overflow-hidden transition-all duration-300">
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0 border-b border-outline-variant">
        <div className="w-9 h-9 bg-primary-container rounded-lg flex items-center justify-center shrink-0 shadow-sm">
          <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className={cn(
          "flex flex-col leading-none overflow-hidden transition-all duration-300",
          collapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          <span className="text-lg font-bold tracking-tighter text-foreground">PMA</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Project Management</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-0.5 scrollbar-hide">
        {navItems.map((item, idx) => {
          if (item.section) {
            if (collapsed) return null;
            return (
              <div
                key={idx}
                className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mt-4 mb-2 px-3"
              >
                {item.section}
              </div>
            );
          }

          const active = isActive(item.href);

          if (item.isFavourite) {
            return (
              <Link
                key={item.href}
                href={item.href!}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  active 
                    ? "bg-surface-container-lowest dark:bg-surface-container-high text-foreground shadow-sm font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high/50"
                )}
              >
                <span 
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    item.favouriteColor === "tertiary" 
                      ? "bg-tertiary-container border border-tertiary" 
                      : "bg-primary-container/30 border border-primary-container"
                  )}
                />
                <span className={cn(
                  "text-[13px] whitespace-nowrap transition-opacity duration-300",
                  collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                active 
                  ? "bg-surface-container-lowest dark:bg-surface-container-high text-foreground shadow-sm font-semibold" 
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high/50"
              )}
            >
              {item.icon && (
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-colors",
                    active ? "text-primary" : "group-hover:text-foreground"
                  )}
                />
              )}
              <span className={cn(
                "text-sm whitespace-nowrap transition-all duration-300",
                collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
              )}>
                {item.label}
              </span>
              {item.badge && !collapsed && (
                <span className="ml-auto bg-primary-container text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-outline-variant shrink-0">
        {/* Settings Button */}
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-surface-container-high/50"
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className={cn(
            "text-sm whitespace-nowrap transition-all duration-300",
            collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            Paramètres
          </span>
        </button>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-surface-container-high/50 mb-3"
          )}
        >
          {collapsed ? (
            <PanelLeft className="w-5 h-5 shrink-0" />
          ) : (
            <PanelLeftClose className="w-5 h-5 shrink-0" />
          )}
          <span className={cn(
            "text-sm whitespace-nowrap transition-all duration-300",
            collapsed ? "opacity-0 w-0 hidden" : "opacity-100"
          )}>
            Réduire
          </span>
        </button>

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-xl transition-all duration-200",
          "bg-surface-container-high/30 hover:bg-surface-container-high/50 cursor-pointer"
        )}>
          <Avatar className="w-9 h-9 rounded-lg shrink-0 border border-outline-variant">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback className="rounded-lg bg-primary-container text-primary-foreground font-bold">
              {user.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className={cn(
            "flex flex-col min-w-0 flex-1 overflow-hidden transition-all duration-300",
            collapsed ? "opacity-0 w-0" : "opacity-100"
          )}>
            <span className="text-xs font-bold truncate text-foreground">
              {user.fullName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {user.emailAddresses[0]?.emailAddress || ""}
            </span>
          </div>
        </div>

        {/* Role Badge & Sign Out */}
        {!collapsed && (
          <div className="flex items-center justify-between mt-2 px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
              {role || "USER"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="h-7 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
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
      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-transparent border-0 shadow-none">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SheetDescription className="sr-only">Naviguer dans l&apos;application PMA</SheetDescription>
          <div className="h-full w-full rounded-r-2xl overflow-hidden">
            <SidebarContent {...sharedProps} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen sticky top-0 z-30 shrink-0 flex-col",
          "transition-all duration-300 ease-in-out"
        )}
        style={{ 
          width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        }}
      >
        <SidebarContent {...sharedProps} />
      </aside>
    </>
  );
}
