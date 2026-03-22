"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { Upload } from "lucide-react"
import { LegalFormOptions, WilayaOptions, type LegalForm, type Wilaya } from "@/lib/types"

const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  formJur: z.string().min(1, "Legal form is required"),
  sector: z.string().min(1, "Sector is required"),
  wilaya: z.string().min(1, "Wilaya is required"),
  NIF: z.string().min(1, "NIF is required"),
  RC: z.string().min(1, "RC is required"),
  NIS: z.string().optional(),
  AI: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
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
  defaultValues?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => void
}

export function OnboardingStep1({ defaultValues, onSubmit }: OnboardingStep1Props) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultValues as CompanyFormData,
  })

  const watchedFormJur = watch("formJur")
  const watchedSector = watch("sector")
  const watchedWilaya = watch("wilaya")

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
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label className="text-label text-muted-foreground">Brand Identity</label>
        </div>
        
        <div className="border-2 border-dashed border-outline rounded-lg p-8 flex flex-col items-center justify-center gap-3">
          {logoPreview ? (
            <div className="relative">
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="w-24 h-24 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => setLogoPreview(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Company Logo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG or JPG. Recommended size 400x400px.
                </p>
              </div>
            </>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleLogoChange}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload">
            <Button type="button" variant="outline" size="sm" asChild>
              <span className="cursor-pointer">Upload Logo</span>
            </Button>
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-label text-muted-foreground">General Information</label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-medium text-foreground">
              Company Name
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter company name"
              className="bg-surface-container-low"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="formJur" className="text-xs font-medium text-foreground">
              Legal Form
            </label>
            <Select
              value={watchedFormJur}
              onValueChange={(value) => setValue("formJur", value)}
            >
              <SelectTrigger className="bg-surface-container-low">
                <SelectValue placeholder="Select legal form" />
              </SelectTrigger>
              <SelectContent>
                {legalFormOptions.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.formJur && (
              <p className="text-xs text-destructive">{errors.formJur.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="sector" className="text-xs font-medium text-foreground">
              Sector
            </label>
            <Select
              value={watchedSector}
              onValueChange={(value) => setValue("sector", value)}
            >
              <SelectTrigger className="bg-surface-container-low">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                {sectorOptions.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sector && (
              <p className="text-xs text-destructive">{errors.sector.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="wilaya" className="text-xs font-medium text-foreground">
              Wilaya
            </label>
            <Select
              value={watchedWilaya}
              onValueChange={(value) => setValue("wilaya", value)}
            >
              <SelectTrigger className="bg-surface-container-low">
                <SelectValue placeholder="Select wilaya" />
              </SelectTrigger>
              <SelectContent>
                {wilayaOptions.map((wilaya) => (
                  <SelectItem key={wilaya} value={wilaya}>
                    {wilaya}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.wilaya && (
              <p className="text-xs text-destructive">{errors.wilaya.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-label text-muted-foreground">Legal Identifiers</label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="NIF" className="text-xs font-medium text-foreground">
              NIF (Tax ID)
            </label>
            <Input
              id="NIF"
              {...register("NIF")}
              placeholder="Enter NIF"
              className="bg-surface-container-low"
            />
            {errors.NIF && (
              <p className="text-xs text-destructive">{errors.NIF.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="RC" className="text-xs font-medium text-foreground">
              RC (Reg. Commerce)
            </label>
            <Input
              id="RC"
              {...register("RC")}
              placeholder="Enter RC"
              className="bg-surface-container-low"
            />
            {errors.RC && (
              <p className="text-xs text-destructive">{errors.RC.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="NIS" className="text-xs font-medium text-foreground">
              NIS (Statistique)
            </label>
            <Input
              id="NIS"
              {...register("NIS")}
              placeholder="Enter NIS (optional)"
              className="bg-surface-container-low"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="AI" className="text-xs font-medium text-foreground">
              AI (Article d&apos;Imposition)
            </label>
            <Input
              id="AI"
              {...register("AI")}
              placeholder="Enter AI (optional)"
              className="bg-surface-container-low"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-label text-muted-foreground">Contact Details</label>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address" className="text-xs font-medium text-foreground">
              Full Address
            </label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Enter full address"
              rows={2}
              className="bg-surface-container-low"
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-medium text-foreground">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="Enter phone number"
                className="bg-surface-container-low"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-foreground">
                Official Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter official email"
                className="bg-surface-container-low"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#1E3A8A] to-[#00236f] text-white rounded-lg"
        >
          {isSubmitting ? "Saving..." : "Next Step"}
        </Button>
      </div>
    </form>
  )
}
