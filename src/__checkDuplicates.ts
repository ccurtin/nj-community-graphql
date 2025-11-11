import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking for duplicates at the town level...");

  // Town-level duplicates
  const towns = await prisma.town.findMany({
    include: { resources: true },
  });

  for (const town of towns) {
    const seen = new Map<string, number>();
    const duplicates: number[] = [];
    town.resources.forEach((res) => {
      if (seen.has(res.name)) {
        duplicates.push(res.id);
      } else {
        seen.set(res.name, res.id);
      }
    });

    if (duplicates.length > 0) {
      console.log(`Town "${town.name}" has duplicates: ${duplicates.length}`);
      console.log(duplicates);
      // Optional auto-delete
      for (const id of duplicates) {
        await prisma.resource.delete({ where: { id } });
      }
    }
  }

  console.log("Checking for duplicates at the county level...");

  // County-level duplicates
  const counties = await prisma.county.findMany({
    include: { resources: true },
  });

  for (const county of counties) {
    const seen = new Map<string, number>();
    const duplicates: number[] = [];
    county.resources.forEach((res) => {
      if (seen.has(res.name)) {
        duplicates.push(res.id);
      } else {
        seen.set(res.name, res.id);
      }
    });

    if (duplicates.length > 0) {
      console.log(`County "${county.name}" has duplicates: ${duplicates.length}`);
      console.log(duplicates);
      // Optional auto-delete
      for (const id of duplicates) {
        await prisma.resource.delete({ where: { id } });
      }
    }
  }

  console.log("Duplicate check complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());