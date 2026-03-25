import { getAuthUser, getCompanyById, getUnits, createUnit, updateUnit, deleteUnit } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Building2, Users, FolderKanban, UserRound, Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

interface UnitWithCounts {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  _count: {
    projects: number;
    clients: number;
    users: number;
  };
}

export default async function UnitsPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  const authUser = await getAuthUser("current");
  if (!authUser || authUser.role !== "OWNER" || authUser.companyId !== companyId) {
    redirect("/dashboard");
  }

  const company = await getCompanyById(companyId);
  if (!company) {
    redirect("/dashboard");
  }

  const units = await getUnits(companyId);
  const subscription = company.subscription;
  const plan = subscription?.plan;
  const maxUnits = plan?.maxUnits ?? null;
  const canCreateUnit = maxUnits === null || units.length < maxUnits;

  async function createUnitAction(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    const result = await createUnit(
      { name, address, phone, email },
      companyId,
      authUser!.id
    );

    if (result.success) {
      revalidatePath(`/company/${companyId}/units`);
    }
  }

  async function updateUnitAction(unitId: string, formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    const result = await updateUnit(unitId, { name, address, phone, email });

    if (result.success) {
      revalidatePath(`/company/${companyId}/units`);
    }
  }

  async function deleteUnitAction(unitId: string) {
    "use server";
    const result = await deleteUnit(unitId);

    if (result.success) {
      revalidatePath(`/company/${companyId}/units`);
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/company/${companyId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Unités</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les unités opérationnelles de votre entreprise
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {units.length} {units.length === 1 ? "unité" : "unités"}
            {maxUnits !== null && ` / ${maxUnits}`}
          </Badge>
        </div>
        <CreateUnitDialog
          canCreate={canCreateUnit}
          createAction={createUnitAction}
        />
      </div>

      {units.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">Aucune unité</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Créez votre première unité pour commencer
            </p>
            {canCreateUnit ? (
              <CreateUnitDialog
                canCreate={canCreateUnit}
                createAction={createUnitAction}
                triggerButton
              />
            ) : (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-4">
                Nombre maximum d&apos;unités atteint
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              updateAction={updateUnitAction}
              deleteAction={deleteUnitAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CreateUnitDialog({
  canCreate,
  createAction,
  triggerButton = false,
}: {
  canCreate: boolean;
  createAction: (formData: FormData) => Promise<void>;
  triggerButton?: boolean;
}) {
  return (
    <Dialog>
      {!triggerButton ? (
        canCreate ? (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Créer une unité
          </Button>
        ) : (
          <Button disabled variant="outline" className="opacity-50 cursor-not-allowed">
            <Plus className="mr-2 h-4 w-4" />
            Limite atteinte
          </Button>
        )
      ) : null}
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Créer une unité</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle unité opérationnelle à votre entreprise
          </DialogDescription>
        </DialogHeader>
        <form action={createAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Nom de l&apos;unité</label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Siège social, Agence d'Alger"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">Adresse</label>
            <Input
              id="address"
              name="address"
              placeholder="Adresse de l'unité"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
              <Input
                id="phone"
                name="phone"
                placeholder="05XX XXX XXX"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@unité.dz"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Créer l&apos;unité
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UnitCard({
  unit,
  updateAction,
  deleteAction,
}: {
  unit: UnitWithCounts;
  updateAction: (unitId: string, formData: FormData) => Promise<void>;
  deleteAction: (unitId: string) => Promise<void>;
}) {
  return (
    <Card className="border border-border hover:border-primary/30 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">{unit.name}</CardTitle>
        <div className="flex items-center gap-1">
          <EditUnitDialog unit={unit} updateAction={updateAction} />
          <DeleteUnitDialog unitId={unit.id} unitName={unit.name} deleteAction={deleteAction} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {unit.address && (
          <p className="text-sm text-muted-foreground">{unit.address}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-foreground">
          <div className="flex items-center gap-1.5">
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
            <span>{unit._count.projects} projets</span>
          </div>
          <div className="flex items-center gap-1.5">
            <UserRound className="h-4 w-4 text-muted-foreground" />
            <span>{unit._count.clients} clients</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{unit._count.users} membres</span>
          </div>
        </div>
        {unit.phone || unit.email ? (
          <div className="text-sm text-muted-foreground pt-2 border-t">
            {unit.phone && <p>{unit.phone}</p>}
            {unit.email && <p>{unit.email}</p>}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function EditUnitDialog({
  unit,
  updateAction,
}: {
  unit: UnitWithCounts;
  updateAction: (unitId: string, formData: FormData) => Promise<void>;
}) {
  return (
    <Dialog>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Pencil className="h-4 w-4" />
      </Button>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;unité</DialogTitle>
          <DialogDescription>
            Modifiez les informations de l&apos;unité {unit.name}
          </DialogDescription>
        </DialogHeader>
        <form action={updateAction.bind(null, unit.id)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="edit-name" className="text-sm font-medium">Nom de l&apos;unité</label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={unit.name}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="edit-address" className="text-sm font-medium">Adresse</label>
            <Input
              id="edit-address"
              name="address"
              defaultValue={unit.address}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-phone" className="text-sm font-medium">Téléphone</label>
              <Input
                id="edit-phone"
                name="phone"
                defaultValue={unit.phone}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email" className="text-sm font-medium">Email</label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                defaultValue={unit.email}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteUnitDialog({
  unitId,
  unitName,
  deleteAction,
}: {
  unitId: string;
  unitName: string;
  deleteAction: (unitId: string) => Promise<void>;
}) {
  async function handleDelete() {
    "use server";
    await deleteAction(unitId);
  }

  return (
    <AlertDialog>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
        <Trash2 className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;unité &quot;{unitName}&quot; ? Cette action est irréversible et supprimera tous les projets, tâches et clients associés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <form action={handleDelete}>
            <AlertDialogAction type="submit" className="bg-destructive hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
