import { getAuthUser } from "@/lib/queries";
import { redirect } from "next/navigation";
import { getCompanyById, getUnits } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Users, 
  FolderKanban, 
  TrendingUp, 
  Settings,
  ArrowRight,
  Plus,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export default async function CompanyDashboardPage({
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

  const units = await getUnits(companyId);

  // Calculate KPIs
  const totalProjects = units.reduce((acc, unit) => acc + (unit._count.projects || 0), 0);
  const totalClients = units.reduce((acc, unit) => acc + (unit._count.clients || 0), 0);
  const totalMembers = units.reduce((acc, unit) => acc + (unit._count.users || 0), 0);

  // Subscription info
  const subscription = company.subscription;
  const plan = subscription?.plan;
  const status = subscription?.status || "TRIAL";
  
  // Calculate days remaining for trial
  let daysRemaining = 0;
  if (subscription?.endAt) {
    const diff = new Date(subscription.endAt).getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{company.name}</h1>
          <p className="text-muted-foreground mt-1">
            Tableau de bord de l&apos;entreprise
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/company/${companyId}/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      {status === "TRIAL" && daysRemaining > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Période d&apos;essai</p>
              <p className="text-sm text-muted-foreground">
                {daysRemaining} jours restants
              </p>
            </div>
          </div>
          <Link href={`/company/${companyId}/settings/billing`}>
            <Button size="sm">
              Passer à Pro
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Unités
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{company._count.units || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {plan?.maxUnits ? `sur ${plan.maxUnits} maximum` : "Illimité"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Projets
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {plan?.maxProjects ? `sur ${plan.maxProjects} maximum` : "Illimité"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Clients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all units
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Membres
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {plan?.maxMembers ? `sur ${plan.maxMembers} maximum` : "Illimité"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Info */}
      <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Plan actuel</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez votre abonnement et vos limites
              </p>
            </div>
            <Badge variant={status === "ACTIVE" ? "default" : "secondary"}>
              {status === "TRIAL" && "Essai"}
              {status === "ACTIVE" && "Actif"}
              {status === "GRACE" && "Période de grâce"}
              {status === "READONLY" && "Lecture seule"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-medium text-lg">{plan?.name || "Starter"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unités</p>
              <p className="font-medium text-lg">{company._count.units || 0} / {plan?.maxUnits || "∞"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Projets</p>
              <p className="font-medium text-lg">{totalProjects} / {plan?.maxProjects || "∞"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Membres</p>
              <p className="font-medium text-lg">{totalMembers} / {plan?.maxMembers || "∞"}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href={`/company/${companyId}/settings/billing`}>
              <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Gérer l&apos;abonnement
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Units List */}
      <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Unités</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez vos unités opérationnelles
              </p>
            </div>
            <Link href={`/company/${companyId}/units`}>
              <Button variant="outline" size="sm">
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {units.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune unité trouvée</p>
              <Link href={`/company/${companyId}/units`}>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une unité
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {units.slice(0, 6).map((unit) => (
                <Link key={unit.id} href={`/unite/${unit.id}`}>
                  <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{unit.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {unit._count.projects || 0} projets
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {unit._count.users || 0} membres · {unit._count.clients || 0} clients
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href={`/company/${companyId}/units`}>
          <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)] hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Gérer les unités</p>
                  <p className="text-sm text-muted-foreground">Ajouter ou modifier des unités</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/company/${companyId}/team`}>
          <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)] hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Équipe</p>
                  <p className="text-sm text-muted-foreground">Voir tous les membres</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/company/${companyId}/settings`}>
          <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)] hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Paramètres</p>
                  <p className="text-sm text-muted-foreground">Modifier les informations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
