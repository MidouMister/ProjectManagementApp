import { ClerkProvider } from '@clerk/nextjs'
import { Geist_Mono, DM_Sans } from "next/font/google"
import { Toaster } from "sonner"
import { Provider as JotaiProvider } from "jotai"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { InvitationProcessor } from "@/components/auth/InvitationProcessor";
import "@/app/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body
          className={cn(
            "antialiased font-sans",
            fontMono.variable,
            dmSans.variable
          )}
        >
          <JotaiProvider>
            <ThemeProvider>
              {children}
              <InvitationProcessor />
            </ThemeProvider>
          </JotaiProvider>
          <Toaster 
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              className: "font-sans",
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  )
}
