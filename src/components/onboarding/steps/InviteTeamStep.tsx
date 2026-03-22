"use client";

import { useState } from "react";
import { X, Users, Mail, Plus, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { invitationSchema } from "@/lib/validators";

interface InviteData {
  email: string;
  role: "ADMIN" | "USER";
}

interface InviteTeamStepProps {
  invitations: InviteData[];
  onAdd: (invite: InviteData) => void;
  onRemove: (index: number) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export function InviteTeamStep({
  invitations,
  onAdd,
  onRemove,
  onSubmit,
  onSkip,
  isSubmitting,
}: InviteTeamStepProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const result = invitationSchema.safeParse({ email, role, unitId: "placeholder" });
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Email invalide");
      return;
    }

    if (invitations.some((inv) => inv.email.toLowerCase() === email.toLowerCase())) {
      setError("Cet email a déjà été ajouté");
      return;
    }

    onAdd({ email, role });
    setEmail("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Info */}
      <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#111111] uppercase tracking-tight">Invitez votre équipe</p>
          <p className="text-xs text-[#666666] font-medium leading-relaxed mt-1">
            Ajoutez des collaborateurs pour travailler ensemble. Vous pouvez aussi le faire plus tard via les paramètres.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Ajouter des collaborateurs</label>
        <div className="flex gap-2">
          <div className="relative flex-1 group/field">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within/field:scale-110 group-focus-within/field:text-primary">
              <Mail className="w-5 h-5 text-[#999999] group-focus-within/field:text-primary" />
            </div>
            <Input
              type="email"
              placeholder="email@collaborateur.dz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-12 h-14 bg-white border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#BBBBBB] rounded-2xl shadow-sm"
            />
          </div>
          <Select value={role} onValueChange={(v: any) => setRole(v)}>
            <SelectTrigger className="w-[140px] h-14 bg-white border-[#E8E7E5] focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-bold text-[#111111] rounded-2xl shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#E8E7E5] shadow-2xl">
              <SelectItem value="USER" className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer rounded-lg mx-1 my-0.5 font-medium">Utilisateur</SelectItem>
              <SelectItem value="ADMIN" className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer rounded-lg mx-1 my-0.5 font-medium">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleAdd}
            className="h-14 w-14 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 group"
          >
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </Button>
        </div>
        {error && <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{error}</p>}
      </div>

      {/* Invitations List */}
      <div className="min-h-[180px] space-y-3">
        {invitations.length === 0 ? (
          <div className="h-[180px] flex flex-col items-center justify-center border-2 border-dashed border-[#E8E7E5] rounded-[2.5rem] bg-[#F9F9F8] text-[#999999] transition-all duration-500 hover:border-primary/20 hover:bg-primary/[0.02]">
            <Users className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-60">Aucune invitation</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {invitations.map((invite, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border border-[#E8E7E5] rounded-2xl shadow-sm animate-in fade-in slide-in-from-right-2 duration-300 group/item hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover/item:scale-110 transition-transform">
                    {invite.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111]">{invite.email}</p>
                    <p className="text-[10px] font-black text-[#999999] uppercase tracking-widest">
                      {invite.role === "ADMIN" ? "Administrateur" : "Utilisateur"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(index)}
                  className="h-9 w-9 text-[#999999] hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-[#E8E7E5]">
        <Button
          onClick={onSkip}
          variant="outline"
          disabled={isSubmitting}
          className="h-14 px-8 border-[#E8E7E5] text-[#666666] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#F3F2F1] hover:text-[#111111] transition-all duration-300"
        >
          Sauter
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 h-14 bg-[#111111] hover:bg-[#222222] text-white font-bold uppercase tracking-widest rounded-2xl transition-all duration-500 shadow-xl shadow-black/10 hover:shadow-primary/20 group"
        >
          {isSubmitting ? (
            "Initialisation..."
          ) : (
            <>
              {invitations.length === 0 ? "Terminer" : `Inviter & Terminer (${invitations.length})`}
              {invitations.length === 0 ? (
                <Rocket className="ml-2 w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
