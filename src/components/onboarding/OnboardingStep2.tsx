"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { type UnitInput } from "@/lib/types"

const unitSchema = z.object({
  name: z.string().min(1, "Le nom de l'unité est requis"),
  address: z.string().min(1, "L'adresse de l'unité est requise"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Adresse email invalide"),
})

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
      className="space-y-8"
    >
      <div className="space-y-6">
        <label className="text-label text-muted-foreground block">Détails de l&apos;unité opérationnelle</label>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Nom de l&apos;unité
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ex: Direction Technique Algérie Central"
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
            <label htmlFor="address" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
              Localisation
            </label>
            <Textarea
              id="address"
              {...register("address")}
              placeholder="Adresse de l'unité opérationnelle"
              rows={2}
              className="bg-surface-container-low border-none py-3 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all resize-none font-sans"
            />
            {errors.address && (
              <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 ml-1">
                Téléphone de l&apos;unité
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
                Email de l&apos;unité
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="tech-center@entreprise.dz"
                className="bg-surface-container-low border-none h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-white transition-all"
              />
              {errors.email && (
                <p className="text-[10px] font-medium text-destructive mt-1 ml-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>


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
          {isSubmitting ? "Enregistrement..." : "Continuer vers l'équipe"}
        </Button>
      </div>
    </form>
  )
}
