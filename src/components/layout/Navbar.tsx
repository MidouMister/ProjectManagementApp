"use client";

import { usePathname } from "next/navigation";
import { Search, Menu, ChevronRight, User, Settings, LogOut, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const getBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const parts = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  const labelMap: Record<string, string> = {
    dashboard: "Tableau de bord",
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
    const label = isId ? part.substring(0, 6).toUpperCase() : labelMap[part.toLowerCase()] || part;
    const path = "/" + parts.slice(0, idx + 1).join("/");
    
    breadcrumbs.push({ label, href: path });
  });

  return breadcrumbs;
};

export function Navbar() {
  const pathname = usePathname();
  const [, setMobileOpen] = useAtom(sidebarMobileOpenAtom);
  const { user } = useUser();
  const { signOut } = useClerk();

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-20 w-full h-20 bg-white/70 dark:bg-surface-container-highest/70 backdrop-blur-xl flex items-center px-6 md:px-10 justify-between gap-6 transition-all">
      {/* Left side: Mobile menu & Architectural Breadcrumbs */}
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden w-10 h-10 rounded-xl bg-surface-container/50 hover:bg-surface-container transition-all"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-5 h-5 text-foreground" />
        </Button>

        {/* Breadcrumbs with Premium Aesthetic */}
        <nav className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 dark:bg-primary/10 transition-colors">
            <Layout className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-widest text-primary">AGORA</span>
          </div>
          
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30" />
          
          <div className="flex items-center gap-2">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href || idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/20" />}
                {crumb.href && idx < breadcrumbs.length - 1 ? (
                  <Link 
                    href={crumb.href} 
                    className="text-xs font-bold text-muted-foreground/60 hover:text-primary transition-all hover:scale-105 active:scale-95"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs font-extrabold text-foreground tracking-tight underline decoration-primary/20 decoration-2 underline-offset-4">
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </nav>
      </div>

      {/* Right actions with Floating Surfaces */}
      <div className="flex items-center gap-4">
        {/* Modern Search */}
        <div className="relative hidden lg:flex items-center group">
          <Search className="absolute left-4 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <Input 
            type="search" 
            placeholder="Rechercher partout..." 
            className={cn(
               "w-72 bg-surface-container-low/50 border-none h-11 pl-11 pr-4 rounded-xl text-xs font-medium transition-all duration-300",
               "focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white focus-visible:w-80 shadow-sm"
            )}
          />
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface-container-low/50">
          <div className="flex items-center gap-1 pr-1">
            <ThemeToggle />
            <NotificationBell />
          </div>

          <div className="w-px h-6 bg-outline-variant/30 mx-1" />

          {/* Premium User Trigger */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-white dark:hover:bg-surface-container-highest transition-all group active:scale-95 border border-transparent hover:border-outline-variant shadow-none hover:shadow-sm">
                  <Avatar className="w-8 h-8 rounded-lg border-2 border-primary/10 group-hover:border-primary transition-colors">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback className="rounded-lg text-[10px] font-black bg-primary text-on-primary">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start leading-none pr-1">
                    <span className="text-[11px] font-black text-foreground truncate max-w-[100px]">
                      {user.fullName || "Utilisateur"}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-tighter mt-0.5">
                      Compte Pro
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-none shadow-2xl glass mt-2">
                <DropdownMenuLabel className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 rounded-xl border-2 border-primary/20">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="rounded-xl font-black bg-primary text-on-primary">
                        {user.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-black leading-tight">{user.fullName}</span>
                      <span className="text-[10px] font-medium text-muted-foreground truncate max-w-[140px]">
                        {user.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-outline-variant/30 my-2 mx-2" />
                <DropdownMenuItem asChild className="rounded-xl px-4 py-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-all">
                  <Link href="/dashboard/profile" className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-bold">Mon Profil Personnel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-4 py-3 cursor-pointer focus:bg-primary/5 focus:text-primary transition-all">
                  <Link href="/dashboard/settings" className="flex items-center gap-3">
                    <Settings className="w-4 h-4" />
                    <span className="text-xs font-bold">Paramètres Système</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-outline-variant/30 my-2 mx-2" />
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="rounded-xl px-4 py-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive transition-all"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    <span className="text-xs font-bold">Déconnexion de l&apos;application</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
