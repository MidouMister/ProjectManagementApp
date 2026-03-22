"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep

        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-surface-container-low text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step
                )}
              </div>
            </div>
            
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-12 sm:w-20 h-0.5 mx-2 transition-all duration-300",
                  step < currentStep ? "bg-primary" : "bg-surface-container-low"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
