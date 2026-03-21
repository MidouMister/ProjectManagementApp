import { SignUp } from "@clerk/nextjs";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function SignUpPage(props: Props) {
  const searchParams = await props.searchParams;
  const rawToken = searchParams.token || searchParams.__clerk_ticket;
  const tokenStr = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const redirectUrl = tokenStr ? `/dashboard?token=${tokenStr}` : "/dashboard";

  return (
    <SignUp
      fallbackRedirectUrl={redirectUrl}
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "w-full max-w-md bg-white border border-[#E8E7E5] shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[14px]",
          headerTitle: "text-xl font-bold tracking-tight text-[#111111]",
          headerSubtitle: "text-sm text-[#666666]",
          footerActionLink: "text-[#111111] font-bold hover:opacity-80 transition-opacity",
          formButtonPrimary: "bg-[#111111] hover:bg-[#111111]/90 h-11 text-sm font-bold uppercase tracking-wider rounded-[8px]",
          formFieldInput: "bg-white border-[#E8E7E5] h-10 rounded-[8px] focus:border-[#111111] focus:ring-0 transition-colors",
          formFieldLabel: "text-xs font-bold uppercase tracking-widest text-[#666666] mb-1",
          dividerLine: "bg-[#E8E7E5]",
          dividerText: "text-xs font-medium text-[#999999]",
          socialButtonsBlockButton: "border-[#E8E7E5] hover:bg-[#F9F9F9] h-11 rounded-[8px] text-sm font-medium",
        },
      }}
    />
  );
}