import { NextRequest } from "next/server";

export function getTicketFromUrl(request: NextRequest): string | null {
  const { searchParams } = new URL(request.url);
  return searchParams.get("ticket");
}