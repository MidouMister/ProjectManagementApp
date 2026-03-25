"use client";

import { useUser } from "@clerk/nextjs";
import { AlertTriangle, X, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SubscriptionStatus = "TRIAL" | "ACTIVE" | "GRACE" | "READONLY" | "SUSPENDED";

/**
 * InfoBar — subscription alert strip.
 * Shown only when action is needed (trial ending, readonly, grace period).
 * Hidden on billing page and when subscription is healthy.
 */
export function InfoBar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (pathname.includes("/settings/billing")) return null;
  if (!user) return null;

  const status = user.publicMetadata?.subscriptionStatus as SubscriptionStatus | undefined;
  const daysRemaining = user.publicMetadata?.trialDaysRemaining as number | undefined;
  const companyId = user.publicMetadata?.companyId as string | undefined;
  const role = user.publicMetadata?.role as string | undefined;

  // Only show when action is needed
  const isReadonly = status === "READONLY" || status === "SUSPENDED";
  const isGrace = status === "GRACE";
  const isTrial = status === "TRIAL";
  const isUrgent = isTrial && daysRemaining !== undefined && daysRemaining <= 7;

  if (!isReadonly && !isGrace && !isUrgent) return null;

  const isDanger = isReadonly || isGrace;
  const billingHref = companyId ? `/company/${companyId}/settings/billing` : "#";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center gap-3 px-6 py-2.5 text-[13px] font-medium border-b",
        isDanger
          ? "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/20"
          : "bg-amber-50 text-amber-800 border-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900"
      )}
    >
      {isDanger ? (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <Clock className="w-3.5 h-3.5 shrink-0" />
      )}

      <span>
        {isReadonly &&
          "Votre compte est en lecture seule. Toute modification est bloquée."}
        {isGrace &&
          "Période de grâce active. Mettez à jour votre abonnement pour continuer."}
        {isTrial &&
          daysRemaining !== undefined &&
          `Il vous reste ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} d'essai gratuit.`}
      </span>

      {role === "OWNER" && (
        <Link
          href={billingHref}
          className={cn(
            "inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity",
          )}
        >
          Gérer l&apos;abonnement
          <ChevronRight className="w-3 h-3" />
        </Link>
      )}

      {/* Dismiss — only for non-critical alerts */}
      {!isDanger && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
