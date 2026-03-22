"use client"

import { useState } from "react"
import { OnboardingStep1 } from "@/components/onboarding/OnboardingStep1"
import { OnboardingStep2 } from "@/components/onboarding/OnboardingStep2"
import { OnboardingStep3 } from "@/components/onboarding/OnboardingStep3"
import { StepIndicator } from "@/components/onboarding/StepIndicator"

const steps = [
  { title: "Company Profile", subtitle: "Set up your organization details" },
  { title: "Create First Unit", subtitle: "Set up your first operational unit" },
  { title: "Invite Team", subtitle: "Add colleagues to your workspace" },
]

interface Invitation {
  email: string
  role: "ADMIN" | "USER"
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    company: {} as Record<string, unknown>,
    unit: {} as Record<string, unknown>,
    invitations: [] as Invitation[],
  })

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleCompanySubmit = (data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, company: data }))
    handleNext()
  }

  const handleUnitSubmit = (data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, unit: data }))
    handleNext()
  }

  const handleInvitationsUpdate = (invitations: Invitation[]) => {
    setFormData((prev) => ({ ...prev, invitations }))
  }

  const handleSkip = () => {
    console.log("Onboarding completed with formData:", formData)
    window.location.href = "/dashboard"
  }

  const handleFinish = () => {
    console.log("Onboarding completed with formData:", formData)
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
          P
        </div>
        <span className="text-lg font-semibold">ProjectFlow</span>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-medium text-muted-foreground">
              Step {currentStep} of 3
            </span>
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={3} />

          <div className="mt-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-foreground">
                {steps[currentStep - 1].title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {steps[currentStep - 1].subtitle}
              </p>
            </div>

            <div className="bg-card rounded-xl shadow-card p-6 sm:p-8">
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
