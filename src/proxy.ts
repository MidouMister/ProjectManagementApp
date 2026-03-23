import { Role } from "@/lib/types";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Explicitly type the Clerk JWT claims for our application
interface ClerkCustomClaims {
  metadata: {
    role?: Role;
    companyId?: string;
    unitId?: string;
  };
}

const isPublicRoute = createRouteMatcher([
  "/",
  "/company/sign-in(.*)",
  "/company/sign-up(.*)",
  "/api/webhooks/clerk",
  "/api/uploadthing(.*)", // Added for Uploadthing
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const claims = sessionClaims as unknown as ClerkCustomClaims;

  // 1. If not logged in and route is not public, protect it
  if (!userId && !isPublicRoute(req)) {
    await auth.protect();
    return;
  }

  // 2. If logged in, handle organizational redirects
  if (userId) {
    const role = claims?.metadata?.role;
    const companyId = claims?.metadata?.companyId;
    const unitId = claims?.metadata?.unitId;

    const url = new URL(req.url);

    // Skip redirect if already on sign-in/up routes
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // A. Onboarding Check: If no company and not on onboarding, redirect to /onboarding
    // Exception: Allow access to /company/:id routes (user may have just completed onboarding)
    if (!companyId && url.pathname !== "/onboarding" && !url.pathname.match(/^\/company\/[^/]+$/)) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // B. Role-Based Redirect Hub at /dashboard
    if (url.pathname === "/dashboard") {
      if (role === Role.OWNER) {
        return NextResponse.redirect(new URL(`/company/${companyId}`, req.url));
      }
      if (role === Role.ADMIN && unitId) {
        return NextResponse.redirect(new URL(`/unite/${unitId}`, req.url));
      }
      // Default to USER dashboard (handled by the page itself)
      return NextResponse.next(); 
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|ttf|woff2?)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
