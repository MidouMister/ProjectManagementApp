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
    <div className="flex bg-background text-foreground min-h-screen font-sans selection:bg-primary/20 selection:text-primary overflow-hidden">
      {/* Sidebar - Desktop and Mobile (Sheet) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <InfoBar />
        <Navbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar bg-background">
          <div className="mx-auto max-w-content w-full h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
