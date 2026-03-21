"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUnreadCount } from "@/lib/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Ignore errors silently on background poll
    }
  };

  useEffect(() => {
    // Initial fetch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCount();

    // Poll every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative w-9 h-9 rounded-full hover:bg-muted group">
          <Bell className="w-[1.15rem] h-[1.15rem] text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1.5 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-background animate-in zoom-in-50" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
        <DropdownMenuLabel className="font-semibold flex justify-between items-center py-2">
          Notifications
          {unreadCount > 0 && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {unreadCount} nouv.
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1 p-4 text-center items-center justify-center text-sm text-muted-foreground min-h-[140px]">
          <Bell className="w-8 h-8 opacity-20 mb-2" />
          <p>Aucune notification</p>
          <p className="text-xs">Vous êtes à jour !</p>
        </div>
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem className="w-full text-center flex justify-center text-xs font-semibold cursor-pointer">
            Voir tout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
