/*
  Warnings:

  - You are about to drop the column `zipCode` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the `ResourceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,townId]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,countyId]` on the table `Resource` will be added. If there are existing duplicate values, this will fail.
  - Made the column `description` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `county` on table `Resource` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ResourceCategory" DROP CONSTRAINT "ResourceCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ResourceCategory" DROP CONSTRAINT "ResourceCategory_resourceId_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "zipCode",
ADD COLUMN     "countyId" INTEGER,
ADD COLUMN     "townId" INTEGER,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "county" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "state" DROP DEFAULT;

-- DropTable
DROP TABLE "ResourceCategory";

-- DropTable
DROP TABLE "ServiceCategory";

-- CreateTable
CREATE TABLE "State" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "County" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "County_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Town" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "countyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Town_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResourceCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ResourceCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "County_name_stateId_key" ON "County"("name", "stateId");

-- CreateIndex
CREATE UNIQUE INDEX "Town_name_countyId_key" ON "Town"("name", "countyId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "_ResourceCategories_B_index" ON "_ResourceCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_townId_key" ON "Resource"("name", "townId");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_name_countyId_key" ON "Resource"("name", "countyId");

-- AddForeignKey
ALTER TABLE "County" ADD CONSTRAINT "County_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Town" ADD CONSTRAINT "Town_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_townId_fkey" FOREIGN KEY ("townId") REFERENCES "Town"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "County"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceCategories" ADD CONSTRAINT "_ResourceCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceCategories" ADD CONSTRAINT "_ResourceCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
