import { getAuthUser, getCompanyById, getCompanyMembers, getCompanyInvitations, getUnits, inviteMember, cancelInvitation, resendInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus, Mail, X, RefreshCw, ArrowLeft, Crown, Shield, User } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { Role } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

interface MemberWithUnit {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  unit: { id: string; name: string } | null;
  createdAt: Date;
}

interface InvitationWithUnit {
  id: string;
  email: string;
  role: Role;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  unit: { id: string; name: string } | null;
}

function getRoleBadgeVariant(role: Role) {
  switch (role) {
    case "OWNER":
      return "default";
    case "ADMIN":
      return "secondary";
    default:
      return "outline";
  }
}

function getRoleLabel(role: Role) {
  switch (role) {
    case "OWNER":
      return "Propriétaire";
    case "ADMIN":
      return "Administrateur";
    default:
      return "Utilisateur";
  }
}

function getInitials(name: string | null, email: string) {
  if (name) {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  return email.substring(0, 2).toUpperCase();
}

export default async function CompanyTeamPage({
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

  const members = await getCompanyMembers(companyId);
  const invitations = await getCompanyInvitations(companyId);
  const units = await getUnits(companyId);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/company/${companyId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Équipe de l&apos;entreprise</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les membres et les invitations de {company.name}
          </p>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="members" className="gap-2">
              <Users className="h-4 w-4" />
              Membres
              <Badge variant="secondary" className="ml-1">
                {members.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2">
              <Mail className="h-4 w-4" />
              Invitations en attente
              {invitations.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {invitations.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <InviteMemberDialog
            units={units}
            companyId={companyId}
          />
        </div>

        <TabsContent value="members" className="space-y-4">
          <MembersTable members={members} />
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4">
          <PendingInvitationsList
            invitations={invitations}
            companyId={companyId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MembersTable({ members }: { members: MemberWithUnit[] }) {
  if (members.length === 0) {
    return (
      <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Aucun membre</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Invitez des membres pour rejoindre votre entreprise
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Tous les membres</CardTitle>
          <p className="text-sm text-muted-foreground">
            {members.length} membre{members.length !== 1 ? "s" : ""}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Membre</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Date d&apos;ajout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs">
                        {getInitials(member.name, member.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name || "Sans nom"}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(member.role)} className="gap-1">
                    {member.role === "OWNER" && <Crown className="h-3 w-3" />}
                    {member.role === "ADMIN" && <Shield className="h-3 w-3" />}
                    {member.role === "USER" && <User className="h-3 w-3" />}
                    {getRoleLabel(member.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {member.unit?.name || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatRelative(member.createdAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PendingInvitationsList({
  invitations,
  companyId,
}: {
  invitations: InvitationWithUnit[];
  companyId: string;
}) {
  if (invitations.length === 0) {
    return (
      <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Mail className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Aucune invitation en attente</h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Les invitations en attente apparaîtront ici
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-[0_4px_6px_-1px_rgba(13,12,34,0.04),0_10px_15px_-3px_rgba(13,12,34,0.08)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Invitations en attente</CardTitle>
          <p className="text-sm text-muted-foreground">
            {invitations.length} invitation{invitations.length !== 1 ? "s" : ""}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Envoyée</TableHead>
              <TableHead>Expire</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{invitation.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(invitation.role as Role)} className="gap-1">
                    {invitation.role === "ADMIN" && <Shield className="h-3 w-3" />}
                    {invitation.role === "USER" && <User className="h-3 w-3" />}
                    {getRoleLabel(invitation.role as Role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {invitation.unit?.name || (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatRelative(invitation.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatRelative(invitation.expiresAt)}
                  </span>
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <ResendInvitationButton invitationId={invitation.id} companyId={companyId} />
                    <CancelInvitationButton invitationId={invitation.id} invitationEmail={invitation.email} companyId={companyId} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InviteMemberDialog({
  units,
  companyId,
}: {
  units: { id: string; name: string }[];
  companyId: string;
}) {
  return (
    <Dialog>
      <Button className="bg-[#111111] hover:bg-[#111111]/90">
        <UserPlus className="mr-2 h-4 w-4" />
        Inviter un membre
      </Button>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Inviter un membre</DialogTitle>
          <DialogDescription>
            Envoyez une invitation par email pour rejoindre votre entreprise
          </DialogDescription>
        </DialogHeader>
        <form action={async (formData) => {
          "use server";
          const email = formData.get("email") as string;
          const role = formData.get("role") as Role;
          const unitId = formData.get("unitId") as string;

          const result = await inviteMember(email, role, companyId, unitId);

          if (result.success) {
            revalidatePath(`/company/${companyId}/team`);
          }
        }} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Adresse email</label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@email.dz"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">Rôle</label>
            <Select name="role" required defaultValue="USER">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Utilisateur</SelectItem>
                <SelectItem value="ADMIN">Administrateur</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Le propriétaire ne peut pas être invité
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="unitId" className="text-sm font-medium">Unité</label>
            <Select name="unitId" required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-[#111111] hover:bg-[#111111]/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Envoyer l&apos;invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CancelInvitationButton({
  invitationId,
  invitationEmail,
  companyId,
}: {
  invitationId: string;
  invitationEmail: string;
  companyId: string;
}) {
  async function handleCancel() {
    "use server";
    await cancelInvitation(invitationId);
    revalidatePath(`/company/${companyId}/team`);
  }

  return (
    <AlertDialog>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600">
        <X className="h-4 w-4" />
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Annuler l&apos;invitation</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir annuler l&apos;invitation envoyée à {invitationEmail} ? Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <form action={handleCancel}>
            <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
              Confirmer l&apos;annulation
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ResendInvitationButton({
  invitationId,
  companyId,
}: {
  invitationId: string;
  companyId: string;
}) {
  async function handleResend() {
    "use server";
    await resendInvitation(invitationId);
    revalidatePath(`/company/${companyId}/team`);
  }

  return (
    <form action={handleResend}>
      <Button variant="ghost" size="icon" className="h-8 w-8" title="Renvoyer l'invitation">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </form>
  );
}
