"use client";

import { usePathname } from "next/navigation";
import { Search, Menu, ChevronRight, User, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { useAtom } from "jotai";
import { sidebarMobileOpenAtom } from "@/store/sidebar";
import React from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  unite: "Unité",
  company: "Entreprise",
  projects: "Projets",
  kanban: "Kanban",
  clients: "Clients",
  members: "Membres",
  settings: "Paramètres",
  billing: "Facturation",
  units: "Unités",
  team: "Équipe",
  notifications: "Notifications",
  onboarding: "Configuration",
};

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((part, idx) => {
    const isId = part.length > 20 || /^[0-9a-f-]{20,}$/.test(part) || /^c[a-z0-9]{20,}$/.test(part);
    const label = isId
      ? "···"
      : ROUTE_LABELS[part.toLowerCase()] ?? part.charAt(0).toUpperCase() + part.slice(1);
    const href = "/" + parts.slice(0, idx + 1).join("/");
    return { label, href };
  });
}

function getRoleLabel(role: string | undefined): string {
  switch (role) {
    case "OWNER": return "Propriétaire";
    case "ADMIN": return "Administrateur";
    case "USER": return "Collaborateur";
    default: return "Utilisateur";
  }
}

export function Navbar() {
  const pathname = usePathname();
  const [, setMobileOpen] = useAtom(sidebarMobileOpenAtom);
  const { user } = useUser();
  const { signOut } = useClerk();

  const breadcrumbs = getBreadcrumbs(pathname).filter((b) => b.label !== "···");
  const role = user?.publicMetadata?.role as string | undefined;
  const companyId = user?.publicMetadata?.companyId as string | undefined;

  return (
    <header className="sticky top-0 z-20 h-[60px] bg-background/90 backdrop-blur-sm border-b border-border flex items-center px-6 justify-between gap-4 shrink-0">

      {/* Left — mobile menu + breadcrumbs */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors shrink-0"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-4 h-4 text-on-surface-variant" />
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 min-w-0 overflow-hidden">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href || idx}>
              {idx > 0 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
              )}
              {idx < breadcrumbs.length - 1 ? (
                <Link
                  href={crumb.href ?? "#"}
                  className="text-[13px] text-on-surface-variant hover:text-on-surface transition-colors truncate max-w-[120px]"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[13px] font-semibold text-on-surface truncate max-w-[200px]">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right — search + tools + user */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden lg:flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Rechercher..."
            className={cn(
              "w-56 h-8 pl-9 pr-3 text-[13px] bg-surface border border-border rounded-lg",
              "placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary",
              "transition-all focus-visible:w-72 shadow-none text-on-surface"
            )}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border" />

        {/* Theme + Notifications */}
        <ThemeToggle />
        <NotificationBell />

        {/* Divider */}
        <div className="w-px h-5 bg-border" />

        {/* User menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors group">
                <Avatar className="w-7 h-7 rounded-lg shrink-0">
                  <AvatarImage src={user.imageUrl} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-[10px] font-bold">
                    {user.firstName?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span className="text-[12px] font-semibold text-on-surface truncate max-w-[100px]">
                    {user.fullName ?? "Utilisateur"}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {getRoleLabel(role)}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-60 p-1.5 rounded-xl border border-border bg-popover shadow-modal"
            >
              {/* User info header */}
              <DropdownMenuLabel className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 rounded-xl shrink-0">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-bold">
                      {user.firstName?.charAt(0) ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-semibold text-on-surface truncate">
                      {user.fullName}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {user.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-border my-1" />

              <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer text-[13px] focus:bg-surface-container">
                <Link href="/dashboard/profile" className="flex items-center gap-2.5 text-on-surface">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  Mon profil
                </Link>
              </DropdownMenuItem>

              {companyId && (
                <DropdownMenuItem asChild className="rounded-lg px-3 py-2.5 cursor-pointer text-[13px] focus:bg-surface-container">
                  <Link href={`/company/${companyId}/settings`} className="flex items-center gap-2.5 text-on-surface">
                    <Settings className="w-4 h-4 text-on-surface-variant" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-border my-1" />

              <DropdownMenuItem
                onClick={() => signOut()}
                className="rounded-lg px-3 py-2.5 cursor-pointer text-[13px] text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
