/*
  Warnings:

  - You are about to drop the column `logo` on the `Unit` table. All the data in the column will be lost.
  - Added the required column `RC` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "AI" TEXT,
ADD COLUMN     "NIS" TEXT,
ADD COLUMN     "RC" TEXT NOT NULL,
ALTER COLUMN "logo" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Unit" DROP COLUMN "logo";
