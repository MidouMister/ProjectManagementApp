import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1E3A8A]" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A] via-[#1a3a6e] to-[#00236f]" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="w-full max-w-md text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Project Management
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Gérez vos projets de construction avec précision et efficacité.
              Suivez chaque phase, chaque budget, chaque détail.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs text-white/70 uppercase tracking-wider">Projets</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-xs text-white/70 uppercase tracking-wider">Succès</div>
              </div>
              <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs text-white/70 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full max-w-md bg-white shadow-card rounded-xl border border-[#E8E7E5]",
              headerTitle: "text-xl font-bold tracking-tight text-[#111111]",
              headerSubtitle: "text-sm text-[#6B7280]",
              footerActionLink: "text-[#1E3A8A] font-bold hover:opacity-80",
              formButtonPrimary: "bg-gradient-to-r from-[#1E3A8A] to-[#00236f] hover:opacity-90 h-11 text-sm font-bold uppercase tracking-wider rounded-lg text-white w-full",
              formFieldInput: "bg-[#F9FAFB] h-10 rounded-lg px-4 border border-[#E5E7EB] focus:border-[#1E3A8A] focus:ring-0 transition-colors",
              formFieldLabel: "text-xs font-bold uppercase tracking-widest text-[#6B7280] mb-1",
              socialButtonsBlockButton: "h-11 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#111111] font-medium",
              socialButtonsBlockButtonText: "text-[#111111]",
              dividerLine: "bg-[#E5E7EB]",
              dividerText: "text-xs text-[#6B7280]",
              formFieldWarning: "text-[#D97706] text-xs",
              formFieldError: "text-[#DC2626] text-xs",
              otpCodeFieldInput: "bg-white border border-[#E5E7EB] rounded-lg focus:border-[#1E3A8A]",
            },
          }}
        />
      </div>
    </div>
  );
}
