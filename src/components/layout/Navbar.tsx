"use client";

import { usePathname } from "next/navigation";
import { Search, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { useAtom } from "jotai";
import { sidebarMobileOpenAtom } from "@/store/sidebar";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    unite: "Unités",
    company: "Entreprise",
    projects: "Projets",
    kanban: "Kanban",
    clients: "Clients",
    members: "Membres",
    settings: "Paramètres",
    tasks: "Tâches",
    inbox: "Boîte de réception",
    reporting: "Reporting",
    portfolio: "Portfolio",
    accounts: "Comptes",
    goals: "Objectifs",
  };

  parts.forEach((part, idx) => {
    const isId = part.length > 20 || /^[0-9a-f]{8}-/.test(part);
    const label = isId ? part.substring(0, 6) + "..." : labelMap[part.toLowerCase()] || part;
    const path = "/" + parts.slice(0, idx + 1).join("/");
    
    breadcrumbs.push({ label, href: path });
  });

  return breadcrumbs;
};

export function Navbar() {
  const pathname = usePathname();
  const [, setMobileOpen] = useAtom(sidebarMobileOpenAtom);
  const { user } = useUser();

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 w-full h-14 bg-background/80 backdrop-blur-md border-b border-outline-variant flex items-center px-4 md:px-6 justify-between gap-4 transition-all">
      {/* Left side: Mobile menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden w-9 h-9 rounded-lg"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            PMA
          </Link>
          
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href || idx}>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
              {crumb.href && idx < breadcrumbs.length - 1 ? (
                <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground/60" />
          <Input 
            type="search" 
            placeholder="Rechercher..." 
            className="w-56 pl-9 h-9 rounded-lg bg-surface-container-low border-transparent hover:border-outline focus-visible:border-primary focus-visible:ring-0 transition-all text-sm"
          />
        </div>

        {/* Divider */}
        <div className="h-6 w-[1px] bg-outline-variant mx-1 hidden md:block" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />

          {/* User Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2 gap-2 rounded-lg hover:bg-surface-container-high/50">
                  <Avatar className="w-7 h-7 rounded-lg border border-outline-variant">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="rounded-lg text-xs font-bold bg-primary-container text-primary-foreground">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-foreground">
                    {user.fullName || user.emailAddresses[0]?.emailAddress?.split("@")[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.fullName || "User"}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {user.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
