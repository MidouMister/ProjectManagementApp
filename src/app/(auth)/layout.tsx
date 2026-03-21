import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#ECEAE8]">
      {/* Background patterns for a premium "Project Planning" feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#111 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase">PMA</h1>
          <p className="text-sm text-muted-foreground mt-2">Gestion de Projets & Production</p>
        </div>
        {children}
        
        <div className="mt-8 text-center text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-50">
          Système Intégré de Pilotage
        </div>
      </div>
    </div>
  );
}