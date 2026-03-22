import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth | PMA",
  description: "Authentication pages",
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
