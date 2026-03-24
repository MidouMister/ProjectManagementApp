"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS = ["Entreprise", "Unité", "Équipe"]

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-between w-full max-w-sm mx-auto relative px-2 mb-8">
      {/* Background Line */}
      <div className="absolute top-[18px] left-0 right-0 h-[2.5px] bg-slate-200 dark:bg-slate-800 rounded-full -z-10" />
      
      {/* Active Progress Line */}
      <div 
        className="absolute top-[18px] left-0 h-[2.5px] bg-primary transition-all duration-1000 ease-in-out -z-10 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />

      {steps.map((step, index) => {
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep
        const isPending = step > currentStep

        return (
          <div key={step} className="flex flex-col items-center gap-4 relative group">
            <div
              className={cn(
                "w-9 h-9 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-700 ease-out shadow-sm",
                isCompleted && "bg-primary text-white scale-90 ring-4 ring-primary/5",
                isCurrent && "bg-white dark:bg-slate-900 text-primary ring-[6px] ring-primary/15 scale-110 shadow-2xl border border-primary/20",
                isPending && "bg-slate-200 dark:bg-slate-800 text-muted-foreground/40 dark:text-muted-foreground/60"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" strokeWidth={4} />
              ) : (
                step
              )}
            </div>
            
            <span className={cn(
              "text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-700",
              isCurrent ? "text-primary opacity-100 translate-y-0" : "text-muted-foreground/40 dark:text-muted-foreground/20 opacity-60 translate-y-1"
            )}>
              {STEP_LABELS[index]}
            </span>

            {/* Pulsing effect for current step */}
            {isCurrent && (
              <div className="absolute top-0 left-0 w-9 h-9 rounded-2xl bg-primary/20 animate-ping -z-20 scale-125 opacity-40" />
            )}
          </div>
        )
      })}
    </div>
  )
}
