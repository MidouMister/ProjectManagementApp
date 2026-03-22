import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { InfoBar } from "@/components/layout/InfoBar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/company/sign-in");
  }

  return (
    <div className="flex bg-background text-foreground min-h-screen font-sans antialiased overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <InfoBar />
        <Navbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-surface-container-low">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-content w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
