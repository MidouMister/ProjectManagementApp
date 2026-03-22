"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const unitSchema = z.object({
  name: z.string().min(1, "Unit name is required"),
  address: z.string().min(1, "Unit address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
})

type UnitFormData = z.infer<typeof unitSchema>

interface OnboardingStep2Props {
  defaultValues?: Record<string, unknown>
  onSubmit: (data: Record<string, unknown>) => void
}

export function OnboardingStep2({ defaultValues, onSubmit }: OnboardingStep2Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: defaultValues as UnitFormData,
  })

  const currentUser = {
    name: "Current User",
    email: "user@example.com",
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs font-medium text-foreground">
            Unit Name
          </label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Enter unit name"
            className="bg-surface-container-low"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="text-xs font-medium text-foreground">
            Unit Address
          </label>
          <Textarea
            id="address"
            {...register("address")}
            placeholder="Enter unit address"
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
              Unit Phone
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="Enter unit phone"
              className="bg-surface-container-low"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-medium text-foreground">
              Unit Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="Enter unit email"
              className="bg-surface-container-low"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-label text-muted-foreground">Admin Assignment</label>
        </div>
        
        <div className="bg-surface-container-low rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
          </div>
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            ADMIN
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          You will be automatically assigned as the admin of this unit.
        </p>
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
