"use server";

import { prisma } from "@/lib/db";
import { createClerkClient } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { CacheTags } from "@/lib/cache";
import { Role, Result, CompanyInput, UnitInput } from "@/lib/types";
import { addDays } from "date-fns";

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

/**
 * Get unread notifications count (M15 Placeholder)
 */
export async function getUnreadCount(): Promise<number> {
  // TODO: Implement actual query in M15
  return 0;
}

/**
 * Get the default unit for a company (first unit created during onboarding)
 */
export async function getCompanyUnit(companyId: string) {
  return await prisma.unit.findFirst({
    where: { companyId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Create Company - Onboarding Step 1
 * Creates company, assigns OWNER role, creates default unit and trial subscription
 */
export async function createCompany(
  clerkId: string,
  data: CompanyInput
): Promise<Result<{ id: string }>> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    if (user.companyId) {
      return { success: false, error: "ALREADY_HAS_COMPANY" };
    }

    const starterPlan = await prisma.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!starterPlan) {
      return { success: false, error: "PLAN_NOT_FOUND" };
    }

    const now = new Date();
    const trialEnd = addDays(now, 60);

    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: data.name,
          ownerId: user.id,
          logo: data.logo ?? null,
          NIF: data.NIF ?? null,
          formJur: data.formJur ?? null,
          sector: data.sector ?? null,
          wilaya: data.wilaya ?? null,
          address: data.address ?? null,
          phone: data.phone ?? null,
          email: data.email ?? null,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          role: "OWNER",
          companyId: company.id,
        },
      });

      const unit = await tx.unit.create({
        data: {
          companyId: company.id,
          adminId: user.id,
          name: "Principal",
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          logo: data.logo ?? null,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { unitId: unit.id },
      });

      await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: starterPlan.id,
          status: "TRIAL",
          startAt: now,
          endAt: trialEnd,
        },
      });

      return { companyId: company.id, unitId: unit.id };
    });

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerk.users.updateUser(clerkId, {
      publicMetadata: {
        role: "OWNER",
        companyId: result.companyId,
        unitId: result.unitId,
      },
    });

    revalidateTag(CacheTags.companies(), "max");
    revalidateTag(CacheTags.company(result.companyId), "max");
    revalidateTag(CacheTags.companyUnits(result.companyId), "max");
    revalidateTag(CacheTags.unit(result.unitId), "max");

    return { success: true, data: { id: result.companyId } };
  } catch (error) {
    console.error("Error creating company:", error);
    return { success: false, error: "COMPANY_CREATION_FAILED" };
  }
}

/**
 * Create Unit - Onboarding Step 2
 * Creates a new unit and assigns admin to it
 */
export async function createUnit(
  data: UnitInput,
  companyId: string,
  adminId: string
): Promise<Result<{ id: string }>> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { companyId },
      include: { plan: true },
    });

    if (!subscription) {
      return { success: false, error: "SUBSCRIPTION_NOT_FOUND" };
    }

    const maxUnits = subscription.plan.maxUnits;
    if (maxUnits !== null) {
      const unitCount = await prisma.unit.count({
        where: { companyId },
      });

      if (unitCount >= maxUnits) {
        return { success: false, error: "PLAN_LIMIT_EXCEEDED" };
      }
    }

    const unit = await prisma.$transaction(async (tx) => {
      const newUnit = await tx.unit.create({
        data: {
          companyId,
          adminId,
          name: data.name,
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
        },
      });

      const admin = await tx.user.findUnique({
        where: { id: adminId },
      });

      if (admin && !admin.unitId) {
        await tx.user.update({
          where: { id: adminId },
          data: { unitId: newUnit.id },
        });
      }

      return newUnit;
    });

    revalidateTag(CacheTags.companyUnits(companyId), "max");
    revalidateTag(CacheTags.unit(unit.id), "max");

    return { success: true, data: { id: unit.id } };
  } catch (error) {
    console.error("Error creating unit:", error);
    return { success: false, error: "UNIT_CREATION_FAILED" };
  }
}

/**
 * Invite Member - Onboarding Step 3
 * Creates an invitation with token for email-based acceptance
 */
export async function inviteMember(
  email: string,
  role: Role,
  unitId: string,
  companyId: string
): Promise<Result<{ id: string; token: string }>> {
  try {
    if (role === "OWNER") {
      return { success: false, error: "INVALID_ROLE" };
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        unitId,
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      return { success: false, error: "DUPLICATE_INVITATION" };
    }

    const subscription = await prisma.subscription.findUnique({
      where: { companyId },
      include: { plan: true },
    });

    if (!subscription) {
      return { success: false, error: "SUBSCRIPTION_NOT_FOUND" };
    }

    const maxMembers = subscription.plan.maxMembers;
    if (maxMembers !== null) {
      const memberCount = await prisma.user.count({
        where: { companyId },
      });

      if (memberCount >= maxMembers) {
        return { success: false, error: "PLAN_LIMIT_EXCEEDED" };
      }
    }

    const token = crypto.randomUUID();
    const expiresAt = addDays(new Date(), 7);

    const invitation = await prisma.invitation.create({
      data: {
        companyId,
        unitId,
        email,
        role,
        token,
        expiresAt,
      },
    });

    revalidateTag(CacheTags.unitMembers(unitId), "max");

    return { success: true, data: { id: invitation.id, token: invitation.token } };
  } catch (error) {
    console.error("Error inviting member:", error);
    return { success: false, error: "INVITATION_FAILED" };
  }
}
