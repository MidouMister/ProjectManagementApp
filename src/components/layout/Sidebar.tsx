"use client";

import { useAtom } from "jotai";
import { sidebarCollapsedAtom, sidebarMobileOpenAtom } from "@/store/sidebar";
import { useUser } from "@clerk/nextjs";
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
  PanelLeftClose,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Layers,
  type LucideIcon,
  PanelRightClose,
  Circle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface NavSection { type: "section"; label: string; id: string }
interface NavLink { type: "link"; icon: LucideIcon; label: string; href: string; badge?: string | number }
interface CollapsibleSection { type: "collapsible"; id: string; label: string; icon: LucideIcon; items: NavLink[] }
type NavItem = NavSection | NavLink | CollapsibleSection;

// ─── Company / Unit Selector ──────────────────────────────────────────────────

interface SelectorUnit { id: string; name: string }

function CompanyUnitSelector({
  collapsed, companyId, companyName, companyLogo, units, role,
}: {
  collapsed: boolean;
  companyId: string | undefined;
  companyName: string | undefined;
  companyLogo: string | null | undefined;
  units: SelectorUnit[];
  role: string | undefined;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isOwner = role === "OWNER";
  const onCompany = companyId ? pathname.startsWith(`/company/${companyId}`) : false;
  const activeUnit = units.find((u) => pathname.startsWith(`/unite/${u.id}`));
  const currentName = onCompany ? companyName : activeUnit?.name ?? companyName ?? "Sélectionner";
  const isUnitActive = !!activeUnit;
  const isCompanyActive = onCompany;

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
    router.refresh();
  }

  if (collapsed) {
    return (
      <div className="flex justify-center py-2 px-2">
        <Popover open={open} onOpenChange={isOwner ? setOpen : undefined}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <button
                  disabled={!isOwner}
                  aria-label="Changer de contexte"
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all",
                    "bg-primary/10 hover:bg-primary/20",
                    isOwner ? "cursor-pointer" : "cursor-default opacity-50"
                  )}
                >
                  {companyLogo ? (
                    <img src={companyLogo} alt="" className="w-4 h-4 rounded object-contain" />
                  ) : (
                    <Building2 className="w-4 h-4 text-primary" />
                  )}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-popover border shadow-lg">
              <p className="font-medium">{currentName}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5">
                {isUnitActive ? "Unité" : isCompanyActive ? "Entreprise" : ""}
              </p>
            </TooltipContent>
          </Tooltip>
          <SelectorPanel
            companyId={companyId}
            companyName={companyName}
            units={units}
            isOwner={isOwner}
            onNavigate={navigate}
            side="right"
          />
        </Popover>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      <Popover open={open} onOpenChange={isOwner ? setOpen : undefined}>
        <PopoverTrigger asChild>
          <button
            disabled={!isOwner}
            className={cn(
              "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all group",
              isOwner
                ? "hover:bg-surface-container cursor-pointer"
                : "cursor-default opacity-70"
            )}
          >
            {/* Icon container */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                isCompanyActive
                  ? "bg-primary text-primary-foreground"
                  : isUnitActive
                  ? "bg-primary/20 text-primary"
                  : "bg-surface-container-high text-muted-foreground"
              )}
            >
              {companyLogo ? (
                <img src={companyLogo} alt="" className="w-4 h-4 rounded object-contain" />
              ) : (
                <Building2 className="w-4 h-4" />
              )}
            </div>

            {/* Name and type */}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">
                {currentName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                {isUnitActive
                  ? "Unité opérationnelle"
                  : isCompanyActive
                  ? "Entreprise"
                  : ""}
              </p>
            </div>

            {/* Chevron */}
            {isOwner && (
              <ChevronUp
                className={cn(
                  "w-3.5 h-3.5 shrink-0 transition-transform",
                  open ? "rotate-180 text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent side="bottom" align="start" sideOffset={4} className="w-64 p-0 bg-popover border shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-3 py-2 border-b bg-muted/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Basculer vers
            </p>
          </div>

          {/* Options */}
          <div className="p-1.5">
            {/* Company option */}
            {isOwner && companyId && (
              <button
                onClick={() => navigate(`/company/${companyId}`)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-left",
                  isCompanyActive && !isUnitActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                    isCompanyActive && !isUnitActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{companyName}</p>
                  <p className="text-[10px] text-muted-foreground">Entreprise</p>
                </div>
                {isCompanyActive && !isUnitActive && (
                  <Circle className="w-2.5 h-2.5 fill-primary text-primary shrink-0" />
                )}
              </button>
            )}

            {/* Units */}
            {units.length > 0 && (
              <>
                <div className="h-px bg-border my-1.5" />
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-2.5 pt-1 pb-1.5">
                  Unités
                </p>
                {units.map((unit) => {
                  const isActive = pathname.startsWith(`/unite/${unit.id}`);
                  return (
                    <button
                      key={unit.id}
                      onClick={() => navigate(`/unite/${unit.id}`)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-colors text-left",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent"
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-surface text-muted-foreground"
                        )}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{unit.name}</p>
                        <p className="text-[10px] text-muted-foreground">Unité</p>
                      </div>
                      {isActive && (
                        <Circle className="w-2.5 h-2.5 fill-primary text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </>
            )}

            {/* Empty state */}
            {units.length === 0 && isOwner && (
              <div className="px-2.5 py-3 text-center">
                <p className="text-xs text-muted-foreground">Aucune unité</p>
                <Link
                  href={`/company/${companyId}/units/new`}
                  className="text-[10px] text-primary hover:underline mt-1 inline-block"
                  onClick={() => setOpen(false)}
                >
                  Créer une unité
                </Link>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ─── Selector Panel (for collapsed state) ────────────────────────────────────

function SelectorPanel({
  companyId,
  companyName,
  units,
  isOwner,
  onNavigate,
  side,
}: {
  companyId: string | undefined;
  companyName: string | undefined;
  units: SelectorUnit[];
  isOwner: boolean;
  onNavigate: (href: string) => void;
  side: "right" | "bottom";
}) {
  return (
    <PopoverContent
      side={side}
      align="start"
      sideOffset={8}
      avoidCollisions
      collisionPadding={12}
      className="w-64 p-0 bg-popover border shadow-lg rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 py-2 border-b bg-muted/30">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Basculer vers
        </p>
      </div>

      {/* Options */}
      <div className="p-1.5">
        {/* Company */}
        {isOwner && companyId && (
          <button
            onClick={() => onNavigate(`/company/${companyId}`)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{companyName}</p>
              <p className="text-[10px] text-muted-foreground">Entreprise</p>
            </div>
          </button>
        )}

        {/* Units */}
        {units.length > 0 && (
          <>
            <div className="h-px bg-border my-1.5" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-2.5 pt-1 pb-1.5">
              Unités
            </p>
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => onNavigate(`/unite/${unit.id}`)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-md bg-surface text-muted-foreground flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{unit.name}</p>
                  <p className="text-[10px] text-muted-foreground">Unité</p>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </PopoverContent>
  );
}

// ─── Collapsible Nav Section ──────────────────────────────────────────────────

function CollapsibleNavSection({ label, icon: Icon, items, collapsed, pathname, onClose }: {
  id: string; label: string; icon: LucideIcon; items: NavLink[];
  collapsed: boolean; pathname: string; onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasActive = items.some((i) => i.href === "/dashboard" ? pathname === i.href : pathname === i.href || pathname.startsWith(i.href + "/"));

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center justify-center w-8 h-8 mx-auto rounded-lg cursor-pointer transition-all mt-1.5",
              hasActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs bg-popover border shadow-lg">
          <div className="font-medium mb-1">{label}</div>
          {items.map((i) => (
            <div key={i.href} className="text-muted-foreground">{i.label}</div>
          ))}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-0.5 mt-1.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-2.5 px-4 py-2 rounded-md text-xs font-medium transition-all duration-150",
          hasActive
            ? "text-primary bg-primary/5"
            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-0.5 ml-2">
          {items.map((item) => {
            const active = item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const I = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-all duration-150 group",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <I
                  className={cn(
                    "w-3.5 h-3.5 shrink-0 transition-colors duration-150",
                    active ? "" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge className="ml-auto bg-black/10 text-current text-[10px] h-4 px-1 shadow-none rounded">
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

// ─── Nav builder ─────────────────────────────────────────────────────────────

function buildNavItems(
  role: string | undefined,
  companyId: string | undefined,
  unitId: string | undefined
): NavItem[] {
  const items: NavItem[] = [];

  if (role === "OWNER" && companyId) {
    items.push({
      type: "link",
      icon: LayoutDashboard,
      label: "Tableau de bord",
      href: `/company/${companyId}`,
    });
    items.push({
      type: "link",
      icon: Building2,
      label: "Unités",
      href: `/company/${companyId}/units`,
    });
    items.push({
      type: "link",
      icon: Users2,
      label: "Équipe",
      href: `/company/${companyId}/team`,
    });
    items.push({
      type: "link",
      icon: CreditCard,
      label: "Facturation",
      href: `/company/${companyId}/settings/billing`,
    });
  }

  if ((role === "OWNER" || role === "ADMIN") && unitId) {
    items.push({
      type: "link",
      icon: LayoutDashboard,
      label: "Tableau de bord",
      href: `/unite/${unitId}`,
    });
    items.push({
      type: "link",
      icon: Briefcase,
      label: "Projets",
      href: `/unite/${unitId}/projects`,
    });
    items.push({
      type: "link",
      icon: Kanban,
      label: "Kanban",
      href: `/unite/${unitId}/kanban`,
    });
    items.push({
      type: "link",
      icon: Users,
      label: "Clients",
      href: `/unite/${unitId}/clients`,
    });
    items.push({
      type: "link",
      icon: Bell,
      label: "Notifications",
      href: `/unite/${unitId}/notifications`,
    });
  }

  if (role === "USER") {
    items.push({
      type: "link",
      icon: LayoutDashboard,
      label: "Tableau de bord",
      href: `/dashboard`,
    });
    items.push({
      type: "link",
      icon: CheckSquare,
      label: "Mes tâches",
      href: `/dashboard/tasks`,
    });
    items.push({
      type: "link",
      icon: Bell,
      label: "Notifications",
      href: `/dashboard/notifications`,
    });
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
  units?: Array<{ id: string; name: string }>;
  currentUnitId?: string | null;
}

function SidebarCore({
  collapsed,
  setCollapsed,
  onClose,
  companyLogo,
  companyName,
  units = [],
}: SidebarCoreProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const role = user?.publicMetadata?.role as string | undefined;
  const companyId = user?.publicMetadata?.companyId as string | undefined;
  const unitId = user?.publicMetadata?.unitId as string | undefined;

  const navItems = buildNavItems(role, companyId, unitId);

  const getRoleLabel = (r: string | undefined) =>
    r === "OWNER" ? "Propriétaire" : r === "ADMIN" ? "Admin" : "Collaborateur";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const p = name.split(" ");
    return p.length >= 2
      ? (p[0][0] + p[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  // Mock team members
  const teamMembers = [
    { initials: "AM", color: "bg-[#b388ff]" },
    { initials: "KB", color: "bg-[#2979ff]" },
    { initials: "SH", color: "bg-[#00e676]" },
    { initials: "YB", color: "bg-[#ff9100]" },
    { initials: "MK", color: "bg-[#ff3d00]" },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex flex-col h-full bg-sidebar transition-all duration-300 relative",
          collapsed ? "w-[56px]" : "w-[220px]"
        )}
      >
        {/* App header */}
        <div
            className={cn(
            "flex flex-row items-center h-[52px] shrink-0 px-3 relative",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-primary rounded-md shrink-0 flex items-center justify-center shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none min-w-0">
                <span className="text-sm font-bold text-primary truncate">PMA</span>
                <span className="text-[8px] text-muted-foreground uppercase tracking-widest mt-0.5">
                  Management
                </span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setCollapsed(true)}
                  className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-foreground text-background px-2 py-1 rounded shadow-lg">
                Réduire
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {collapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setCollapsed(false)}
                className="mx-auto mt-1.5 p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none"
              >
                <PanelRightClose className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-foreground text-background px-2 py-1 rounded shadow-lg">
              Développer
            </TooltipContent>
          </Tooltip>
        )}

        {/* ── Company / Unit Selector ── */}
        <CompanyUnitSelector
          collapsed={collapsed}
          companyId={companyId}
          companyName={companyName}
          companyLogo={companyLogo}
          units={units}
          role={role}
        />

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden pt-1 pb-4 flex flex-col gap-0.5 scrollbar-hide">
          {navItems.map((item, idx) => {
            if (item.type === "section") {
              return collapsed ? (
                <div
                  key={idx}
                  className="h-[1px] w-5 bg-border my-2 mx-auto rounded-full"
                />
              ) : (
                <p
                  key={idx}
                  className="text-[10px] text-muted-foreground px-4 pt-4 pb-1.5 first:pt-2 font-semibold uppercase tracking-wider"
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

            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            const linkEl = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "relative flex items-center gap-2.5 mx-2.5 px-2.5 py-2 rounded-md text-xs transition-all duration-150 group",
                  collapsed && "justify-center px-0 w-8 h-8 mx-auto",
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0 transition-colors duration-150",
                    active ? "" : "text-muted-foreground group-hover:text-primary"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge className="ml-auto bg-black/10 text-current text-[10px] h-4 px-1 shadow-none rounded">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="text-xs bg-popover border shadow-lg flex items-center gap-2"
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <Badge className="bg-black/10 text-current text-[10px] h-4 px-1 shadow-none rounded">
                      {item.badge}
                    </Badge>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              linkEl
            );
          })}

          {/* Team Facepile Section */}
          {!collapsed && role === "OWNER" && (
            <div className="mt-4 px-4">
              <p className="text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-wider">
                Équipe
              </p>

              <div className="flex -space-x-1.5 overflow-hidden mb-3">
                {teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className={cn(
                      "inline-block h-6 w-6 rounded-full ring-2 ring-sidebar flex items-center justify-center text-white text-[9px] font-bold",
                      member.color
                    )}
                  >
                    {member.initials}
                  </div>
                ))}
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-sidebar bg-surface flex items-center justify-center text-muted-foreground text-[9px] font-bold">
                  +
                </div>
              </div>

              <Link
                href={`/company/${companyId}/team`}
                className="flex items-center gap-2 text-xs text-muted-foreground font-medium hover:text-primary transition-colors group"
                onClick={onClose}
              >
                <UserPlus className="w-3.5 h-3.5 group-hover:text-primary" />
                <span>Inviter</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="shrink-0 pt-2 pb-4 px-3 bg-sidebar border-t border-border">
          {user && (
            <div
              className={cn(
                "flex items-center gap-2.5 px-1.5 py-1.5 rounded-lg",
                collapsed && "justify-center"
              )}
            >
              <Avatar className="w-8 h-8 rounded-lg shrink-0 border-none shadow-sm relative">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="rounded-lg bg-primary-container text-primary text-xs font-bold">
                  {getInitials(user.firstName)}
                </AvatarFallback>
                <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 border-2 border-sidebar rounded-full"></span>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="flex flex-col min-w-0 flex-1 leading-none justify-center">
                    <span className="text-xs font-semibold text-foreground truncate tracking-tight">
                      {user.fullName ?? "Utilisateur"}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                      {getRoleLabel(role)}
                    </span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => router.push(`/company/${companyId}/settings`)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs bg-foreground text-background px-2 py-1 rounded shadow-lg">
                      Paramètres
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
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[220px] border-none shadow-lg bg-sidebar">
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
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        <SidebarCore {...props} collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
    </>
  );
}
