"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showSocialButtons?: boolean;
  onSocialSignIn?: (provider: "google" | "github") => void;
  isLoading?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex bg-[#ECEAE8]">
      {/* LEFT SIDE - Branding (40%) - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23111827' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Abstract Architecture Pattern */}
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 400 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="buildingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00236f" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#1E3A8A" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00236f" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            
            {/* Building silhouettes */}
            <rect x="50" y="200" width="80" height="600" fill="url(#buildingGrad)" rx="4" />
            <rect x="150" y="150" width="100" height="650" fill="url(#buildingGrad)" rx="4" />
            <rect x="270" y="250" width="70" height="550" fill="url(#buildingGrad)" rx="4" />
            <rect x="360" y="180" width="60" height="620" fill="url(#buildingGrad)" rx="4" />
            
            {/* Window accents */}
            <g opacity="0.3">
              <rect x="60" y="220" width="15" height="20" fill="white" rx="2" />
              <rect x="85" y="220" width="15" height="20" fill="white" rx="2" />
              <rect x="60" y="260" width="15" height="20" fill="white" rx="2" />
              <rect x="85" y="260" width="15" height="20" fill="white" rx="2" />
              <rect x="60" y="300" width="15" height="20" fill="white" rx="2" />
              <rect x="85" y="300" width="15" height="20" fill="white" rx="2" />
              
              <rect x="160" y="170" width="20" height="25" fill="white" rx="2" />
              <rect x="190" y="170" width="20" height="25" fill="white" rx="2" />
              <rect x="220" y="170" width="20" height="25" fill="white" rx="2" />
              <rect x="160" y="210" width="20" height="25" fill="white" rx="2" />
              <rect x="190" y="210" width="20" height="25" fill="white" rx="2" />
              <rect x="220" y="210" width="20" height="25" fill="white" rx="2" />
            </g>
          </svg>
        </div>
        
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(30, 58, 138, 0.85) 0%, rgba(0, 35, 111, 0.92) 100%)" }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4M5 21V10.85M19 21V10.85M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
              </svg>
            </div>
            <span className="text-white/80 text-sm font-medium tracking-wider uppercase">PMA</span>
          </div>
          
          {/* Center content */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                Zenith Precision Engineering
              </h1>
              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Système Intégré de Gestion de Projets & Production
              </p>
            </div>
            
            {/* Stats/Features */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Projets</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Réussite</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Support</div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Zenith Precision Engineering
          </div>
        </div>
      </div>
      
      {/* RIGHT SIDE - Form (60%) */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#00236f] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111111]">PMA</span>
          </div>
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[#111111]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-[#666666]">{subtitle}</p>
            )}
          </div>
          
          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

export function AuthDivider({ text }: { text?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[#E8E7E5]" />
      </div>
      <div className="relative flex justify-center text-xs">
        {text && (
          <span className="px-3 bg-[#ECEAE8] text-[#999999] font-medium uppercase tracking-wider">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

interface AuthSocialButtonProps {
  provider: "google" | "github" | "microsoft";
  onClick?: () => void;
  isLoading?: boolean;
}

export function AuthSocialButton({ provider, onClick, isLoading }: AuthSocialButtonProps) {
  const icons = {
    google: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    ),
    github: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    microsoft: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF" />
        <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900" />
        <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022" />
        <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00" />
      </svg>
    ),
  };

  const labels = {
    google: "Continuer avec Google",
    github: "Continuer avec GitHub",
    microsoft: "Continuer avec Microsoft",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[#E8E7E5] rounded-lg text-sm font-medium text-[#111111] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-[#666666]" />
      ) : (
        icons[provider]
      )}
      <span>{labels[provider]}</span>
    </button>
  );
}

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, className, ...props }: AuthInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-[#666666]">
        {label}
      </label>
      <input
        className={cn(
          "w-full bg-[oklch(0.951_0.004_255)] rounded-lg px-4 py-3 text-sm text-[#111111] placeholder:text-[#999999] border border-transparent transition-colors",
          "focus:outline-none focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]/10",
          error && "border-destructive focus:border-destructive focus:ring-destructive/10",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function AuthButton({ variant = "primary", isLoading, children, className, disabled, ...props }: AuthButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-[#1E3A8A] to-[#00236f] hover:from-[#1E3A8A]/90 hover:to-[#00236f]/90 text-white shadow-lg shadow-[#1E3A8A]/20",
    secondary: "bg-[oklch(0.95_0.005_255)] text-[oklch(0.2_0.01_255)] hover:bg-[oklch(0.932_0.003_255)] border border-[#E8E7E5]",
    outline: "bg-transparent border border-[#E8E7E5] text-[#111111] hover:bg-[#F9F9F9]",
  };

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

interface AuthLinkProps {
  href: string;
  children: React.ReactNode;
  label?: string;
}

export function AuthLink({ href, children, label }: AuthLinkProps) {
  return (
    <p className="text-sm text-center text-[#666666]">
      {label && <span>{label} </span>}
      <a
        href={href}
        className="font-bold text-[#111111] hover:opacity-80 transition-opacity underline-offset-4 hover:underline"
      >
        {children}
      </a>
    </p>
  );
}
