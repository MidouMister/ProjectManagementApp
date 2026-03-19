// PMA Database Seed
// Seeds initial Plan data for subscriptions

import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  // Seed Plans based on PMA PRD specifications
  const plansData = [
    {
      name: "Starter",
      maxUnits: 1,
      maxProjects: 5,
      maxTasksPerProject: 20,
      maxMembers: 10,
      priceDA: 0,
    },
    {
      name: "Pro",
      maxUnits: 5,
      maxProjects: 30,
      maxTasksPerProject: 200,
      maxMembers: 50,
      priceDA: 50000,
    },
    {
      name: "Premium",
      maxUnits: null, // Unlimited
      maxProjects: null, // Unlimited
      maxTasksPerProject: null, // Unlimited
      maxMembers: null, // Unlimited
      priceDA: 150000,
    },
  ]

  for (const p of plansData) {
    const plan = await prisma.plan.create({
      data: p,
    })
    console.log(`✅ Created plan: ${plan.name} (${plan.id})`)
  }

  console.log("✅ Seeding complete!")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
