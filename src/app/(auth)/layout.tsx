import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentification | PMA",
  description: "Pages d'authentification",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {children}
    </div>
  );
}
