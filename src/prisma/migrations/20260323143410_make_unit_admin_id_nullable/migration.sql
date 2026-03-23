-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_adminId_fkey";

-- AlterTable
ALTER TABLE "Unit" ALTER COLUMN "adminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
