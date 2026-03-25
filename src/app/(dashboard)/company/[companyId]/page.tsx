import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import {
  Briefcase,
  Users2,
  TrendingUp,
  AlertTriangle,
  Building2,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  CircleDot,
  PauseCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatAmount, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ companyId: string }>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusConfig(status: ProjectStatus) {
  switch (status) {
    case "New":
      return {
        label: "Nouveau",
        icon: CircleDot,
        className: "bg-muted text-muted-foreground",
      };
    case "InProgress":
      return {
        label: "En cours",
        icon: TrendingUp,
        className: "bg-primary/10 text-primary dark:bg-primary/20",
      };
    case "Pause":
      return {
        label: "En pause",
        icon: PauseCircle,
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
    case "Complete":
      return {
        label: "Terminé",
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-600 dark:text-green-400",
      };
    default:
      return {
        label: status,
        icon: CircleDot,
        className: "bg-muted text-muted-foreground",
      };
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CompanyDashboardPage({ params }: PageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/company/sign-in");

  const { companyId } = await params;

  // Fetch company with all needed relations in one query
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      subscription: { include: { plan: true } },
      units: {
        include: {
          admin: { select: { id: true, name: true, email: true } },
          _count: {
            select: {
              projects: true,
              users: true,
              clients: true,
            },
          },
          projects: {
            select: {
              id: true,
              name: true,
              code: true,
              status: true,
              montantHT: true,
              montantTTC: true,
              progress: true,
              ods: true,
              client: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
        orderBy: { createdAt: "asc" },
      },
      users: {
        select: { id: true },
      },
      // Recent activity logs across the company
      activityLogs: {
        include: {
          user: { select: { name: true, clerkId: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      },
    },
  });

  if (!company) notFound();

  // ─── Computed KPIs ──────────────────────────────────────────────────────────

  const allProjects = company.units.flatMap((u) => u.projects);

  const totalProjects = company.units.reduce(
    (acc, u) => acc + u._count.projects,
    0
  );
  const activeProjects = allProjects.filter(
    (p) => p.status === "InProgress"
  ).length;
  const totalMembers = company.users.length;
  const totalUnits = company.units.length;

  // Total contract value across all projects
  const totalTTC = allProjects.reduce(
    (acc, p) => acc + Number(p.montantTTC),
    0
  );

  // Subscription info
  const sub = company.subscription;
  // eslint-disable-next-line react-hooks/purity -- Server component, Date.now is safe
  const now = Date.now();
  const daysRemaining = sub
    ? Math.max(
        0,
        Math.ceil(
          (new Date(sub.endAt).getTime() - now) / (1000 * 60 * 60 * 24)
        )
      )
    : null;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {`Vue d${String.fromCharCode(8217)}ensemble`}
          </p>
          <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-none">
            {company.name}
          </h1>
          <p className="text-[13px] text-muted-foreground mt-2">
            {company.sector} · {company.wilaya}
            {sub && (
              <span className="ml-3 inline-flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                    sub.status === "TRIAL" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    sub.status === "ACTIVE" && "bg-green-500/10 text-green-600 dark:text-green-400",
                    sub.status === "GRACE" && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
                    sub.status === "READONLY" && "bg-destructive/10 text-destructive",
                    sub.status === "SUSPENDED" && "bg-destructive/10 text-destructive",
                  )}
                >
                  {sub.status === "TRIAL" && `Essai — ${daysRemaining}j restants`}
                  {sub.status === "ACTIVE" && `Plan ${sub.plan.name}`}
                  {sub.status === "GRACE" && "Période de grâce"}
                  {sub.status === "READONLY" && "Lecture seule"}
                  {sub.status === "SUSPENDED" && "Suspendu"}
                </span>
              </span>
            )}
          </p>
        </div>

        <Link
          href={`/company/${companyId}/units/new`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nouvelle unité
        </Link>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Projets au total"
          value={String(totalProjects)}
          sub={`${activeProjects} en cours`}
          icon={Briefcase}
          accent="blue"
        />
        <KpiCard
          label="Valeur totale TTC"
          value={formatAmount(totalTTC)}
          sub="Contrats signés"
          icon={TrendingUp}
          accent="green"
        />
        <KpiCard
          label="Membres"
          value={String(totalMembers)}
          sub={`${totalUnits} unité${totalUnits > 1 ? "s" : ""}`}
          icon={Users2}
          accent="purple"
        />
        <KpiCard
          label="Projets en cours"
          value={String(activeProjects)}
          sub={`${totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0}% du total`}
          icon={CircleDot}
          accent="orange"
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Units grid — takes 2/3 */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">
              Unités opérationnelles
              <span className="ml-2 text-[12px] font-normal text-muted-foreground">
                ({totalUnits})
              </span>
            </h2>
            <Link
              href={`/company/${companyId}/units`}
              className="text-[12px] font-medium text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {company.units.length === 0 ? (
            <EmptyUnits companyId={companyId} />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {company.units.map((unit) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity feed — takes 1/3 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-foreground">
              Activité récente
            </h2>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {company.activityLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Clock className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-[13px] font-medium text-muted-foreground">
                  Aucune activité
                </p>
                <p className="text-[12px] text-muted-foreground/70 mt-1">
                  Les actions apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {company.activityLogs.map((log) => (
                  <div key={log.id} className="px-4 py-3 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-primary">
                        {log.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] text-foreground leading-snug">
                        <span className="font-semibold">{log.user.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {formatActivityAction(log.action, log.entityType)}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: "blue" | "green" | "purple" | "orange";
}

function KpiCard({ label, value, sub, icon: Icon, accent }: KpiCardProps) {
  const accentStyles = {
    blue:   { bg: "bg-primary/10", text: "text-primary" },
    green:  { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  };

  const style = accentStyles[accent];

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", style.bg)}>
          <Icon className={cn("w-4 h-4", style.text)} />
        </div>
      </div>
      <div>
        <p className="text-[26px] font-bold text-foreground leading-none tracking-tight">
          {value}
        </p>
        <p className="text-[12px] text-muted-foreground mt-1.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Unit card ───────────────────────────────────────────────────────────────

interface UnitCardProps {
  unit: {
    id: string;
    name: string;
    email: string;
    phone: string;
    admin: { name: string; email: string } | null;
    _count: { projects: number; users: number; clients: number };
    projects: Array<{
      id: string;
      name: string;
      code: string;
      status: string;
      montantTTC: unknown;
      progress: number;
      ods: Date;
      client: { name: string };
    }>;
  };
}

function UnitCard({ unit }: UnitCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Unit header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-foreground">
              {unit.name}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {unit.admin ? `Admin : ${unit.admin.name}` : "Aucun administrateur assigné"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick stats */}
          <div className="hidden sm:flex items-center gap-4">
            <Stat value={unit._count.projects} label="Projets" />
            <Stat value={unit._count.users} label="Membres" />
            <Stat value={unit._count.clients} label="Clients" />
          </div>

          <Link
            href={`/unite/${unit.id}`}
            className="flex items-center gap-1.5 text-[12px] font-medium text-primary hover:underline"
          >
            Ouvrir <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent projects */}
      {unit.projects.length > 0 ? (
        <div className="divide-y divide-border">
          {unit.projects.map((project) => {
            const statusCfg = getStatusConfig(project.status as ProjectStatus);
            const StatusIcon = statusCfg.icon;

            return (
              <Link
                key={project.id}
                href={`/unite/${unit.id}/projects/${project.id}`}
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors group"
              >
                {/* Project code */}
                <span className="text-[11px] font-mono font-bold text-muted-foreground w-16 shrink-0">
                  {project.code}
                </span>

                {/* Project name + client */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {project.client.name}
                  </p>
                </div>

                {/* Status pill */}
                <span
                  className={cn(
                    "hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0",
                    statusCfg.className
                  )}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusCfg.label}
                </span>

                {/* Progress bar */}
                <div className="hidden md:flex items-center gap-2 w-24 shrink-0">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(100, project.progress)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground w-8 text-right">
                    {Math.round(project.progress)}%
                  </span>
                </div>

                {/* Amount */}
                <span className="hidden lg:block text-[12px] font-semibold text-foreground shrink-0 text-right w-32">
                  {formatAmount(Number(project.montantTTC))}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-3 px-5 py-4 text-[13px] text-muted-foreground">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Aucun projet dans cette unité
        </div>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="text-[15px] font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

function EmptyUnits({ companyId }: { companyId: string }) {
  return (
    <div className="bg-card rounded-xl border border-border flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
        <Building2 className="w-6 h-6 text-primary" />
      </div>
      <p className="text-[14px] font-semibold text-foreground mb-1">
        Aucune unité opérationnelle
      </p>
      <p className="text-[13px] text-muted-foreground mb-5 max-w-xs">
        Créez votre première unité pour commencer à gérer vos projets et équipes.
      </p>
      <Link
        href={`/company/${companyId}/units/new`}
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        Créer une unité
      </Link>
    </div>
  );
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function formatActivityAction(action: string, entityType: string): string {
  const entityLabels: Record<string, string> = {
    project: "un projet",
    phase: "une phase",
    client: "un client",
    task: "une tâche",
    unit: "une unité",
    member: "un membre",
    invitation: "une invitation",
  };

  const actionLabels: Record<string, string> = {
    create: "a créé",
    update: "a modifié",
    delete: "a supprimé",
    invite: "a invité",
    accept: "a accepté",
  };

  const entityLabel = entityLabels[entityType.toLowerCase()] ?? entityType;
  const actionLabel = actionLabels[action.toLowerCase()] ?? action;

  return `${actionLabel} ${entityLabel}`;
}
