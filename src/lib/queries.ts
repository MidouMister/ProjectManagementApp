import { prisma } from "@/lib/db";
import { createClerkClient } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { CacheTags } from "@/lib/cache";

/**
 * Get user authentication and profile data
 */
export async function getAuthUser(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching auth user:", error);
    return null;
  }
}

/**
 * Check if a user has a company
 */
export async function hasCompany(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { companyId: true },
  });
  return !!user?.companyId;
}

/**
 * Find invitation by token
 */
export async function getInvitationByToken(token: string) {
  return await prisma.invitation.findUnique({
    where: { token, status: "PENDING" },
    include: {
      company: { select: { id: true, name: true } },
      unit: { select: { id: true, name: true } },
    },
  });
}

/**
 * Accept an invitation
 * 1. Update User DB record
 * 2. Update Clerk publicMetadata
 * 3. Update Invitation status
 */
export async function acceptInvitation(clerkId: string, token: string) {
  try {
    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      return { success: false, error: "INVITATION_NOT_FOUND" };
    }

    if (new Date() > invitation.expiresAt) {
      return { success: false, error: "INVITATION_EXPIRED" };
    }

    // 1. Transaction to update User and Invitation
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { clerkId },
        data: {
          role: invitation.role,
          companyId: invitation.companyId,
          unitId: invitation.unitId,
        },
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      return user;
    });

    // 2. Sync to Clerk metadata for middleware redirects
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerk.users.updateUser(clerkId, {
      publicMetadata: {
        role: invitation.role,
        companyId: invitation.companyId,
        unitId: invitation.unitId,
      },
    });

    revalidateTag(CacheTags.unitMembers(invitation.unitId), "max");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return { success: false, error: "ACCEPTANCE_FAILED" };
  }
}
