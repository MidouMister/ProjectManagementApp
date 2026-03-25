import { getAuthUser, getCompanyById, updateCompany } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LegalFormOptions, SectorOptions, WilayaOptions, LegalForm, Sector } from "@/lib/types";
import { toast } from "sonner";

export default async function CompanySettingsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  
  // Get auth user
  const authUser = await getAuthUser("current");
  if (!authUser || authUser.role !== "OWNER" || authUser.companyId !== companyId) {
    redirect("/dashboard");
  }

  // Get company data
  const company = await getCompanyById(companyId);
  if (!company) {
    redirect("/dashboard");
  }

  async function updateCompanyAction(formData: FormData) {
    "use server";
    
    const data = {
      name: formData.get("name") as string,
      formJur: formData.get("formJur") as LegalForm,
      sector: formData.get("sector") as Sector,
      NIF: formData.get("NIF") as string,
      RC: formData.get("RC") as string,
      NIS: formData.get("NIS") as string || null,
      AI: formData.get("AI") as string || null,
      wilaya: formData.get("wilaya") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    };

    const result = await updateCompany(companyId, data);
    
    if (result.success) {
      toast.success("Entreprise mise à jour avec succès");
    } else {
      toast.error(result.error || "Échec de la mise à jour");
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Paramètres de l&apos;entreprise</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les informations de votre entreprise
        </p>
      </div>

      {/* Company Form */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Les informations de base de votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateCompanyAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={company.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formJur">Forme juridique</Label>
                <Select name="formJur" defaultValue={company.formJur}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une forme juridique" />
                  </SelectTrigger>
                  <SelectContent>
                    {LegalFormOptions.map((form) => (
                      <SelectItem key={form} value={form}>
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Secteur d&apos;activité</Label>
                <Select name="sector" defaultValue={company.sector}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {SectorOptions.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wilaya">Wilaya</Label>
                <Select name="wilaya" defaultValue={company.wilaya}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une wilaya" />
                  </SelectTrigger>
                  <SelectContent>
                    {WilayaOptions.map((wilaya) => (
                      <SelectItem key={wilaya} value={wilaya}>
                        {wilaya}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={company.address || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={company.phone || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={company.email || ""}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Fiscal Identities */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Identifiants fiscaux</CardTitle>
          <CardDescription>
            Les identifiants fiscaux de votre entreprise (obligatoires)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateCompanyAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="NIF">NIF (Numéro d&apos;Identification Fiscale)</Label>
                <Input
                  id="NIF"
                  name="NIF"
                  defaultValue={company.NIF || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="RC">RC (Registre de Commerce)</Label>
                <Input
                  id="RC"
                  name="RC"
                  defaultValue={company.RC || ""}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="NIS">NIS (Numéro d&apos;Identification Statistique)</Label>
                <Input
                  id="NIS"
                  name="NIS"
                  defaultValue={company.NIS || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="AI">AI (Article d&apos;Imposition)</Label>
                <Input
                  id="AI"
                  name="AI"
                  defaultValue={company.AI || ""}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button type="submit">
                Enregistrer les identifiants
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
