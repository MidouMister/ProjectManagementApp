import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/10 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <span className="text-xl font-bold tracking-tight">PMA</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/company/sign-in">
            <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">Connexion</span>
          </Link>
          <Link href="/company/sign-up">
            <button className="px-4 py-2 bg-primary text-white rounded-btn text-sm font-semibold hover:opacity-90 transition-all shadow-md cursor-pointer">
              Essai Gratuit
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-linear-to-b from-background to-surface-container-low">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Nouvelle Version 16
          </div>
          
          <h1 className="text-display text-on-surface leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Optimisez vos projets avec la puissance de <span className="text-primary italic">PMA</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            La plateforme tout-en-un pour la gestion de projets, le suivi de production et la planification financière. Conçu pour les entreprises algériennes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link href="/company/sign-up">
              <button className="h-14 px-8 bg-primary text-white rounded-btn font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/25 cursor-pointer">
                Commencer l&apos;Essai Gratuit
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <div className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-on-surface transition-colors cursor-pointer">
              Découvrir les fonctionnalités
            </div>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-sm animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Multi-Unités
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Suivi Financier HT/TTC
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Gantt Interactif
            </div>
            <div className="sm:hidden md:flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Kanban & Tâches
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/10 bg-surface">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <div>© 2026 Project Management App. Tous droits réservés.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary transition-colors cursor-pointer">Conditions</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Confidentialité</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
