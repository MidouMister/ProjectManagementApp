"use server";

import { prisma } from "@/lib/db";
import { createClerkClient } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { CacheTags } from "@/lib/cache";
import { Role, Result, CompanyInput, UnitInput } from "@/lib/types";
import { addDays } from "date-fns";
import { companySchema, unitSchema } from "@/lib/validators";

/**
 * Get all company members across all units with their unit info
 */
export async function getCompanyMembers(companyId: string) {
  return await prisma.user.findMany({
    where: { companyId },
    include: {
      unit: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

/**
 * Get all pending invitations for a company
 */
export async function getCompanyInvitations(companyId: string) {
  return await prisma.invitation.findMany({
    where: { companyId, status: "PENDING" },
    include: {
      unit: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

/**
 * Invite a new member to a unit
 */
export async function inviteMember(
  email: string,
  role: Role,
  companyId: string,
  unitId: string
): Promise<Result<{ id: string }>> {
  try {
    if (role === "OWNER") {
      return { success: false, error: "CANNOT_INVITE_OWNER" };
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && existingUser.companyId === companyId) {
      return { success: false, error: "USER_ALREADY_IN_COMPANY" };
    }

    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email: email.toLowerCase(),
        companyId,
        status: "PENDING",
      },
    });

    if (existingInvitation) {
      return { success: false, error: "INVITATION_ALREADY_SENT" };
    }

    const token = crypto.randomUUID();
    const invitation = await prisma.invitation.create({
      data: {
        email: email.toLowerCase(),
        role,
        companyId,
        unitId,
        token,
        expiresAt: addDays(new Date(), 7),
      },
    });

    revalidateTag(`company:${companyId}:invitations`, "max");
    return { success: true, data: { id: invitation.id } };
  } catch (error) {
    console.error("Error inviting member:", error);
    return { success: false, error: "INVITATION_FAILED" };
  }
}

/**
 * Cancel a pending invitation
 */
export async function cancelInvitation(id: string): Promise<Result<boolean>> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      select: { companyId: true, status: true },
    });

    if (!invitation) {
      return { success: false, error: "INVITATION_NOT_FOUND" };
    }

    if (invitation.status !== "PENDING") {
      return { success: false, error: "INVITATION_NOT_PENDING" };
    }

    await prisma.invitation.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    revalidateTag(`company:${invitation.companyId}:invitations`, "max");
    return { success: true, data: true };
  } catch (error) {
    console.error("Error canceling invitation:", error);
    return { success: false, error: "CANCEL_FAILED" };
  }
}

/**
 * Resend a pending invitation (regenerate token)
 */
export async function resendInvitation(id: string): Promise<Result<boolean>> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { id },
      select: { companyId: true, status: true },
    });

    if (!invitation) {
      return { success: false, error: "INVITATION_NOT_FOUND" };
    }

    if (invitation.status !== "PENDING") {
      return { success: false, error: "INVITATION_NOT_PENDING" };
    }

    const token = crypto.randomUUID();
    await prisma.invitation.update({
      where: { id },
      data: {
        token,
        expiresAt: addDays(new Date(), 7),
      },
    });

    revalidateTag(`company:${invitation.companyId}:invitations`, "max");
    return { success: true, data: true };
  } catch (error) {
    console.error("Error resending invitation:", error);
    return { success: false, error: "RESEND_FAILED" };
  }
}

/**
 * Remove a member from a unit (keep their data, remove access)
 */
export async function removeMember(userId: string, unitId: string): Promise<Result<boolean>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, companyId: true, unitId: true },
    });

    if (!user) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    if (user.role === "OWNER") {
      return { success: false, error: "CANNOT_REMOVE_OWNER" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { unitId: null },
    });

    if (user.companyId) {
      revalidateTag(`company:${user.companyId}:members`, "max");
      revalidateTag(`unit:${unitId}:members`, "max");
    }

    return { success: true, data: true };
  } catch (error) {
    console.error("Error removing member:", error);
    return { success: false, error: "REMOVE_FAILED" };
  }
}

/**
 * Get user authentication and profile data
 */
export async function getAuthUser(clerkId: string) {
  try {
    let targetClerkId = clerkId;
    
    if (clerkId === "current") {
      const { auth } = await import("@clerk/nextjs/server");
      const { userId } = await auth();
      if (!userId) return null;
      targetClerkId = userId;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: targetClerkId },
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
 * Get company details for dashboard/settings
 */
export async function getCompanyById(id: string) {
  return await prisma.company.findUnique({
    where: { id },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
      _count: {
        select: {
          units: true,
        },
      },
    },
  });
}

/**
 * Get all units for a company with metrics
 */
export async function getUnits(companyId: string) {
  return await prisma.unit.findMany({
    where: { companyId },
    include: {
      _count: {
        select: {
          projects: true,
          clients: true,
          users: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
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

    // 1. Transaction to update User, Invitation, and possibly Unit.adminId
    const result = await prisma.$transaction(async (tx) => {
      // Update user with role and unit
      const user = await tx.user.update({
        where: { clerkId },
        data: {
          role: invitation.role,
          companyId: invitation.companyId,
          unitId: invitation.unitId,
        },
      });

      // If role is ADMIN, set this user as the unit admin
      if (invitation.role === "ADMIN") {
        await tx.unit.update({
          where: { id: invitation.unitId },
          data: { adminId: user.id },
        });
      }

      // Mark invitation as accepted
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

    // 3. Revalidate cache
    revalidateTag(CacheTags.company(invitation.companyId), "max");
    revalidateTag(CacheTags.unit(invitation.unitId), "max");
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

    // 1. Validate Input (Server Side)
    const valResult = companySchema.safeParse(data);
    if (!valResult.success) {
      console.error("Server-side validation failed:", valResult.error.flatten().fieldErrors);
      return { success: false, error: "INVALID_INPUT_DATA" };
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
          NIF: data.NIF,
          RC: data.RC,
          NIS: data.NIS ?? null,
          AI: data.AI ?? null,
          formJur: data.formJur,
          sector: data.sector,
          wilaya: data.wilaya,
          address: data.address,
          phone: data.phone,
          email: data.email,
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
 * Check if fiscal identities are already in use
 */
/**
 * Check if fiscal identities are already in use
 */
export async function checkFiscalIdentities(identities: { nif?: string; rc?: string; nis?: string; ai?: string }): Promise<Result<boolean>> {
  try {
    const { nif, rc, nis, ai } = identities;
    
    // Check NIF
    if (nif) {
      const exists = await prisma.company.findFirst({ where: { NIF: nif } });
      if (exists) return { success: false, error: "NIF_EXISTS" };
    }
    
    // Check RC
    if (rc) {
      const exists = await prisma.company.findFirst({ where: { RC: rc } });
      if (exists) return { success: false, error: "RC_EXISTS" };
    }
    
    // Check NIS
    if (nis) {
      const exists = await prisma.company.findFirst({ where: { NIS: nis } });
      if (exists) return { success: false, error: "NIS_EXISTS" };
    }
    
    // Check AI
    if (ai) {
      const exists = await prisma.company.findFirst({ where: { AI: ai } });
      if (exists) return { success: false, error: "AI_EXISTS" };
    }
    
    return { success: true, data: false };
  } catch (error) {
    console.error("Error checking fiscal identities:", error);
    return { success: false, error: "VALIDATION_FAILED" };
  }
}

/**
 * Consolidate Onboarding - Multi-step transactional setup
 * 1. Create Company
 * 2. Create Unit
 * 3. Assign User as Owner
 * 4. Create Trial Subscription
 * 5. Create Invitations
 */
export async function consolidateOnboarding(
  clerkId: string,
  input: {
    company: CompanyInput;
    unit: UnitInput;
    invitations: Array<{ email: string; role: Role }>;
  }
): Promise<Result<{ companyId: string }>> {
  try {
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      // Lazy Create: If user not in DB (common in local dev), fetch from Clerk
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const clerkUser = await clerk.users.getUser(clerkId);
      
      if (!clerkUser) {
        return { success: false, error: "USER_NOT_FOUND" };
      }

      const name = [clerkUser.firstName, clerkUser.lastName]
        .filter(Boolean)
        .join(" ") || clerkUser.username || "Unknown";
      
      const email = clerkUser.emailAddresses[0]?.emailAddress || "unknown@example.com";

      user = await prisma.user.create({
        data: {
          clerkId,
          name,
          email,
          role: "USER",
        },
      });
    }

    // 1. Validate Input (Server Side)
    const companyVal = companySchema.safeParse(input.company);
    const unitVal = unitSchema.safeParse(input.unit);
    
    if (!companyVal.success || !unitVal.success) {
      console.error("Onboarding validation failed:", {
        company: !companyVal.success ? companyVal.error.flatten().fieldErrors : null,
        unit: !unitVal.success ? unitVal.error.flatten().fieldErrors : null
      });
      return { success: false, error: "INVALID_INPUT_DATA" };
    }

    if (user.companyId) {
      return { success: false, error: "ALREADY_HAS_COMPANY" };
    }

    let starterPlan = await prisma.plan.findFirst({
      where: { name: "Starter" },
    });

    if (!starterPlan) {
      // Create a default plan if it doesn't exist for test purposes
      starterPlan = await prisma.plan.create({
        data: {
          name: "Starter",
          priceDA: 0,
          maxUnits: 1,
          maxProjects: 3,
          maxTasksPerProject: 50,
          maxMembers: 5,
        }
      });
    }

    const now = new Date();
    const trialEnd = addDays(now, 60);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Company
      const company = await tx.company.create({
        data: {
          ...input.company,
          ownerId: user.id,
        },
      });

      // 2. Create the Unit with adminId: null (OWNER is company-wide, not bound to a unit)
      const unit = await tx.unit.create({
        data: {
          ...input.unit,
          companyId: company.id,
          // adminId is NOT set — unit can exist without admin until OWNER invites someone with ADMIN role
        },
      });

      // 3. Update User profile as OWNER (companyId set, unitId: null — OWNER is not bound to a unit)
      await tx.user.update({
        where: { id: user.id },
        data: {
          role: "OWNER",
          companyId: company.id,
          // unitId is NOT set — OWNER is company-wide, not unit-scoped
        },
      });

      // 4. Create Subscription
      await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: starterPlan.id,
          status: "TRIAL",
          startAt: now,
          endAt: trialEnd,
        },
      });

      // 5. Create Invitations
      if (input.invitations.length > 0) {
        for (const invitation of input.invitations) {
          const token = crypto.randomUUID();
          await tx.invitation.create({
            data: {
              companyId: company.id,
              unitId: unit.id,
              email: invitation.email,
              role: invitation.role,
              token,
              expiresAt: addDays(now, 7),
            },
          });
        }
      }

      return { companyId: company.id, unitId: unit.id };
    });

    // 6. Sync Clerk Data for OWNER (no unitId — OWNER is company-wide, not unit-scoped)
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerk.users.updateUser(clerkId, {
      publicMetadata: {
        role: "OWNER",
        companyId: result.companyId,
        // unitId is NOT included — OWNER is not bound to a unit
      },
    });

    // 7. Revalidate Cache
    revalidateTag(CacheTags.companies(), "max");
    revalidateTag(CacheTags.company(result.companyId), "max");
    revalidateTag(CacheTags.unit(result.unitId), "max");

    return { success: true, data: { companyId: result.companyId } };
  } catch (error) {
    console.error("Consolidated onboarding failed:", error);
    return { success: false, error: "ONBOARDING_FAILED" };
  }
}

/**
 * Update company details
 */
export async function updateCompany(id: string, data: Partial<CompanyInput>) {
  try {
    const updated = await prisma.company.update({
      where: { id },
      data,
    });
    revalidateTag(CacheTags.company(id), "max");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, error: "UPDATE_FAILED" };
  }
}

/**
 * Update unit details
 */
export async function updateUnit(id: string, data: Partial<UnitInput>) {
  try {
    const updated = await prisma.unit.update({
      where: { id },
      data,
    });
    revalidateTag(CacheTags.unit(id), "max");
    revalidateTag(CacheTags.companyUnits(updated.companyId), "max");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating unit:", error);
    return { success: false, error: "UPDATE_FAILED" };
  }
}

/**
 * Delete a unit (cascade to projects, tasks, clients)
 */
export async function deleteUnit(id: string) {
  try {
    const unit = await prisma.unit.findUnique({
      where: { id },
      select: { companyId: true },
    });

    if (!unit) {
      return { success: false, error: "UNIT_NOT_FOUND" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.task.deleteMany({
        where: {
          project: {
            unitId: id,
          },
        },
      });

      await tx.phase.deleteMany({
        where: {
          project: {
            unitId: id,
          },
        },
      });

      await tx.project.deleteMany({
        where: { unitId: id },
      });

      await tx.client.deleteMany({
        where: { unitId: id },
      });

      await tx.invitation.deleteMany({
        where: { unitId: id },
      });

      await tx.user.updateMany({
        where: { unitId: id },
        data: { unitId: null },
      });

      await tx.unit.delete({
        where: { id },
      });
    });

    revalidateTag(CacheTags.companyUnits(unit.companyId), "max");
    return { success: true, data: true };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return { success: false, error: "DELETE_FAILED" };
  }
}

/**
 * Delete a company and all related data (cascade delete)
 * OWNER only - must be company owner
 * 
 * Cascade Order:
 * 1. Notifications
 * 2. ActivityLogs
 * 3. TimeEntries
 * 4. TaskMentions
 * 5. TaskComments
 * 6. Tasks
 * 7. Productions
 * 8. Products
 * 9. GanttMarkers
 * 10. SubPhases
 * 11. Phases
 * 12. TeamMembers
 * 13. Teams
 * 14. Projects
 * 15. Clients
 * 16. Lanes
 * 17. Tags
 * 18. Invitations
 * 19. Users (except owner - cleared via SetNull)
 * 20. Units
 * 21. Subscriptions
 * 22. Company
 */
export async function deleteCompany(
  companyId: string,
  userId: string
): Promise<Result<boolean>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, companyId: true, clerkId: true },
    });

    if (!user) {
      return { success: false, error: "USER_NOT_FOUND" };
    }

    if (user.role !== "OWNER") {
      return { success: false, error: "NOT_COMPANY_OWNER" };
    }

    if (user.companyId !== companyId) {
      return { success: false, error: "NOT_COMPANY_OWNER" };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { ownerId: true },
    });

    if (!company) {
      return { success: false, error: "COMPANY_NOT_FOUND" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.notification.deleteMany({
        where: { companyId },
      });

      await tx.activityLog.deleteMany({
        where: { companyId },
      });

      await tx.timeEntry.deleteMany({
        where: { companyId },
      });

      await tx.taskMention.deleteMany({
        where: { companyId },
      });

      await tx.taskComment.deleteMany({
        where: { companyId },
      });

      await tx.task.deleteMany({
        where: { companyId },
      });

      const phases = await tx.phase.findMany({
        where: { project: { companyId } },
        select: { id: true },
      });
      
      for (const phase of phases) {
        await tx.production.deleteMany({
          where: { phaseId: phase.id },
        });
        await tx.product.deleteMany({
          where: { phaseId: phase.id },
        });
      }

      await tx.ganttMarker.deleteMany({
        where: { project: { companyId } },
      });

      await tx.subPhase.deleteMany({
        where: { phase: { project: { companyId } } },
      });

      await tx.phase.deleteMany({
        where: { project: { companyId } },
      });

      await tx.teamMember.deleteMany({
        where: { team: { project: { companyId } } },
      });

      await tx.team.deleteMany({
        where: { project: { companyId } },
      });

      await tx.project.deleteMany({
        where: { companyId },
      });

      await tx.client.deleteMany({
        where: { companyId },
      });

      await tx.lane.deleteMany({
        where: { companyId },
      });

      await tx.tag.deleteMany({
        where: { unit: { companyId } },
      });

      await tx.invitation.deleteMany({
        where: { companyId },
      });

      const nonOwnerUsers = await tx.user.findMany({
        where: { companyId, id: { not: userId } },
        select: { id: true, clerkId: true },
      });

      for (const nonOwner of nonOwnerUsers) {
        await tx.user.update({
          where: { id: nonOwner.id },
          data: {
            companyId: null,
            unitId: null,
            role: "USER",
          },
        });
      }

      await tx.unit.deleteMany({
        where: { companyId },
      });

      await tx.subscription.deleteMany({
        where: { companyId },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          companyId: null,
          unitId: null,
          role: "USER",
        },
      });

      await tx.company.delete({
        where: { id: companyId },
      });
    });

    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    await clerk.users.updateUser(user.clerkId, {
      publicMetadata: {
        role: "USER",
        companyId: null,
        unitId: null,
      },
    });

    revalidateTag(CacheTags.companies(), "max");
    revalidateTag(CacheTags.company(companyId), "max");

    return { success: true, data: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { success: false, error: "DELETE_FAILED" };
  }
}

