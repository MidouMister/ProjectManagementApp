"use client"

import { useState } from "react"
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1"
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2"
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3"
import { StepIndicator } from "@/components/onboarding/StepIndicator"
import { consolidateOnboarding } from "@/lib/queries"
import { toast } from "sonner"
import { type CompanyInput, type UnitInput } from "@/lib/types"
import { useAuth } from "@clerk/nextjs"

const steps = [
  { title: "Profil de l'entreprise", subtitle: "Configurez les détails de votre organisation" },
  { title: "Créer la première unité", subtitle: "Configurez votre première unité opérationnelle" },
  { title: "Inviter l'équipe", subtitle: "Ajoutez des collègues à votre espace de travail" },
]

export default function OnboardingPage() {
  const { userId } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    company: {} as CompanyInput,
    unit: {} as UnitInput,
    invitations: [] as Array<{ email: string; role: "ADMIN" | "USER" }>,
  })

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleCompanySubmit = (data: CompanyInput) => {
    setFormData((prev) => ({ ...prev, company: data }))
    handleNext()
  }

  const handleUnitSubmit = (data: UnitInput) => {
    setFormData((prev) => ({ ...prev, unit: data }))
    handleNext()
  }

  const handleInvitationsUpdate = (invitations: Array<{ email: string; role: "ADMIN" | "USER" }>) => {
    setFormData((prev) => ({ ...prev, invitations }))
  }

  const submitOnboarding = async (invitations: Array<{ email: string; role: "ADMIN" | "USER" }>) => {
    if (!userId) {
      toast.error("Utilisateur non authentifié.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await consolidateOnboarding(userId, {
        company: formData.company,
        unit: formData.unit,
        invitations: invitations as any, // Simple cast to skip deep enum comparison in this client component
      })

      if (response.success) {
        toast.success("Configuration terminée avec succès !")
        window.location.href = `/company/${response.data.companyId}`
      } else {
        toast.error(`Erreur: ${response.error}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Une erreur inattendue est survenue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    await submitOnboarding([])
  }

  const handleFinish = async () => {
    await submitOnboarding(formData.invitations)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          PMP
        </div>
        <span className="text-lg font-semibold">Application de Gestion de Projets</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-medium text-muted-foreground">
              Étape {currentStep} sur {steps.length}
            </span>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

          <div className="mt-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-foreground">
                {steps[currentStep - 1].title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {steps[currentStep - 1].subtitle}
              </p>
            </div>

            <div className="bg-card rounded-xl shadow-card p-6 sm:p-8 relative">
              {isSubmitting && (
                <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              )}
              {currentStep === 1 && (
                <OnboardingStep1
                  defaultValues={formData.company}
                  onSubmit={handleCompanySubmit}
                />
              )}
              {currentStep === 2 && (
                <OnboardingStep2
                  defaultValues={formData.unit}
                  onSubmit={handleUnitSubmit}
                />
              )}
              {currentStep === 3 && (
                <OnboardingStep3
                  initialInvitations={formData.invitations}
                  onUpdate={handleInvitationsUpdate}
                  onSkip={handleSkip}
                  onFinish={handleFinish}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
