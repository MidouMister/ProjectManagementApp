"use client";

import { usePathname } from "next/navigation";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { useAtom } from "jotai";
import { sidebarMobileOpenAtom } from "@/store/sidebar";
import React from "react";
import Link from "next/link";

export function Navbar() {
  const pathname = usePathname();
  const [, setMobileOpen] = useAtom(sidebarMobileOpenAtom);

  // Generate breadcrumbs from URL
  const pathParts = pathname.split("/").filter(Boolean);
  
  // Custom simple logic for breadcrumbs matching design
  const breadcrumbs = pathParts.map((part, idx) => {
    // Check if it's an ID (simple heuristic: length > 24 or starts with cm)
    const isId = part.length > 20 || /^[0-9a-f]{8}-/.test(part);
    const label = isId ? part.substring(0, 6) + "..." : part.charAt(0).toUpperCase() + part.slice(1);
    const path = "/" + pathParts.slice(0, idx + 1).join("/");
    const isLast = idx === pathParts.length - 1;

    return { label, path, isLast };
  });

  return (
    <header className="sticky top-0 z-20 w-full h-14 bg-background/80 backdrop-blur-xl border-b border-border flex items-center px-4 justify-between gap-4 transition-all">
      {/* Mobile left side & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden w-8 h-8 rounded-md"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-4 h-4" />
        </Button>

        <nav className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors font-medium">Dashboard</Link>
          {breadcrumbs.length > 0 && <span className="opacity-40">/</span>}
          
          {breadcrumbs.map((crumb) => (
            <React.Fragment key={crumb.path}>
              {crumb.isLast ? (
                <span className="font-semibold text-foreground">{crumb.label}</span>
              ) : (
                <Link href={crumb.path} className="hover:text-foreground transition-colors font-medium">
                  {crumb.label}
                </Link>
              )}
              {!crumb.isLast && <span className="opacity-40">/</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 w-4 h-4 text-muted-foreground opacity-60" />
          <Input 
            type="search" 
            placeholder="Rechercher..." 
            className="w-64 pl-9 h-9 rounded-full bg-muted/40 border-transparent hover:bg-muted focus-visible:bg-background focus-visible:border-border focus-visible:ring-1 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 border-l pl-2 lg:pl-4 ml-1">
          <ThemeToggle />
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}
