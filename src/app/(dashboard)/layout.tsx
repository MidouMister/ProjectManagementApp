import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { InfoBar } from "@/components/layout/InfoBar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser, getCompanyById, getUnits } from "@/lib/queries";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/company/sign-in");
  }

  // Fetch auth user and company data for sidebar
  const authUser = await getAuthUser(userId);
  const companyId = authUser?.companyId;
  
  let companyData = null;
  let units: Array<{ id: string; name: string }> = [];
  
  if (companyId) {
    companyData = await getCompanyById(companyId);
    const allUnits = await getUnits(companyId);
    units = allUnits.map(u => ({ id: u.id, name: u.name }));
  }

  return (
    <div className="flex h-screen bg-background font-sans antialiased overflow-hidden">
      {/* Sidebar — with company info */}
      <Sidebar
        companyLogo={companyData?.logo}
        companyName={companyData?.name}
        units={units}
        currentUnitId={authUser?.unitId}
      />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <InfoBar />
        <Navbar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
