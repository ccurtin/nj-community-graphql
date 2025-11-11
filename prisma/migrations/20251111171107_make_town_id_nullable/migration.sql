/*
  Warnings:

  - You are about to drop the column `county` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Resource` table. All the data in the column will be lost.
  - Made the column `countyId` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_countyId_fkey";

-- DropIndex
DROP INDEX "Resource_name_townId_key";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "county",
DROP COLUMN "state",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "appointmentRequired" DROP DEFAULT,
ALTER COLUMN "countyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
