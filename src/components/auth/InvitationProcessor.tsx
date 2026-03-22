"use client";

import { Suspense } from "react";
import { InvitationProcessorClient } from "./InvitationProcessorClient";

/**
 * InvitationProcessor wrapped in Suspense for useSearchParams()
 * This is required in Next.js 16 when using useSearchParams in client components.
 */
export function InvitationProcessor() {
  return (
    <Suspense fallback={null}>
      <InvitationProcessorClient />
    </Suspense>
  );
}
