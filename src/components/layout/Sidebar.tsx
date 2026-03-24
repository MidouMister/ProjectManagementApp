"use client";

import { useAtom } from "jotai";
import { sidebarCollapsedAtom, sidebarMobileOpenAtom } from "@/store/sidebar";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Kanban,
  Users,
  Users2,
  UserPlus,
  CreditCard,
  Building2,
  Bell,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavSection {
  type: "section";
  label: string;
  id: string;
}

interface NavLink {
  type: "link";
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string | number;
}

interface CollapsibleSection {
  type: "collapsible";
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavLink[];
}

type NavItem = NavSection | NavLink | CollapsibleSection;

// ─── Subscription Status Badge ────────────────────────────────────────────────

interface SubscriptionBadgeProps {
  status: string;
  endAt: Date | null;
  collapsed: boolean;
}

function SubscriptionBadge({ status, endAt, collapsed }: SubscriptionBadgeProps) {
  if (status === "ACTIVE") {
    return collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20 h-5 px-1.5 text-[10px]">
            ✓
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Abonnement actif
        </TooltipContent>
      </Tooltip>
    ) : (
      <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px]">
        ✓ Abonnement actif
      </Badge>
    );
  }

  if (status === "TRIAL" && endAt) {
    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    if (daysRemaining === 0) {
      return collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] animate-pulse">
              !
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Essai expiré
          </TooltipContent>
        </Tooltip>
      ) : (
        <Badge variant="destructive" className="text-[10px] animate-pulse">
          ⚠ Essai expiré
        </Badge>
      );
    }

    if (daysRemaining <= 7) {
      return collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
              {daysRemaining}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {daysRemaining} jours restants
          </TooltipContent>
        </Tooltip>
      ) : (
        <Badge variant="destructive" className="text-[10px]">
          ⚠ {daysRemaining}j restants
        </Badge>
      );
    }

    return collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 h-5 px-1.5 text-[10px]">
            {daysRemaining}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {daysRemaining} jours d&apos;essai restants
        </TooltipContent>
      </Tooltip>
    ) : (
      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px]">
        ⏱ {daysRemaining}j restants
      </Badge>
    );
  }

  if (status === "GRACE") {
    return collapsed ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
            !
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          Période de grâce
        </TooltipContent>
      </Tooltip>
    ) : (
      <Badge variant="destructive" className="text-[10px]">
        ⚠ Période de grâce
      </Badge>
    );
  }

  return null;
}

// ─── Company Logo ─────────────────────────────────────────────────────────────

interface CompanyLogoProps {
  logoUrl?: string | null;
  companyName?: string;
  collapsed: boolean;
}

function CompanyLogo({ logoUrl, companyName, collapsed }: CompanyLogoProps) {
  const logoSize = collapsed ? "w-9 h-9" : "w-10 h-10";
  
  if (collapsed) {
    if (logoUrl) {
      return (
        <div className={cn(logoSize, "rounded-xl overflow-hidden bg-surface-container-low shrink-0")}>
          <img src={logoUrl} alt={companyName || "Logo"} className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={cn(logoSize, "bg-primary rounded-xl flex items-center justify-center shrink-0")}>
        <span className="text-white text-sm font-black tracking-tight">
          {(companyName || "PMA").charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 min-w-0">
      {logoUrl ? (
        <div className={cn(logoSize, "rounded-xl overflow-hidden bg-surface-container-low shrink-0")}>
          <img src={logoUrl} alt={companyName || "Logo"} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={cn(logoSize, "bg-primary rounded-xl flex items-center justify-center shrink-0")}>
          <span className="text-white text-sm font-black tracking-tight">
            {(companyName || "PMA").charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div className="flex flex-col leading-none min-w-0">
        <span className="text-base font-bold text-foreground truncate tracking-tight">
          {companyName || "AGORA"}
        </span>
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
          Gestion Pro
        </span>
      </div>
    </div>
  );
}

// ─── Collapsible Nav Section ─────────────────────────────────────────────────

interface CollapsibleNavSectionProps {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavLink[];
  collapsed: boolean;
  pathname: string;
  onClose?: () => void;
}

function CollapsibleNavSection({
  id,
  label,
  icon: SectionIcon,
  items,
  collapsed,
  pathname,
  onClose,
}: CollapsibleNavSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const Icon = SectionIcon;

  const hasActiveChild = items.some((item) => {
    if (item.href === "/dashboard") return pathname === "/dashboard";
    return pathname === item.href || pathname.startsWith(item.href + "/");
  });

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150",
              hasActiveChild
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon className="w-4 h-4 shrink-0" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          <div className="font-semibold mb-1">{label}</div>
          {items.map((item) => (
            <div key={item.href} className="text-muted-foreground">
              {item.label}
            </div>
          ))}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-0.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150",
          hasActiveChild
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
        ) : (
          <ChevronRight className="w-3 h-3 shrink-0 opacity-60" />
        )}
      </button>

      {isOpen && (
        <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5">
          {items.map((item) => {
            const active = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const ItemIcon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 group",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full" />
                )}
                <ItemIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Role-based navigation builder ───────────────────────────────────────────

function buildNavItems(
  role: string | undefined,
  companyId: string | undefined,
  unitId: string | undefined,
): NavItem[] {
  const items: NavItem[] = [];

  if (role === "OWNER" && companyId) {
    // Entreprise section
    items.push({ type: "section", label: "Entreprise", id: "entreprise" });
    items.push({ type: "collapsible", id: "entreprise-nav", label: "Entreprise", icon: Building2, items: [
      { type: "link", icon: LayoutDashboard, label: "Vue d'ensemble", href: `/company/${companyId}` },
      { type: "link", icon: Building2, label: "Unités", href: `/company/${companyId}/units` },
      { type: "link", icon: Users2, label: "Équipe", href: `/company/${companyId}/team` },
    ]});
    items.push({ type: "link", icon: CreditCard, label: "Facturation", href: `/company/${companyId}/settings/billing` });
    items.push({ type: "link", icon: Settings, label: "Paramètres", href: `/company/${companyId}/settings` });
    
    // Unités section (for unit selector) - AFTER Paramètres
    items.push({ type: "section", label: "Unités", id: "unites" });
  }

  if ((role === "OWNER" || role === "ADMIN") && unitId) {
    // Unité section
    items.push({ type: "section", label: "Unité", id: "unite" });
    items.push({ type: "collapsible", id: "unite-nav", label: "Opérations", icon: Briefcase, items: [
      { type: "link", icon: LayoutDashboard, label: "Tableau de bord", href: `/unite/${unitId}` },
      { type: "link", icon: Briefcase, label: "Projets", href: `/unite/${unitId}/projects` },
      { type: "link", icon: Kanban, label: "Kanban", href: `/unite/${unitId}/kanban` },
      { type: "link", icon: Users, label: "Clients", href: `/unite/${unitId}/clients` },
    ]});
    items.push({ type: "link", icon: Bell, label: "Notifications", href: `/unite/${unitId}/notifications` });
    items.push({ type: "link", icon: Settings, label: "Paramètres", href: `/unite/${unitId}/settings` });
  }

  if (role === "USER") {
    items.push({ type: "section", label: "Mon espace", id: "mon-espace" });
    items.push({ type: "link", icon: LayoutDashboard, label: "Tableau de bord", href: `/dashboard` });
    items.push({ type: "link", icon: CheckSquare, label: "Mes tâches", href: `/dashboard/tasks` });
    items.push({ type: "link", icon: Bell, label: "Notifications", href: `/dashboard/notifications` });
  }

  return items;
}

// ─── SidebarCore ─────────────────────────────────────────────────────────────

interface SidebarCoreProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  onClose?: () => void;
  companyLogo?: string | null;
  companyName?: string;
  subscriptionStatus?: string;
  subscriptionEndAt?: Date | null;
  units?: Array<{ id: string; name: string }>;
  currentUnitId?: string | null;
}

function SidebarCore({
  collapsed,
  setCollapsed,
  onClose,
  companyLogo,
  companyName,
  subscriptionStatus = "TRIAL",
  subscriptionEndAt,
  units = [],
  currentUnitId,
}: SidebarCoreProps) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const router = useRouter();

  const role      = user?.publicMetadata?.role      as string | undefined;
  const companyId = user?.publicMetadata?.companyId as string | undefined;
  const unitId    = user?.publicMetadata?.unitId    as string | undefined;

  const navItems = buildNavItems(role, companyId, unitId);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  const getRoleLabel = (r: string | undefined) => {
    if (r === "OWNER") return "Propriétaire";
    if (r === "ADMIN") return "Administrateur";
    return "Collaborateur";
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[64px]" : "w-[260px]"
        )}
      >
        {/* ── Brand header ── */}
        <div className={cn(
          "flex items-center h-[64px] border-b border-sidebar-border shrink-0 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          <CompanyLogo
            logoUrl={companyLogo}
            companyName={companyName}
            collapsed={collapsed}
          />
          
          {/* Collapse toggle - always visible */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 rounded-lg text-muted-foreground hover:bg-surface-container-low hover:text-foreground transition-colors"
              >
                {collapsed
                  ? <PanelLeft className="w-4 h-4" />
                  : <PanelLeftClose className="w-4 h-4" />
                }
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              {collapsed ? "Développer" : "Réduire"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ── Subscription Status (OWNER only) ── */}
        {role === "OWNER" && !collapsed && (
          <div className="mx-3 my-2 p-3 rounded-xl bg-surface-container-low">
            <SubscriptionBadge
              status={subscriptionStatus}
              endAt={subscriptionEndAt || null}
              collapsed={false}
            />
          </div>
        )}

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 flex flex-col gap-0.5 scrollbar-hide">
          {navItems.map((item, idx) => {
            if (item.type === "section") {
              // Special handling for "Unités" section - renders unit selector
              if (item.id === "unites" && role === "OWNER") {
                if (collapsed) {
                  return <div key={idx} className="h-px bg-sidebar-border/50 my-2 mx-2" />;
                }
                return (
                  <div key={idx} className="px-3 pt-4 pb-2 first:pt-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                      {item.label}
                    </p>
                    <div className="relative">
                      <select
                        className="w-full h-10 pl-3 pr-8 rounded-lg bg-surface-container-low text-[13px] font-medium text-foreground border-0 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                        value={unitId || ""}
                        onChange={(e) => {
                          const newUnitId = e.target.value;
                          if (newUnitId) {
                            router.push(`/unite/${newUnitId}`);
                          }
                        }}
                      >
                        {units.map((unit) => (
                          <option key={unit.id} value={unit.id}>
                            {unit.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                );
              }

              if (collapsed) {
                return <div key={idx} className="h-px bg-sidebar-border/50 my-2 mx-2" />;
              }
              return (
                <p
                  key={idx}
                  className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 pt-4 pb-1.5 first:pt-0"
                >
                  {item.label}
                </p>
              );
            }

            if (item.type === "collapsible") {
              return (
                <CollapsibleNavSection
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  items={item.items}
                  collapsed={collapsed}
                  pathname={pathname}
                  onClose={onClose}
                />
              );
            }

            const active = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            const linkContent = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group overflow-hidden",
                  collapsed && "justify-center px-0 w-10 h-10 mx-auto",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
                )}
              >
                {/* Active left bar */}
                {active && !collapsed && (
                  <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full" />
                )}

                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />

                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}

                {!collapsed && item.badge !== undefined && (
                  <Badge variant="secondary" className="ml-auto text-[10px] h-5 px-1.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="text-xs flex items-center gap-2">
                    {item.label}
                    {item.badge !== undefined && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1">
                        {item.badge}
                      </Badge>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="shrink-0 border-t border-sidebar-border p-3 flex flex-col gap-3">
          {/* Membres Section (OWNER only) */}
          {role === "OWNER" && !collapsed && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">
                Membres
              </p>
              <Link
                href={`/company/${companyId}/team`}
                className="flex items-center justify-center gap-2 h-10 w-full px-3 rounded-lg bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Inviter des membres</span>
              </Link>
            </div>
          )}

          {/* User profile */}
          {user && (
            <div
              className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-container-low transition-colors",
                collapsed && "justify-center"
              )}
            >
              <Avatar className="w-9 h-9 rounded-xl shrink-0">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                  {getInitials(user.firstName)}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <>
                  <div className="flex flex-col min-w-0 flex-1 leading-none">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {user.fullName ?? "Utilisateur"}
                    </span>
                    <span className="text-[11px] text-primary font-medium mt-0.5">
                      {getRoleLabel(role)}
                    </span>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleSignOut}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Se déconnecter
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

// ─── Sidebar (exported) ───────────────────────────────────────────────────────

interface SidebarProps {
  companyLogo?: string | null;
  companyName?: string;
  subscriptionStatus?: string;
  subscriptionEndAt?: Date | null;
  units?: Array<{ id: string; name: string }>;
  currentUnitId?: string | null;
}

export function Sidebar(props: SidebarProps) {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const [mobileOpen, setMobileOpen] = useAtom(sidebarMobileOpenAtom);
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user) return null;

  return (
    <>
      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[260px] border-0">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SheetDescription className="sr-only">Navigation PMA</SheetDescription>
          <div className="h-full">
            <SidebarCore
              {...props}
              collapsed={false}
              setCollapsed={() => {}}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        <SidebarCore
          {...props}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>
    </>
  );
}
