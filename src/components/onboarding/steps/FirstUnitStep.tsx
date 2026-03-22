"use client";

import { Building2, CheckCircle2, ChevronRight, Lightbulb } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type UnitInput } from "@/lib/types";

interface FirstUnitStepProps {
  onNext: (data: UnitInput) => void;
  onBack: () => void;
  form: UseFormReturn<UnitInput>;
}

export function FirstUnitStep({ onNext, onBack, form }: FirstUnitStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Info Card */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#111111] uppercase tracking-tight">Créez votre première unité</p>
            <p className="text-xs text-[#666666] font-medium mt-1">
              Une unité représente un département, un bureau ou une équipe au sein de votre entreprise.
              Vous pourrez en créer d&apos;autres plus tard.
            </p>
          </div>
        </div>
      </div>

      {/* Unit Name */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Nom de l&apos;unité <span className="text-destructive font-bold">*</span></label>
        <div className="relative group/field">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within/field:scale-110 group-focus-within/field:text-primary">
            <Building2 className="w-5 h-5 text-[#999999] group-focus-within/field:text-primary" />
          </div>
          <Input
            {...register("name")}
            placeholder="Ex: Unité Nord / Siège Social"
            className={cn(
              "pl-12 h-14 bg-white border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#999999] rounded-2xl shadow-sm",
              errors.name && "border-destructive focus:border-destructive focus:ring-destructive/5"
            )}
          />
        </div>
        {errors.name && (
          <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Contact Info */}
      <div className="p-6 bg-[#F9F9F8] border border-[#E8E7E5] rounded-[2rem] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8E7E5] pb-3 mb-2">
          <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <label className="text-xs font-black text-[#111111] uppercase tracking-widest">
            Coordonnées de l&apos;unité
          </label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Adresse <span className="text-destructive font-bold">*</span></label>
            <Input
              {...register("address")}
              placeholder="Adresse de l'unité"
              className={cn(
                "h-14 bg-white border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#999999] rounded-2xl shadow-sm",
                errors.address && "border-destructive"
              )}
            />
            {errors.address && (
              <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Téléphone <span className="text-destructive font-bold">*</span></label>
              <Input
                {...register("phone")}
                placeholder="0555 00 00 00"
                className={cn(
                  "h-14 bg-white border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#999999] rounded-2xl shadow-sm",
                  errors.phone && "border-destructive"
                )}
              />
              {errors.phone && (
                <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Email <span className="text-destructive font-bold">*</span></label>
              <Input
                {...register("email")}
                type="email"
                placeholder="unite@entreprise.dz"
                className={cn(
                  "h-14 bg-white border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#999999] rounded-2xl shadow-sm",
                  errors.email && "border-destructive"
                )}
              />
              {errors.email && (
                <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-14 px-8 border-[#E8E7E5] text-[#666666] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#F3F2F1] hover:text-[#111111] transition-all duration-300"
        >
          Retour
        </Button>
        <Button
          type="submit"
          className="flex-1 h-14 bg-[#111111] hover:bg-[#222222] text-white font-bold uppercase tracking-widest rounded-2xl transition-all duration-500 shadow-xl shadow-black/10 hover:shadow-primary/20 group"
        >
          Continuer
          <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </form>
  );
}
