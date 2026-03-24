"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { type UnitInput } from "@/lib/types"
import { unitSchema } from "@/lib/validators"
import { Building2, MapPin, Phone, Mail, ArrowRight } from "lucide-react"

type UnitFormData = z.infer<typeof unitSchema>

interface OnboardingStep2Props {
  defaultValues?: UnitInput
  onSubmit: (data: UnitInput) => void
}

export function OnboardingStep2({ defaultValues, onSubmit }: OnboardingStep2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(unitSchema as any),
    defaultValues: defaultValues as UnitFormData,
  })

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as UnitInput))}
      className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700"
    >
      <div className="space-y-6">
        <label className="text-label text-muted-foreground/60 block mb-2 px-1">Détails de l&apos;unité opérationnelle</label>
        
        <div className="space-y-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-10 border border-muted-foreground/5 shadow-inner">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 ml-1">
              <Building2 className="w-4 h-4 text-primary/40" />
              <label htmlFor="name" className="text-label text-muted-foreground/80 font-bold">
                Nom de l&apos;unité
              </label>
            </div>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Direction Technique Algérie Central"
              className={cn(
                "bg-white dark:bg-slate-900 border-none h-14 px-5 text-sm font-bold transition-all shadow-sm ring-1 ring-black/5 dark:ring-white/10",
                "focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md"
              )}
            />
            {errors.name && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1 animate-in fade-in duration-300">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2.5 ml-1">
              <MapPin className="w-4 h-4 text-primary/40" />
              <label htmlFor="address" className="text-label text-muted-foreground/80 font-bold">
                Localisation & Adresse
              </label>
            </div>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Adresse physique de cette unité..."
              rows={2}
              className="bg-white dark:bg-slate-900 border-none py-5 px-5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all resize-none font-sans placeholder:font-medium"
            />
            {errors.address && (
              <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1 animate-in fade-in duration-300">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 ml-1">
                <Phone className="w-4 h-4 text-primary/40" />
                <label htmlFor="phone" className="text-label text-muted-foreground/80 font-bold">
                  Ligne de l&apos;unité
                </label>
              </div>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="+213..."
                className="bg-white dark:bg-slate-900 border-none h-14 px-5 text-sm font-extrabold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all placeholder:font-medium"
              />
              {errors.phone && (
                <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1 animate-in fade-in duration-300">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2.5 ml-1">
                <Mail className="w-4 h-4 text-primary/40" />
                <label htmlFor="email" className="text-label text-muted-foreground/80 font-bold">
                  Email de contact rapide
                </label>
              </div>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="unit@entreprise.dz"
                className="bg-white dark:bg-slate-900 border-none h-14 px-5 text-sm font-extrabold shadow-sm ring-1 ring-black/5 dark:ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:bg-white dark:focus-visible:bg-slate-800 focus-visible:shadow-md transition-all placeholder:font-medium"
              />
              {errors.email && (
                <p className="text-[11px] font-bold text-destructive mt-1.5 ml-1 animate-in fade-in duration-300">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-12 sticky bottom-0 bg-linear-to-t from-[#ECEAE8] dark:from-[#0F1115] via-[#ECEAE8]/90 dark:via-[#0F1115]/90 to-transparent pb-6 z-40">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-16 px-12 rounded-btn text-sm font-black text-white transition-all shadow-2xl shadow-primary/25",
            "bg-primary hover:bg-primary/95 hover:scale-[1.02] active:scale-95 group disabled:opacity-50"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-3">
              <span className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              Traitement...
            </span>
          ) : (
            <span className="flex items-center gap-3 tracking-tight">
              Continuer vers l&apos;Équipe
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>
    </form>
  )
}
