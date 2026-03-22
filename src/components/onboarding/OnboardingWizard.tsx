"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Building2, Briefcase, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { companySchema, unitSchema } from "@/lib/validators";
import { type CompanyInput, type UnitInput } from "@/lib/types";
import { createCompany, inviteMember, getCompanyUnit } from "@/lib/queries";
import { CompanyProfileStep } from "./steps/CompanyProfileStep";
import { FirstUnitStep } from "./steps/FirstUnitStep";
import { InviteTeamStep } from "./steps/InviteTeamStep";

interface InviteData {
  email: string;
  role: "ADMIN" | "USER";
}

interface OnboardingWizardProps {
  userId: string;
}

const STEPS = [
  { id: 1, title: "Entreprise", icon: Building2, description: "Informations de votre société" },
  { id: 2, title: "Unité", icon: Briefcase, description: "Créez votre première unité" },
  { id: 3, title: "Équipe", icon: Users, description: "Invitez vos collaborateurs" },
];

export function OnboardingWizard({ userId }: OnboardingWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [companyData, setCompanyData] = useState<Partial<CompanyInput>>({});
  const [unitData, setUnitData] = useState<Partial<UnitInput>>({});
  const [invitations, setInvitations] = useState<InviteData[]>([]);

  const companyForm = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: companyData,
  });

  const unitForm = useForm<UnitInput>({
    resolver: zodResolver(unitSchema),
    defaultValues: unitData,
  });

  const handleCompanyNext = (data: CompanyInput) => {
    setCompanyData(data);
    setCompletedSteps((prev) => [...prev, 1]);
    setCurrentStep(2);
  };

  const handleUnitNext = (data: UnitInput) => {
    setUnitData(data);
    setCompletedSteps((prev) => [...prev, 2]);
    setCurrentStep(3);
  };

  const handleAddInvitation = (invite: InviteData) => {
    setInvitations((prev) => [...prev, invite]);
  };

  const handleRemoveInvitation = (index: number) => {
    setInvitations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!userId) {
        toast.error("Session expirée");
        return;
      }

      const result = await createCompany(userId, {
        name: companyData.name!,
        logo: companyData.logo,
        formJur: companyData.formJur!,
        sector: companyData.sector!,
        NIF: companyData.NIF!,
        RC: companyData.RC!,
        NIS: companyData.NIS,
        AI: companyData.AI,
        wilaya: companyData.wilaya!,
        address: companyData.address!,
        phone: companyData.phone!,
        email: companyData.email!,
      });

      if (!result.success) {
        toast.error("Erreur lors de la création de l'entreprise");
        setIsSubmitting(false);
        return;
      }

      const companyId = result.data.id;

      for (const invite of invitations) {
        const unit = await getCompanyUnit(companyId);
        if (unit) {
          await inviteMember(invite.email, invite.role, unit.id, companyId);
        }
      }

      toast.success("Compte créé avec succès!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full py-10">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 mb-6 group transition-all duration-500 hover:scale-110 shadow-sm">
            <Building2 className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#111111] mb-2 uppercase drop-shadow-sm">
            Configuration du compte
          </h1>
          <p className="text-[#666666] font-medium text-lg">
            Configurez votre espace de travail SIP en quelques minutes
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative",
                      isCompleted && "bg-primary/10 text-primary border border-primary/20",
                      isActive && "bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110 z-10",
                      !isActive && !isCompleted && "bg-[#F3F2F1] text-[#999999] border border-[#E8E7E5]"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20" />
                    )}
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-3 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all duration-300",
                      isActive ? "text-primary translate-y-0 opacity-100" : "text-[#999999] translate-y-1 opacity-70"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-[2px] mx-1 -mt-8 transition-all duration-1000",
                      completedSteps.includes(step.id) ? "bg-primary" : "bg-[#E8E7E5]"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="relative bg-white border border-[#E8E7E5] rounded-[2rem] shadow-2xl shadow-black/5 overflow-hidden">
          {/* Card header accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          
          <div className="p-8">
            {/* Step content */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#111111] uppercase tracking-tight">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-sm text-[#666666] font-medium">
                {STEPS[currentStep - 1].description}
              </p>
            </div>

            <div className="min-h-[350px]">
              {currentStep === 1 && (
                <CompanyProfileStep onNext={handleCompanyNext} form={companyForm} />
              )}

              {currentStep === 2 && (
                <FirstUnitStep onNext={handleUnitNext} onBack={() => setCurrentStep(1)} form={unitForm} />
              )}

              {currentStep === 3 && (
                <InviteTeamStep
                  invitations={invitations}
                  onAdd={handleAddInvitation}
                  onRemove={handleRemoveInvitation}
                  onSubmit={handleSubmit}
                  onSkip={() => router.push("/dashboard")}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#999999] mt-10 opacity-60">
          Système Intégré de Pilotage
        </p>
      </div>
    </div>
  );
}
