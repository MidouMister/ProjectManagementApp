"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { acceptInvitation, getInvitationByToken } from "@/lib/queries";

interface InvitationData {
  id: string;
  role: string;
  company: { id: string; name: string };
  unit: { id: string; name: string };
}

/**
 * InvitationProcessor
 * Handles the logic of accepting an invitation after a user signs up.
 */
export function InvitationProcessor() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);

  useEffect(() => {
    if (!token || !isLoaded || !user) return;

    const checkInvitation = async () => {
      const data = await getInvitationByToken(token);
      if (data) {
        setInvitationData(data as unknown as InvitationData);
      } else {
        toast.error("Invitation invalide ou expirée");
      }
    };

    checkInvitation();
  }, [token, isLoaded, user]);

  const handleAccept = async () => {
    if (!token || !user) return;

    setIsProcessing(true);
    const result = await acceptInvitation(user.id, token);

    if (result.success) {
      toast.success(`Bienvenue chez ${invitationData?.company?.name} !`);
      router.push("/dashboard");
    } else {
      toast.error("Erreur lors de l'acceptation de l'invitation");
      setIsProcessing(false);
    }
  };

  if (!token || !invitationData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border shadow-2xl rounded-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
          !
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Invitation en attente</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Vous avez été invité à rejoindre <span className="text-foreground font-semibold">{invitationData.company.name}</span> ({invitationData.unit.name}) en tant que <span className="text-foreground font-semibold">{invitationData.role}</span>.
        </p>
        
        <button
          onClick={handleAccept}
          disabled={isProcessing}
          className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? "Traitement..." : "Accepter l'invitation"}
        </button>
        
        <button
          onClick={() => router.push("/dashboard")}
          disabled={isProcessing}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Accéder à mon espace
        </button>
      </div>
    </div>
  );
}
