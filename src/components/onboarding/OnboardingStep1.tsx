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
import { X } from "lucide-react"
import { LegalFormOptions, WilayaOptions, type LegalForm, type Wilaya, type CompanyInput } from "@/lib/types"
import { checkFiscalIdentities } from "@/lib/queries"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { UploadButton } from "@/lib/uploadthing"
import { toast } from "sonner"

const companySchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  logo: z.string().optional().nullable(),
  formJur: z.string().min(1, "La forme juridique est requise"),
  sector: z.string().min(1, "Le secteur est requis"),
  wilaya: z.string().min(1, "La wilaya est requise"),
  NIF: z.string().min(1, "Le NIF est requis"),
  RC: z.string().min(5, "Le RC est requis"),
  NIS: z.string().optional(),
  AI: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Adresse email invalide"),
})

type CompanyFormData = z.infer<typeof companySchema>

const legalFormOptions: readonly LegalForm[] = LegalFormOptions
const wilayaOptions: readonly Wilaya[] = WilayaOptions

const sectorOptions = [
  "Construction",
  "Engineering",
  "Public Works",
  "Architecture",
  "Consulting",
  "IT",
  "Manufacturing",
  "Energy",
  "Transport",
  "Other",
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
      const res = await checkFiscalIdentities({ nif, rc, nis, ai });
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as CompanyInput))}
      className="space-y-8"
    >
      {/* Identity Section */}
      <div className="space-y-4">
        <label className="text-label text-muted-foreground block">Identité de l&apos;entreprise</label>
        
        <div className={cn(
          "relative group bg-surface-container-low rounded-xl p-8 transition-all duration-200",
          "hover:bg-surface-container transition-colors cursor-pointer border-none"
        )}>
          {logoPreview || defaultValues?.logo ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={logoPreview || defaultValues?.logo || ""}
                  alt="Company logo preview"
                  width={96}
                  height={96}
                  className="object-contain rounded-lg shadow-sm bg-white p-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setLogoPreview(null);
                    setValue("logo", undefined);
                  }}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-semibold text-primary">Logo téléchargé</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4">
              <UploadButton
                endpoint="companyLogo"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setLogoPreview(res[0].url)
                    setValue("logo", res[0].url)
                    toast.success("Logo téléchargé avec succès")
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Erreur: ${error.message}`)
                }}
                appearance={{
                  button: "bg-surface-container hover:bg-surface-container-high text-primary font-bold text-sm h-11 px-8 rounded-full shadow-sm transition-all",
                  allowedContent: "text-[10px] text-muted-foreground mt-2"
                }}
                content={{
                  button: "Télécharger le logo"
                }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleLogoChange}
            className="hidden"
            id="logo-upload"
          />
        </div>
      </div>

      {/* General Info Section */}
      <div className="space-y-6">
        <label className="text-label text-muted-foreground block">Informations générales</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Nom de l&apos;entreprise
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: SARL Construction Plus"
              className={cn(
                "bg-surface-container-low border-none h-11 px-4 text-sm font-medium transition-all group-focus-within:bg-white",
                "focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white"
              )}
            />
            {errors.name && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="formJur" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Forme juridique
            </label>
            <Select
              value={watchedFormJur}
              onValueChange={(value) => setValue("formJur", value)}
            >
              <SelectTrigger className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:bg-white data-placeholder:text-muted-foreground/50 transition-all">
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent className="glass border-none shadow-modal">
                {legalFormOptions.map((form) => (
                  <SelectItem key={form} value={form} className="text-sm">
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.formJur && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.formJur.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="sector" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Secteur d&apos;activité
            </label>
            <Select
              value={watchedSector}
              onValueChange={(value) => setValue("sector", value)}
            >
              <SelectTrigger className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:bg-white data-placeholder:text-muted-foreground/50 transition-all">
                <SelectValue placeholder="Choisir le secteur" />
              </SelectTrigger>
              <SelectContent className="glass border-none shadow-modal">
                {sectorOptions.map((sector) => (
                  <SelectItem key={sector} value={sector} className="text-sm">
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sector && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.sector.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="wilaya" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Siège Social (Wilaya)
            </label>
            <Select
              value={watchedWilaya}
              onValueChange={(value) => setValue("wilaya", value)}
            >
              <SelectTrigger className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus:ring-1 focus:ring-primary focus:bg-white data-placeholder:text-muted-foreground/50 transition-all">
                <SelectValue placeholder="Choisir la wilaya" />
              </SelectTrigger>
              <SelectContent className="glass border-none shadow-modal overflow-y-auto max-h-[300px]">
                {wilayaOptions.map((wilaya) => (
                  <SelectItem key={wilaya} value={wilaya} className="text-sm">
                    {wilaya}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wilaya && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.wilaya.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Legal Identifiers Section */}
      <div className="space-y-6">
        <label className="text-label text-muted-foreground block">Identifiants légaux</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <label htmlFor="NIF" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              NIF (Identifiant Fiscal)
            </label>
            <Input
              id="NIF"
              {...register("NIF", { onBlur: handleCheckIdentities })}
              placeholder="0001234..."
              className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
            />
            {errors.NIF && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.NIF.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="RC" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              RC (Registre du Commerce)
            </label>
            <Input
              id="RC"
              {...register("RC", { onBlur: handleCheckIdentities })}
              placeholder="24 B 0123..."
              className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
            />
            {errors.RC && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.RC.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="NIS" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              NIS (Numéro Statistique)
            </label>
            <Input
              id="NIS"
              {...register("NIS")}
              placeholder="Optionnel"
              className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="AI" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              AI (Article d&apos;Imposition)
            </label>
            <Input
              id="AI"
              {...register("AI")}
              placeholder="Optionnel"
              className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="space-y-6">
        <label className="text-label text-muted-foreground block">Coordonnées</label>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="address" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Adresse du siège
            </label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Adresse complète du siège social"
              rows={2}
              className="bg-surface-container-low border-none py-3 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all resize-none"
            />
            {errors.address && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Ligne officielle
              </label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+213..."
                className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
              />
              {errors.phone && (
                <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Email de contact
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="contact@entreprise.dz"
                className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
              />
              {errors.email && (
                <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-8">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-12 px-8 rounded-lg text-sm font-bold text-white transition-all",
            "bg-linear-to-b from-primary-container to-primary hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Enregistrement..." : "Continuer vers l'unité"}
        </Button>
      </div>
    </form>
  )
}
