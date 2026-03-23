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
import { Plus, X, UserPlus, Shield, User } from "lucide-react"
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
    <div className="space-y-8">
      <div className="space-y-6">
        <label className="text-label text-muted-foreground block">Inviter vos collaborateurs</label>
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-2 space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: collab@entreprise.dz"
                className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
              />
            </div>
            
            <div className="flex-1 space-y-1.5">
              <label htmlFor="role" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Rôle
              </label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "ADMIN" | "USER")}
              >
                <SelectTrigger id="role" className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:bg-white transition-all">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent className="border-none shadow-xl rounded-xl">
                  <SelectItem value="ADMIN" className="text-sm font-medium rounded-lg m-1">Administrateur</SelectItem>
                  <SelectItem value="USER" className="text-sm font-medium rounded-lg m-1">Collaborateur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end pb-0.5">
              <Button
                type="button"
                onClick={handleAddInvitation}
                disabled={!email || !isValidEmail(email)}
                className={cn(
                  "h-11 px-6 rounded-lg text-xs font-bold transition-all w-full md:w-auto",
                  "bg-black text-white hover:bg-black/90 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                )}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        {invitations.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Liste des invitations ({invitations.length})
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {invitations.map((invitation, index) => (
                <div
                  key={index}
                  className="bg-surface-container-low group rounded-xl p-4 flex items-center justify-between transition-all hover:bg-surface-container-low/80 animate-in fade-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      {invitation.role === 'ADMIN' ? (
                        <Shield className="w-5 h-5 text-primary" />
                      ) : (
                        <User className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {invitation.email}
                      </p>
                      <p className="text-[10px] font-extrabold tracking-widest uppercase text-muted-foreground">
                        {invitation.role === 'ADMIN' ? 'Administrateur' : 'Collaborateur'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveInvitation(index)}
                    className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {invitations.length === 0 && (
          <div className="bg-surface-container-low/30 border-dashed border-2 border-muted-foreground/10 rounded-2xl py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Aucune invitation ajoutée</p>
            <p className="text-xs text-muted-foreground/60 max-w-[200px] mt-1">
              Vous pourrez inviter votre équipe plus tard depuis le dashboard.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-10">
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          className="text-xs font-bold text-muted-foreground hover:bg-surface-container-low transition-all"
        >
          Passer pour l&apos;instant
        </Button>
        <Button
          type="button"
          onClick={onFinish}
          className={cn(
            "h-12 px-10 rounded-lg text-sm font-bold text-white transition-all shadow-lg shadow-primary/20",
            "bg-linear-to-b from-primary-container to-primary hover:scale-[1.02] active:scale-95",
            invitations.length === 0 ? "opacity-50" : ""
          )}
        >
          Terminer la configuration
        </Button>
      </div>
    </div>
  )
}
