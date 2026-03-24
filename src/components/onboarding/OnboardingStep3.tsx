"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, X, UserPlus, Shield, User, ArrowRight, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Invitation {
  email: string
  role: "ADMIN" | "USER"
}

interface OnboardingStep3Props {
  initialInvitations?: Invitation[]
  onUpdate: (invitations: Invitation[]) => void
  onSkip: () => void
  onFinish: () => void
}

export function OnboardingStep3({
  initialInvitations = [],
  onUpdate,
  onSkip,
  onFinish,
}: OnboardingStep3Props) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"ADMIN" | "USER">("USER")
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations)

  const handleAddInvitation = () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const isDuplicate = invitations.some(inv => inv.email === email)
      if (isDuplicate) return

      const newInvitations = [...invitations, { email, role }]
      setInvitations(newInvitations)
      onUpdate(newInvitations)
      setEmail("")
      setRole("USER")
    }
  }

  const handleRemoveInvitation = (index: number) => {
    const newInvitations = invitations.filter((_, i) => i !== index)
    setInvitations(newInvitations)
    onUpdate(newInvitations)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddInvitation()
    }
  }

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="space-y-6">
        <label className="text-label text-muted-foreground/60 block mb-2 px-1">Inviter vos collaborateurs</label>
        
        <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-10 border border-muted-foreground/5 shadow-inner">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-[2.5] space-y-2 w-full">
              <label htmlFor="email" className="text-label text-muted-foreground/80 font-bold ml-1">
                Adresse email professionnelle
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: collab@entreprise.dz"
                className="bg-white dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all placeholder:font-medium"
              />
            </div>
            
            <div className="flex-1 space-y-2 w-full">
              <label htmlFor="role" className="text-label text-muted-foreground/80 font-bold ml-1">
                Rôle attribué
              </label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "ADMIN" | "USER")}
              >
                <SelectTrigger id="role" className="bg-white dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-primary/20 dark:focus:bg-slate-800 transition-all">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 shadow-2xl border border-muted-foreground/10 dark:border-white/5 rounded-2xl p-1 z-60">
                  <SelectItem value="ADMIN" className="text-sm font-bold rounded-xl m-1 px-4 py-3 cursor-pointer focus:bg-primary focus:text-white dark:focus:bg-primary dark:focus:text-white transition-colors">Administrateur</SelectItem>
                  <SelectItem value="USER" className="text-sm font-bold rounded-xl m-1 px-4 py-3 cursor-pointer focus:bg-primary focus:text-white dark:focus:bg-primary dark:focus:text-white transition-colors">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              onClick={handleAddInvitation}
              disabled={!email || !isValidEmail(email)}
              className={cn(
                "h-14 px-10 rounded-btn text-xs font-black transition-all w-full md:w-auto shadow-xl hover:scale-[1.02] active:scale-95",
                "bg-black text-white hover:bg-black/90 disabled:opacity-30"
              )}
            >
              <Plus className="w-5 h-5 mr-3" />
              Ajouter
            </Button>
          </div>
        </div>

        {invitations.length > 0 && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                <p className="text-label text-muted-foreground font-bold tracking-tight">
                  Invitations en attente
                </p>
              </div>
              <span className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-full shadow-lg shadow-primary/20">
                {invitations.length} {invitations.length > 1 ? 'MEMBRES' : 'MEMBRE'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-4 max-h-[380px] overflow-y-auto pr-3 custom-scrollbar">
              {invitations.map((inv, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-muted-foreground/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all animate-in zoom-in-95 duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center dark:bg-primary/20">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-black tracking-tight">{inv.email}</p>
                      <div className="flex items-center gap-2">
                        {inv.role === "ADMIN" ? (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-md">
                            <Shield className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Administrateur</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md">
                            <User className="w-3 h-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Utilisateur</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInvitation(index)}
                    className="opacity-0 group-hover:opacity-100 h-10 w-10 text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {invitations.length === 0 && (
          <div className="bg-slate-50/50 dark:bg-slate-900/20 border-2 border-dashed border-muted-foreground/10 rounded-[2.5rem] py-20 px-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="h-24 w-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-8 shadow-2xl">
              <UserPlus className="w-10 h-10 text-primary/20" />
            </div>
            <p className="text-base font-black text-on-surface tracking-tight">Aucun collaborateur invité</p>
            <p className="text-sm font-medium text-muted-foreground/50 max-w-[320px] mt-3 leading-relaxed">
              Il est préférable de commencer l&apos;aventure en équipe ! Vous pourrez ajouter des membres ultérieurement.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 sticky bottom-0 bg-linear-to-t from-[#ECEAE8] dark:from-[#0F1115] via-[#ECEAE8]/90 dark:via-[#0F1115]/90 to-transparent pb-6 z-40">
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-all px-10 h-12 rounded-full hover:bg-primary/5 border border-transparent hover:border-primary/10"
        >
          Ignorer cette étape
        </Button>
        <Button
          type="button"
          onClick={onFinish}
          className={cn(
            "h-16 px-14 rounded-btn text-sm font-black text-white transition-all shadow-2xl shadow-primary/25",
            "bg-primary hover:bg-primary/95 hover:scale-[1.02] active:scale-95 group"
          )}
        >
          <span className="flex items-center gap-3">
            Finaliser le profil
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </span>
        </Button>
      </div>
    </div>
  )
}
