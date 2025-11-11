-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "county" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "appointmentRequired" SET DEFAULT false;
