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
  ChevronsUpDown,
  Layers,
  type LucideIcon,
  PanelRightClose,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isOwner    = role === "OWNER";
  const onCompany  = companyId ? pathname.startsWith(`/company/${companyId}`) : false;
  const activeUnit = units.find((u) => pathname.startsWith(`/unite/${u.id}`));
  const currentName = onCompany ? companyName : activeUnit?.name ?? companyName ?? "Sélectionner";

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
    router.refresh();
  }

  const logoEl = companyLogo
    ? <img src={companyLogo} alt={companyName ?? ""} className="w-4 h-4 rounded object-contain" />
    : <Building2 className="w-4 h-4 text-on-surface-variant" />;

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
                    "w-8 h-8 flex items-center justify-center rounded-btn transition-colors",
                    "bg-surface-container-lowest shadow-card",
                    isOwner ? "cursor-pointer hover:bg-surface-container-low" : "cursor-default opacity-60"
                  )}
                >
                  {logoEl}
                </button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-surface border-none shadow-modal">
              <p className="font-medium text-on-surface">{currentName}</p>
            </TooltipContent>
          </Tooltip>
          <SelectorPanel companyId={companyId} companyName={companyName} companyLogo={companyLogo} units={units} isOwner={isOwner} onNavigate={navigate} side="right" />
        </Popover>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <p className="text-[10px] text-on-surface-variant mb-2 font-semibold tracking-wider uppercase">Active Entity</p>
      <div className="bg-surface-container-low rounded-lg shadow-card p-2.5 pb-3 space-y-3">
        <Popover open={open} onOpenChange={isOwner ? setOpen : undefined}>
          <PopoverTrigger asChild>
            <button
              disabled={!isOwner}
              className={cn(
                "w-full flex items-center gap-2.5 transition-opacity group",
                isOwner ? "cursor-pointer hover:opacity-80" : "cursor-default"
              )}
            >
              <div className={cn(
                "w-7 h-7 shrink-0 rounded-md flex items-center justify-center overflow-hidden",
                "bg-surface-container-high"
              )}>
                {companyLogo
                  ? <img src={companyLogo} alt="" className="w-full h-full object-contain p-0.5" />
                  : <Building2 className="w-3.5 h-3.5 text-on-surface-variant" />
                }
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-semibold text-on-surface truncate leading-tight">{currentName}</p>
              </div>
              {isOwner && <ChevronsUpDown className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />}
            </button>
          </PopoverTrigger>
          <SelectorPanel companyId={companyId} companyName={companyName} companyLogo={companyLogo} units={units} isOwner={isOwner} onNavigate={navigate} side="bottom" />
        </Popover>

        {/* Display inline units if any */}
        {units.length > 0 && (
          <div className="space-y-2 pl-3 pr-0.5">
            {units.slice(0, 3).map((unit) => {
              const active = pathname.startsWith(`/unite/${unit.id}`);
              return (
                <div key={unit.id} className="flex items-center gap-2 group relative cursor-pointer" onClick={() => navigate(`/unite/${unit.id}`)}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    active ? "bg-primary" : "bg-surface-container-highest"
                  )} />
                  <span className={cn(
                    "text-xs truncate",
                    active ? "text-primary font-medium" : "text-on-surface-variant"
                  )}>{unit.name}</span>
                </div>
              );
            })}
            {units.length > 3 && (
              <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate(`/company/${companyId}/units`)}>
                <span className="w-1.5 h-1.5 rounded-full bg-surface-container-highest shrink-0" />
                <span className="text-xs text-on-surface-variant italic">+{units.length - 3} autres</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Selector Popover Panel ───────────────────────────────────────────────────

function SelectorPanel({
  companyId, companyName, companyLogo, units, isOwner, onNavigate, side,
}: {
  companyId: string | undefined; companyName: string | undefined; companyLogo: string | null | undefined;
  units: SelectorUnit[]; isOwner: boolean;
  onNavigate: (href: string) => void; side: "right" | "bottom";
}) {
  return (
    <PopoverContent
      side={side} align="start" sideOffset={8} avoidCollisions collisionPadding={12}
      className={cn(
        "p-0 rounded-lg border-none bg-surface-container-lowest shadow-modal",
        side === "right" ? "w-64" : "w-[--radix-popover-trigger-width] min-w-56"
      )}
    >
      <Command className="bg-transparent rounded-lg">
        <CommandList className="max-h-64 overflow-y-auto">
          <CommandEmpty className="py-6 text-center text-xs text-on-surface-variant">Aucun résultat</CommandEmpty>

          {isOwner && companyId && (
            <CommandGroup>
              <p className="px-3 pt-2 pb-1.5 text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Entreprise</p>
              <CommandItem
                value={companyName ?? "entreprise"}
                onSelect={() => onNavigate(`/company/${companyId}`)}
                className="mx-1.5 mb-1 rounded-md cursor-pointer data-[selected=true]:bg-surface-container-low"
              >
                <div className="flex items-center gap-2.5 w-full py-1">
                  <div className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center overflow-hidden bg-surface-container">
                    {companyLogo ? <img src={companyLogo} alt={companyName ?? ""} className="w-full h-full object-contain p-0.5" /> : <Layers className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <span className="flex-1 min-w-0 text-xs font-medium truncate text-on-surface">{companyName ?? "Entreprise"}</span>
                </div>
              </CommandItem>
            </CommandGroup>
          )}

          <CommandGroup>
            <p className="px-3 pt-2 pb-1.5 text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">Unités</p>
            {units.length > 0 ? units.map((unit) => (
              <CommandItem
                key={unit.id} value={unit.name}
                onSelect={() => onNavigate(`/unite/${unit.id}`)}
                className="mx-1.5 mb-1 rounded-md cursor-pointer data-[selected=true]:bg-surface-container-low"
              >
                <div className="flex items-center gap-2.5 w-full py-1">
                  <div className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center overflow-hidden bg-surface-container">
                    <Building2 className="w-3.5 h-3.5 text-on-surface-variant" />
                  </div>
                  <span className="flex-1 min-w-0 text-xs font-medium truncate text-on-surface">{unit.name}</span>
                </div>
              </CommandItem>
            )) : (
              <div className="mx-1.5 mb-1.5 px-2.5 py-3 rounded-md bg-surface-container text-center text-xs text-on-surface-variant">
                Aucune unité créée
              </div>
            )}
          </CommandGroup>
        </CommandList>
      </Command>
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
            className={cn("flex items-center justify-center w-8 h-8 mx-auto rounded-md cursor-pointer transition-colors mt-1.5",
              hasActive ? "bg-surface-container-lowest text-primary shadow-card" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs bg-surface text-on-surface border-none shadow-modal">
          <div className="font-medium mb-1 text-on-surface">{label}</div>
          {items.map((i) => <div key={i.href} className="text-on-surface-variant">{i.label}</div>)}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="space-y-0.5 mt-1.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn("w-full flex items-center gap-2.5 px-4 py-2 rounded-md text-xs font-medium transition-colors",
          hasActive ? "text-primary bg-transparent" : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
        )}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span className="flex-1 text-left truncate">{label}</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 opacity-50" /> : <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
      </button>
      {isOpen && (
        <div className="space-y-0.5">
          {items.map((item) => {
            const active = item.href === "/dashboard" ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
            const I = item.icon;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={cn("relative flex items-center gap-2.5 mx-2.5 px-2.5 py-2 rounded-md text-xs transition-colors group",
                  active ? "bg-surface-container-lowest text-primary shadow-card font-semibold z-10" : "text-on-surface-variant font-medium hover:text-on-surface"
                )}
              >
                <I className={cn("w-3.5 h-3.5 shrink-0", active ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface")} />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && <Badge className="ml-auto bg-surface-container text-on-surface-variant text-[10px] h-4 px-1 shadow-none rounded-sm">{item.badge}</Badge>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Nav builder ─────────────────────────────────────────────────────────────

function buildNavItems(role: string | undefined, companyId: string | undefined, unitId: string | undefined): NavItem[] {
  const items: NavItem[] = [];

  if (role === "OWNER" && companyId) {
    items.push({ type: "link", icon: LayoutDashboard, label: "Tableau de bord", href: `/company/${companyId}` });
    items.push({ type: "link", icon: Building2,       label: "Unités",         href: `/company/${companyId}/units` });
    items.push({ type: "link", icon: Users2,          label: "Équipe",         href: `/company/${companyId}/team` });
    items.push({ type: "link", icon: CreditCard,      label: "Facturation",    href: `/company/${companyId}/settings/billing` });
  }

  if ((role === "OWNER" || role === "ADMIN") && unitId) {
    items.push({ type: "link", icon: LayoutDashboard, label: "Tableau de bord", href: `/unite/${unitId}` });
    items.push({ type: "link", icon: Briefcase,       label: "Projets",         href: `/unite/${unitId}/projects` });
    items.push({ type: "link", icon: Kanban,          label: "Kanban",          href: `/unite/${unitId}/kanban` });
    items.push({ type: "link", icon: Users,            label: "Clients",         href: `/unite/${unitId}/clients` });
    items.push({ type: "link", icon: Bell,            label: "Notifications",   href: `/unite/${unitId}/notifications` });
  }

  if (role === "USER") {
    items.push({ type: "link", icon: LayoutDashboard, label: "Tableau de bord", href: `/dashboard` });
    items.push({ type: "link", icon: CheckSquare,     label: "Mes tâches",      href: `/dashboard/tasks` });
    items.push({ type: "link", icon: Bell,            label: "Notifications",   href: `/dashboard/notifications` });
  }

  return items;
}

// ─── SidebarCore ─────────────────────────────────────────────────────────────

interface SidebarCoreProps {
  collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void;
  companyLogo?: string | null; companyName?: string;
  units?: Array<{ id: string; name: string }>; currentUnitId?: string | null;
}

function SidebarCore({ collapsed, setCollapsed, onClose, companyLogo, companyName, units = [] }: SidebarCoreProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const role      = user?.publicMetadata?.role      as string | undefined;
  const companyId = user?.publicMetadata?.companyId as string | undefined;
  const unitId    = user?.publicMetadata?.unitId    as string | undefined;

  const navItems = buildNavItems(role, companyId, unitId);

  const getRoleLabel = (r: string | undefined) =>
    r === "OWNER" ? "Propriétaire" : r === "ADMIN" ? "Admin" : "Collaborateur";

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    const p = name.split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  // Mock team members for facepile visualization
  const teamMembers = [
    { initials: "AM", color: "bg-[#b388ff]" },
    { initials: "KB", color: "bg-[#2979ff]" },
    { initials: "SH", color: "bg-[#00e676]" },
    { initials: "YB", color: "bg-[#ff9100]" },
    { initials: "MK", color: "bg-[#ff3d00]" },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "flex flex-col h-full bg-sidebar transition-all duration-300 relative",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}>

        {/* App header */}
        <div className={cn("flex flex-row items-center h-[60px] shrink-0 px-4 relative", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-2.5 min-w-0">
             <div className="w-8 h-8 bg-primary rounded-md shrink-0 flex items-center justify-center shadow-sm">
                <Building2 className="w-4 h-4 text-primary-foreground" />
             </div>
             {!collapsed && (
               <div className="flex flex-col leading-none min-w-0">
                 <span className="text-base font-bold text-primary truncate">PMA</span>
                 <span className="text-[9px] text-on-surface-variant uppercase tracking-widest mt-0.5">Management</span>
               </div>
             )}
          </div>
          {!collapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => setCollapsed(true)} 
                  className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs bg-surface border-none shadow-modal text-on-surface">
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
                  className="mx-auto mt-1.5 p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors focus:outline-none"
                >
                  <PanelRightClose className="w-4 h-4" />
               </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-surface border-none shadow-modal text-on-surface">
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
              return collapsed
                ? <div key={idx} className="h-[1px] w-5 bg-surface-container my-2 mx-auto rounded-full" />
                : <p key={idx} className="text-[10px] text-on-surface-variant px-4 pt-4 pb-1.5 first:pt-2 font-semibold uppercase tracking-wider">{item.label}</p>;
            }

            if (item.type === "collapsible") {
              return <CollapsibleNavSection key={item.id} id={item.id} label={item.label} icon={item.icon} items={item.items} collapsed={collapsed} pathname={pathname} onClose={onClose} />;
            }

            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            const linkEl = (
              <Link key={item.href} href={item.href} onClick={onClose}
                className={cn("relative flex items-center gap-2.5 mx-2.5 px-2.5 py-2 rounded-md text-xs transition-colors group",
                  collapsed && "justify-center px-0 w-8 h-8 mx-auto",
                  active ? "bg-surface-container-lowest text-primary shadow-card font-semibold" : "text-on-surface-variant font-medium hover:text-on-surface"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5 shrink-0", active ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge !== undefined && <Badge className="ml-auto bg-surface-container text-on-surface-variant text-[10px] h-4 px-1 shadow-none rounded-sm">{item.badge}</Badge>}
              </Link>
            );

            return collapsed
              ? <Tooltip key={item.href}><TooltipTrigger asChild>{linkEl}</TooltipTrigger><TooltipContent side="right" className="text-xs bg-surface text-on-surface border-none shadow-modal flex items-center gap-2">{item.label}{item.badge !== undefined && <Badge className="bg-surface-container text-on-surface-variant text-[10px] h-4 px-1 shadow-none rounded-sm">{item.badge}</Badge>}</TooltipContent></Tooltip>
              : linkEl;
          })}

          {/* Team Facepile Section */}
          {!collapsed && role === "OWNER" && (
            <div className="mt-4 px-4">
              <p className="text-[10px] text-on-surface-variant mb-3 font-semibold uppercase tracking-wider">Équipe</p>
              
              <div className="flex -space-x-1.5 overflow-hidden mb-3">
                {teamMembers.map((member, i) => (
                  <div key={i} className={cn(
                    "inline-block h-6 w-6 rounded-full ring-2 ring-sidebar flex items-center justify-center text-white text-[9px] font-bold",
                    member.color
                  )}>
                    {member.initials}
                  </div>
                ))}
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-sidebar bg-surface-container-high flex items-center justify-center text-on-surface-variant text-[9px] font-bold">
                  +
                </div>
              </div>

              <Link href={`/company/${companyId}/team`} 
                className="flex items-center gap-2 text-xs text-on-surface-variant font-medium hover:text-primary transition-colors group"
                onClick={onClose}
              >
                <UserPlus className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-primary" />
                <span>Inviter</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="shrink-0 pt-2 pb-4 px-3 bg-sidebar border-t border-outline-variant">
          {user && (
            <div className={cn("flex items-center gap-2.5 px-1.5 py-1.5 rounded-md", collapsed && "justify-center")}>
              <Avatar className="w-8 h-8 rounded-md shrink-0 border-none shadow-sm relative">
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback className="rounded-md bg-primary-container text-primary text-xs font-bold">{getInitials(user.firstName)}</AvatarFallback>
                <span className="absolute bottom-[-1px] right-[-1px] w-2.5 h-2.5 bg-green-500 border-2 border-sidebar rounded-full"></span>
              </Avatar>
              {!collapsed && (
                <>
                  <div className="flex flex-col min-w-0 flex-1 leading-none justify-center">
                    <span className="text-xs font-semibold text-on-surface truncate tracking-tight">{user.fullName ?? "Utilisateur"}</span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-wider">{getRoleLabel(role)}</span>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => router.push(`/company/${companyId}/settings`)} className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs bg-surface text-on-surface border-none shadow-modal">Paramètres</TooltipContent>
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
  companyLogo?: string | null; companyName?: string;
  units?: Array<{ id: string; name: string }>; currentUnitId?: string | null;
}

export function Sidebar(props: SidebarProps) {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const [mobileOpen, setMobileOpen] = useAtom(sidebarMobileOpenAtom);
  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;

  return (
    <>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[240px] border-none shadow-modal bg-sidebar">
          <SheetTitle className="sr-only">Menu principal</SheetTitle>
          <SheetDescription className="sr-only">Navigation PMA</SheetDescription>
          <div className="h-full">
            <SidebarCore {...props} collapsed={false} setCollapsed={() => {}} onClose={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden md:block h-screen sticky top-0 shrink-0 z-30">
        <SidebarCore {...props} collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>
    </>
  );
}
