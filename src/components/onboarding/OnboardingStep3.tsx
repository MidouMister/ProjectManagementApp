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
import { Plus, X } from "lucide-react"

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter email address"
              className="bg-surface-container-low"
            />
          </div>
          <div className="w-full sm:w-32">
            <Select
              value={role}
              onValueChange={(value) => setRole(value as "ADMIN" | "USER")}
            >
              <SelectTrigger className="bg-surface-container-low">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={handleAddInvitation}
            disabled={!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            className="bg-gradient-to-r from-[#1E3A8A] to-[#00236f] text-white rounded-lg"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {invitations.length > 0 && (
          <div className="space-y-2">
            <label className="text-label text-muted-foreground">
              Pending Invitations
            </label>
            <div className="space-y-2">
              {invitations.map((invitation, index) => (
                <div
                  key={index}
                  className="bg-surface-container-low rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {invitation.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invitation.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveInvitation(index)}
                    className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onSkip}
          className="order-2 sm:order-1"
        >
          Skip
        </Button>
        <Button
          type="button"
          onClick={onFinish}
          className="order-1 sm:order-2 bg-gradient-to-r from-[#1E3A8A] to-[#00236f] text-white rounded-lg"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  )
}
