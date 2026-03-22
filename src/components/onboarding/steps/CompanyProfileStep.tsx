"use client";

import { Building2, CheckCircle2, ChevronRight } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LegalFormOptions,
  SectorOptions,
  WilayaOptions,
  type CompanyInput,
} from "@/lib/types";

interface CompanyProfileStepProps {
  onNext: (data: CompanyInput) => void;
  form: UseFormReturn<CompanyInput>;
}

export function CompanyProfileStep({ onNext, form }: CompanyProfileStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Company Name & Logo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-2">
          <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Nom de l&apos;entreprise <span className="text-destructive font-bold">*</span></label>
          <div className="relative group/field">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 group-focus-within/field:scale-110 group-focus-within/field:text-primary">
              <Building2 className="w-5 h-5 text-[#999999] group-focus-within/field:text-primary" />
            </div>
            <Input
              {...register("name")}
              placeholder="Ex: SIP Project Planning"
              className={cn(
                "pl-12 h-14 bg-white! border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#999999] rounded-2xl shadow-sm",
                errors.name && "border-destructive focus:border-destructive focus:ring-destructive/5"
              )}
            />
          </div>
          {errors.name && (
            <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1 animate-in slide-in-from-left-1">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">URL du Logo</label>
          <Input
            {...register("logo")}
            placeholder="https://..."
            className="h-14 bg-white! border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#999999] rounded-2xl shadow-sm"
          />
        </div>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Forme Juridique <span className="text-destructive font-bold">*</span></label>
          <Select onValueChange={(v) => setValue("formJur", v as any)} defaultValue={getValues("formJur")}>
            <SelectTrigger className={cn(
              "h-14 bg-white! border-[#E8E7E5] focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] rounded-2xl shadow-sm",
              errors.formJur && "border-destructive"
            )}>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#E8E7E5] shadow-2xl">
              {LegalFormOptions.map((form) => (
                <SelectItem key={form} value={form} className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer rounded-lg mx-1 my-0.5">
                  {form}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.formJur && (
            <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.formJur.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Secteur <span className="text-destructive font-bold">*</span></label>
          <Select onValueChange={(v) => setValue("sector", v as any)} defaultValue={getValues("sector")}>
            <SelectTrigger className={cn(
              "h-14 bg-white! border-[#E8E7E5] focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] rounded-2xl shadow-sm",
              errors.sector && "border-destructive"
            )}>
              <SelectValue placeholder="Choisir..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#E8E7E5] shadow-2xl">
              {SectorOptions.map((sector) => (
                <SelectItem key={sector} value={sector} className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer rounded-lg mx-1 my-0.5">
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sector && (
            <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.sector.message}</p>
          )}
        </div>
      </div>

      {/* Fiscal Identifiers */}
      <div className="p-6 bg-[#F9F9F8] border border-[#E8E7E5] rounded-[2rem] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E7E5] pb-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <label className="text-xs font-black text-[#111111] uppercase tracking-widest">
              Identifiants Fiscaux
            </label>
          </div>
          <span className="text-[9px] text-[#999999] font-bold uppercase tracking-widest bg-white px-2 py-1 rounded-full border border-[#E8E7E5]">
            NIF et RC Requis <span className="text-destructive">*</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "NIF", label: "NIF*", placeholder: "00123456789" },
            { key: "RC", label: "RC*", placeholder: "12345/00-1234567" },
            { key: "NIS", label: "NIS", placeholder: "12345-6789" },
            { key: "AI", label: "AI", placeholder: "12345-6789" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="group/fiscal">
              <label className="text-[9px] font-bold text-[#999999] uppercase tracking-widest ml-1 mb-1 block group-focus-within/fiscal:text-primary transition-colors">{label}</label>
              <Input
                {...register(key as keyof CompanyInput)}
                placeholder={placeholder}
                className={cn(
                  "h-12 bg-white! border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-bold text-[#111111] placeholder:text-[#BBBBBB] rounded-2xl shadow-sm",
                  errors[key as keyof CompanyInput] && "border-destructive focus:border-destructive"
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Location & Contact Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Wilaya <span className="text-destructive font-bold">*</span></label>
            <Select onValueChange={(v) => setValue("wilaya", v)} defaultValue={getValues("wilaya")}>
              <SelectTrigger className={cn(
                "h-14 bg-white! border-[#E8E7E5] focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] rounded-2xl shadow-sm",
                errors.wilaya && "border-destructive"
              )}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#E8E7E5] shadow-2xl">
                {WilayaOptions.map((wilaya) => (
                  <SelectItem key={wilaya} value={wilaya} className="focus:bg-primary/5 focus:text-primary transition-colors cursor-pointer rounded-lg mx-1 my-0.5">
                    {wilaya}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wilaya && (
              <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.wilaya.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Téléphone <span className="text-destructive font-bold">*</span></label>
            <Input
              {...register("phone")}
              placeholder="0555 00 00 00"
              className={cn(
                "h-14 bg-white! border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#BBBBBB] rounded-2xl shadow-sm",
                errors.phone && "border-destructive"
              )}
            />
            {errors.phone && (
              <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#999999] uppercase tracking-widest ml-1">Email <span className="text-destructive font-bold">*</span></label>
          <Input
            {...register("email")}
            type="email"
            placeholder="contact@entreprise.dz"
            className={cn(
              "h-14 bg-white! border-[#E8E7E5] focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all duration-300 font-semibold text-[#111111] placeholder:text-[#BBBBBB] rounded-2xl shadow-sm",
              errors.email && "border-destructive"
            )}
          />
          {errors.email && (
            <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full h-14 mt-8 bg-[#111111] hover:bg-[#222222] text-white font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-black/10 flex items-center justify-center transition-all duration-500 hover:shadow-primary/20 group">
        CONTINUER
        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
}
