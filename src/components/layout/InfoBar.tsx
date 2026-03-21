"use client";

import { useUser } from "@clerk/nextjs";
import { AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * InfoBar
 * Sticky contextual strip for global alerts (trial expiring, grace period, etc)
 */
export function InfoBar() {
  const { user } = useUser();
  const pathname = usePathname();
  
  // Hide on billing page to avoid redundancy
  if (pathname.includes("/settings/billing")) return null;
  if (!user) return null;

  // Since we rely on Server Actions for exact countdowns, we might pass this data in a provider 
  // or fetch it. For now, we simulate the "publicMetadata" state or rely on Clerk data.
  const isTrial = user.publicMetadata?.subscriptionStatus === "TRIAL";
  const daysRemaining = user.publicMetadata?.trialDaysRemaining as number | undefined;
  const isReadonly = user.publicMetadata?.subscriptionStatus === "READONLY";

  if (!isTrial && !isReadonly) return null;

  const isWarning = isTrial && daysRemaining !== undefined && daysRemaining <= 7;
  const isDanger = isReadonly || (isTrial && daysRemaining !== undefined && daysRemaining <= 3);

  return (
    <div className={cn(
      "w-full py-2 px-4 flex items-center justify-center gap-3 text-sm font-medium transition-colors border-b",
      isReadonly ? "bg-destructive/10 text-destructive border-destructive/20" :
      isWarning || isDanger ? "bg-warning-bg text-warning-text border-warning-border" :
      "bg-primary/5 text-primary border-primary/10"
    )}>
      {isReadonly ? (
        <AlertCircle className="w-4 h-4 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 shrink-0" />
      )}
      
      <span className="flex-1 max-w-content mx-auto text-center flex items-center justify-center gap-2">
        {isReadonly && "Votre compte est en mode lecture seule. Veuillez renouveler votre abonnement."}
        {!isReadonly && isTrial && daysRemaining !== undefined && `Il vous reste ${daysRemaining} jours d'essai gratuit.`}
        {!isReadonly && isTrial && daysRemaining === undefined && "Vous êtes actuellement en période d'essai."}
        
        {user.publicMetadata?.role === "OWNER" && (
          <Link 
            href={`/company/${user.publicMetadata.companyId}/settings/billing`}
            className="inline-flex items-center hover:opacity-80 underline underline-offset-4 ml-2 transition-opacity"
          >
            Mettre à niveau <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        )}
      </span>
    </div>
  );
}
