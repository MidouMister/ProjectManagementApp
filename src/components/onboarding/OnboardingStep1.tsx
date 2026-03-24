"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Building2, ShieldCheck, Mail, Phone, MapPin } from "lucide-react"
import { LegalFormOptions, WilayaOptions, type LegalForm, type Wilaya, type CompanyInput } from "@/lib/types"
import { checkFiscalIdentities } from "@/lib/queries"
import { companySchema } from "@/lib/validators"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"

type CompanyFormData = z.infer<typeof companySchema>

const legalFormOptions: readonly LegalForm[] = LegalFormOptions
const wilayaOptions: readonly Wilaya[] = WilayaOptions

const sectorOptions = [
  "Construction",
  "Ingénierie",
  "Travaux Publics",
  "Architecture",
  "Conseil",
  "Informatique",
  "Industrie",
  "Énergie",
  "Transport",
  "Autre",
] as const

interface OnboardingStep1Props {
  defaultValues?: CompanyInput
  onSubmit: (data: CompanyInput) => void
}

export function OnboardingStep1({ defaultValues, onSubmit }: OnboardingStep1Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(companySchema as any),
    defaultValues: defaultValues as CompanyFormData,
  })

  const watchedFormJur = useWatch({ control, name: "formJur" })
  const watchedSector = useWatch({ control, name: "sector" })
  const watchedWilaya = useWatch({ control, name: "wilaya" })

  const handleCheckIdentities = async () => {
    const nif = getValues("NIF");
    const rc = getValues("RC");
    const nis = getValues("NIS");
    const ai = getValues("AI");
    
    if (nif || rc || nis || ai) {
      const res = await checkFiscalIdentities({ 
        nif, 
        rc, 
        nis: nis || undefined, 
        ai: ai || undefined 
      });
      if (!res.success) {
        if (res.error === "NIF_EXISTS") {
          setError("NIF", { type: "manual", message: "Ce NIF est déjà utilisé par une autre entreprise" });
        } else if (res.error === "RC_EXISTS") {
          setError("RC", { type: "manual", message: "Ce RC est déjà utilisé par une autre entreprise" });
        } else if (res.error === "NIS_EXISTS") {
          setError("NIS", { type: "manual", message: "Ce NIS est déjà utilisé par une autre entreprise" });
        } else if (res.error === "AI_EXISTS") {
          setError("AI", { type: "manual", message: "Cet AI est déjà utilisé par une autre entreprise" });
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as CompanyInput))}
      className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      {/* Identity & General Info Section */}
      <div className="space-y-6">
        <label className="text-label text-muted-foreground/60 block mb-2 px-1">Identité & Informations générales</label>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Logo Field (Smaller & Left) */}
          <div className={cn(
            "relative group bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 transition-all duration-300 border-2 border-dashed border-muted-foreground/10",
            "hover:border-primary/20 hover:bg-white dark:hover:bg-slate-900 shadow-sm flex flex-col items-center justify-center shrink-0 w-full md:w-[160px] h-[100px] mt-7"
          )}>
            {logoPreview || defaultValues?.logo ? (
              <div className="flex items-center justify-center w-full h-full animate-in zoom-in-95 duration-500">
                <div className="relative group/logo">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg group-hover/logo:bg-primary/20 transition-all" />
                  <div className="relative bg-white p-2 rounded-xl shadow-lg border border-border/10 flex items-center justify-center w-16 h-16">
                    <Image
                      src={logoPreview || defaultValues?.logo || ""}
                      alt="Logo preview"
                      width={48}
                      height={48}
                      className="object-contain max-h-[48px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setLogoPreview(null);
                      setValue("logo", undefined);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white text-destructive rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-10 border border-destructive/10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-center animate-in fade-in duration-500 w-full">
                <UploadButton
                  endpoint="companyLogo"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setLogoPreview(res[0].url)
                      setValue("logo", res[0].url)
                      toast.success("Logo chargé avec succès")
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Erreur: ${error.message}`)
                  }}
                  appearance={{
                    button: "bg-primary text-white font-bold text-[10px] h-8 px-4 rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all w-full",
                    allowedContent: "hidden"
                  }}
                  content={{
                    button: "Importer Logo"
                  }}
                />
                <p className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-widest">Max 4MB</p>
              </div>
            )}
          </div>

          {/* Dénomination Sociale */}
          <div className="flex-1 space-y-2 flex flex-col justify-center">
            <label htmlFor="name" className="text-label text-muted-foreground/80 ml-1">
              Dénomination Sociale
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: SARL Construction Plus"
              className={cn(
                "bg-slate-50 dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold transition-all shadow-sm ring-1 ring-black/5 dark:ring-white/10",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md"
              )}
            />
            {errors.name && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1 animate-in fade-in duration-300">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Additional Selects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">

          <div className="space-y-2">
            <label htmlFor="formJur" className="text-label text-muted-foreground/80 ml-1">
              Forme Juridique
            </label>
            <Select
              value={watchedFormJur}
              onValueChange={(value) => setValue("formJur", value as CompanyFormData["formJur"])}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all">
                <SelectValue placeholder="Choisir la forme..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 shadow-2xl border border-muted-foreground/10 dark:border-white/5 rounded-2xl p-1 z-60">
                {legalFormOptions.map((form) => (
                  <SelectItem key={form} value={form} className="text-sm font-bold rounded-xl m-1 px-4 py-3 cursor-pointer focus:bg-primary focus:text-white dark:focus:bg-primary dark:focus:text-white transition-colors">
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.formJur && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.formJur.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="sector" className="text-label text-muted-foreground/60 ml-1">
              Secteur d&apos;Activité
            </label>
            <Select
              value={watchedSector}
              onValueChange={(value) => setValue("sector", value as CompanyFormData["sector"])}
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all">
                <SelectValue placeholder="Choisir le secteur..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 shadow-2xl border border-muted-foreground/10 dark:border-white/5 rounded-2xl p-1 z-60 max-h-[300px]">
                {sectorOptions.map((sector) => (
                  <SelectItem key={sector} value={sector} className="text-sm font-bold rounded-xl m-1 px-4 py-3 cursor-pointer focus:bg-primary focus:text-white dark:focus:bg-primary dark:focus:text-white transition-colors">
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sector && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.sector.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="wilaya" className="text-label text-muted-foreground/80 ml-1">
              Wilaya (Siège Social)
            </label>
            <Select
              value={watchedWilaya}
              onValueChange={(value) => setValue("wilaya", value)}
              
            >
              <SelectTrigger className="bg-slate-50 dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus:ring-2 focus:ring-primary/20 focus:bg-white dark:focus:bg-slate-800 transition-all">
                <SelectValue placeholder="Sélectionner la wilaya..." />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 shadow-2xl border border-muted-foreground/10 dark:border-white/5 rounded-2xl p-1 z-60 overflow-y-auto max-h-[350px]">
                {wilayaOptions.map((wilaya) => (
                  <SelectItem key={wilaya} value={wilaya} className="text-sm font-bold rounded-xl m-1 px-4 py-3 cursor-pointer focus:bg-primary focus:text-white dark:focus:bg-primary dark:focus:text-white transition-colors">
                    {wilaya}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wilaya && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.wilaya.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fiscal Identifiers Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2 px-1">
          <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <label className="text-label text-muted-foreground/60 block">Identifiants légaux & Fiscaux</label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 p-6 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-muted-foreground/5 shadow-inner">
          <div className="space-y-2">
            <label htmlFor="NIF" className="text-label text-muted-foreground/70 ml-1">
              NIF (Identifiant Fiscal)
            </label>
            <Input
              id="NIF"
              {...register("NIF", { onBlur: handleCheckIdentities })}
              placeholder="010022312345678 (15 chiffres)"
              className="bg-white border-none h-12 px-5 text-sm font-black shadow-sm ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-md transition-all placeholder:font-medium placeholder:text-muted-foreground/30"
            />
            {errors.NIF && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.NIF.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="RC" className="text-label text-muted-foreground/70 ml-1">
              RC (Registre du Commerce)
            </label>
            <Input
              id="RC"
              {...register("RC", { onBlur: handleCheckIdentities })}
              placeholder="16A0123456 (10 caractères)"
              className="bg-white border-none h-12 px-5 text-sm font-black shadow-sm ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:shadow-md transition-all placeholder:font-medium placeholder:text-muted-foreground/30"
            />
            {errors.RC && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.RC.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="NIS" className="text-label text-muted-foreground/70 ml-1">
              NIS (Numéro Statistique)
            </label>
            <Input
              id="NIS"
              {...register("NIS")}
              placeholder="099416010012345 (15 chiffres)"
              className="bg-white/70 dark:bg-slate-900/50 border-none h-12 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white transition-all placeholder:text-muted-foreground/30 placeholder:font-medium"
            />
            {errors.NIS && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.NIS.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="AI" className="text-label text-muted-foreground/70 ml-1">
              AI (Article d&apos;Imposition)
            </label>
            <Input
              id="AI"
              {...register("AI")}
              placeholder="16010250456 (11 chiffres)"
              className="bg-white/70 dark:bg-slate-900/50 border-none h-12 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white transition-all placeholder:text-muted-foreground/30 placeholder:font-medium"
            />
            {errors.AI && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.AI.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-6">
        <label className="text-label text-muted-foreground/60 block mb-2 px-1">Coordonnées de Contact</label>
        
        <div className="space-y-8 bg-white/50 dark:bg-slate-900/40 rounded-3xl p-6 border border-muted-foreground/5 shadow-card">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 ml-1">
              <MapPin className="w-4 h-4 text-primary/40" />
              <label htmlFor="address" className="text-label text-muted-foreground/80 font-bold">
                Adresse du siège social
              </label>
            </div>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Saisissez l'adresse complète..."
              rows={2}
              className="bg-white dark:bg-slate-900 border-none py-5 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all resize-none font-sans placeholder:font-medium"
            />
            {errors.address && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 ml-1">
                <Phone className="w-4 h-4 text-primary/40" />
                <label htmlFor="phone" className="text-label text-muted-foreground/80 font-bold">
                  Ligne Officielle
                </label>
              </div>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+213..."
                className="bg-white dark:bg-slate-900 border-none h-12 px-5 text-sm font-extrabold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all placeholder:font-medium"
              />
              {errors.phone && (
                <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 ml-1">
                <Mail className="w-4 h-4 text-primary/40" />
                <label htmlFor="email" className="text-label text-muted-foreground/80 font-bold">
                  Email Administratif
                </label>
              </div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@entreprise.dz"
                className="bg-white dark:bg-slate-900 border-none h-12 px-5 text-sm font-extrabold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all placeholder:font-medium"
              />
              {errors.email && (
                <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end pt-12 sticky bottom-0 bg-linear-to-t from-[#ECEAE8] dark:from-[#0F1115] via-[#ECEAE8]/90 dark:via-[#0F1115]/90 to-transparent pb-6 z-40">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-16 px-12 rounded-btn text-sm font-black text-white transition-all",
            "bg-primary hover:bg-primary/95 hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/25",
            "disabled:opacity-50 disabled:cursor-not-allowed group"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-3">
              <span className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              Finalisation...
            </span>
          ) : (
            <span className="flex items-center gap-3 tracking-tight">
              Continuer vers l&apos;unité opérationnelle
              <Building2 className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
