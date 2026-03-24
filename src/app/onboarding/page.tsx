"use client"

import { useState } from "react"
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1"
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2"
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3"
import { StepIndicator } from "@/components/onboarding/StepIndicator"
import { consolidateOnboarding } from "@/lib/queries"
import { toast } from "sonner"
import { type CompanyInput, type UnitInput, type Role } from "@/lib/types"
import { useAuth } from "@clerk/nextjs"

const steps = [
  { title: "Profil de l'entreprise", subtitle: "Configurez l'identité de votre organisation" },
  { title: "Unité Opérationnelle", subtitle: "Votre premier centre de profit" },
  { title: "Collaborateurs", subtitle: "Invitez votre équipe à bord" },
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        invitations: invitations as Array<{ email: string; role: Role }>,
      })

      if (response.success) {
        toast.success("Votre espace de travail est prêt !")
        window.location.href = `/dashboard`
      } else {
        toast.error(`Erreur de configuration: ${response.error}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Une erreur inattendue est survenue lors de la finalisation.")
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
    <div className="min-h-screen bg-[#ECEAE8] dark:bg-[#0F1115] flex flex-col font-sans selection:bg-primary/10 transition-colors duration-500">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-[#0F1115]/80 backdrop-blur-xl border-b border-muted-foreground/5 dark:border-white/5 z-50 flex items-center px-8 justify-center sm:justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/25">
            M
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-black tracking-tighter uppercase dark:text-white">MidouMister</h2>
            <p className="text-[10px] font-bold text-muted-foreground/60 -mt-1 uppercase tracking-widest">Platform</p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-4">
          <span className="text-[10px] font-black uppercase text-muted-foreground/40 dark:text-muted-foreground/60 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border border-black/5 dark:border-white/5">
            Onboarding 2.0
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-28 pb-20 px-4">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <div className="mb-14">
            <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
          </div>

          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-black text-on-surface dark:text-white tracking-tight">
                {steps[currentStep - 1].title}
              </h1>
              <p className="text-muted-foreground dark:text-muted-foreground/60 font-medium max-w-sm mx-auto leading-relaxed">
                {steps[currentStep - 1].subtitle}
              </p>
            </div>

            <div className="bg-white dark:bg-[#16191E] rounded-[2.5rem] shadow-2xl p-8 sm:p-14 relative overflow-hidden border border-muted-foreground/5 dark:border-white/5 lg:-mx-16">
              {/* Progress Bar Background */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 dark:bg-slate-800/50">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>

              {isSubmitting && (
                <div className="absolute inset-0 z-50 bg-white/70 dark:bg-[#0F1115]/70 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <div className="relative h-20 w-20 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Configuration en cours...</p>
                </div>
              )}
              
              <div className="min-h-[450px]">
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
            
            <p className="text-center text-[10px] font-black text-muted-foreground/30 dark:text-muted-foreground/50 uppercase tracking-[0.25em] pt-8">
              © 2026 MidouMister · Algérie Central
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
