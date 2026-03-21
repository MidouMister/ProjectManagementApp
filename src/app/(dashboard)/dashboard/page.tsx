import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardRedirectHub({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  const user = await currentUser();

  // 1. Unauthenticated -> Login
  if (!userId || !user) {
    redirect("/company/sign-in");
  }

  // Await search params to get native URL state
  const params = await searchParams;
  const tokenRaw = params.token || params.__clerk_ticket;
  const token = Array.isArray(tokenRaw) ? tokenRaw[0] : tokenRaw;

  const role = user.publicMetadata?.role as "OWNER" | "ADMIN" | "USER" | undefined;
  const companyId = user.publicMetadata?.companyId as string | undefined;
  const unitId = user.publicMetadata?.unitId as string | undefined;

  // 2. No company ID -> Onboarding
  if (!companyId) {
    // Keep passing the token if it exists
    const url = new URL("/onboarding", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    if (token) url.searchParams.set("token", token);
    redirect(url.toString().replace(url.origin, "")); // Relative redirect
  }

  // 3. User with Invitation Token -> Personal Workspace (InvitationProcessor intercepts)
  if (token) {
    redirect(`/dashboard?token=${token}`);
  }

  // 4. Role-based automated redirects
  if (role === "OWNER") {
    redirect(`/company/${companyId}`);
  }

  if (role === "ADMIN" && unitId) {
    redirect(`/unite/${unitId}`);
  }

  if (role === "ADMIN" && !unitId) {
    // Admin without a unit fallback
    redirect(`/company/${companyId}`);
  }

  if (role === "USER") {
    // Regular user personal workspace
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Espace Personnel</h1>
        <p className="text-muted-foreground">Bienvenue dans votre espace de travail. Les modules spécifiques seront bientôt disponibles.</p>
      </div>
    );
  }

  // Fallback catch-all
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-destructive">Erreur de routing</h1>
      <p className="text-muted-foreground mt-2">Votre rôle n&apos;a pas pu être déterminé. Veuillez contacter un administrateur.</p>
    </div>
  );
}
