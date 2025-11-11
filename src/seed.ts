// src/seed.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

interface ResourceData {
  name: string;
  description?: string;
  serviceType: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  eligibility?: string;
  appointmentRequired?: boolean | string;
  sourceUrl?: string;
  categoryNames?: string[];
}

interface TownData {
  name: string;
  resources: ResourceData[];
}

interface CountyData {
  name: string;
  towns: TownData[];
  resources?: ResourceData[];
}

interface StateData {
  name: string;
  counties: CountyData[];
}

async function main() {
  const dataPath = path.join(__dirname, "..", "resources.json");
  const jsonData: { states: StateData[] } = JSON.parse(
    fs.readFileSync(dataPath, "utf-8")
  );

  for (const stateData of jsonData.states) {
    const state = await prisma.state.upsert({
      where: { name: stateData.name },
      update: {},
      create: { name: stateData.name },
    });

    for (const countyData of stateData.counties) {
      const county = await prisma.county.upsert({
        where: { name_stateId: { name: countyData.name, stateId: state.id } },
        update: {},
        create: { name: countyData.name, stateId: state.id },
      });

      for (const townData of countyData.towns) {
        // Nullable town: resources can exist without a town
        const town = await prisma.town.upsert({
          where: { name_countyId: { name: townData.name, countyId: county.id } },
          update: {},
          create: { name: townData.name, countyId: county.id },
        });

        for (const resourceData of townData.resources) {
          const { categoryNames, appointmentRequired, ...fields } = resourceData;

          const connectedCategories = [];
          if (categoryNames?.length) {
            for (const catName of categoryNames) {
              const category = await prisma.category.upsert({
                where: { name: catName },
                update: {},
                create: { name: catName },
              });
              connectedCategories.push({ id: category.id });
            }
          }

          const appointmentBool =
            typeof appointmentRequired === "string"
              ? appointmentRequired.toLowerCase() === "yes"
              : !!appointmentRequired;

          await prisma.resource.upsert({
            where: { name_countyId: { name: fields.name, countyId: county.id } }, // Use countyId for uniqueness
            update: {
              ...fields,
              description: fields.description || "",
              appointmentRequired: appointmentBool,
              town: town ? { connect: { id: town.id } } : undefined,
              countyRef: { connect: { id: county.id } },
              categories: connectedCategories.length ? { set: connectedCategories } : { set: [] },
            },
            create: {
              ...fields,
              description: fields.description || "",
              appointmentRequired: appointmentBool,
              serviceType: fields.serviceType,
              town: town ? { connect: { id: town.id } } : undefined,
              countyRef: { connect: { id: county.id } },
              categories: connectedCategories.length ? { connect: connectedCategories } : undefined,
            },
          });
        }
      }

      // County-level resources without a town
      for (const resourceData of countyData.resources || []) {
        const { categoryNames, appointmentRequired, ...fields } = resourceData;

        const connectedCategories = [];
        if (categoryNames?.length) {
          for (const catName of categoryNames) {
            const category = await prisma.category.upsert({
              where: { name: catName },
              update: {},
              create: { name: catName },
            });
            connectedCategories.push({ id: category.id });
          }
        }

        const appointmentBool =
          typeof appointmentRequired === "string"
            ? appointmentRequired.toLowerCase() === "yes"
            : !!appointmentRequired;

        await prisma.resource.upsert({
          where: { name_countyId: { name: fields.name, countyId: county.id } },
          update: {
            ...fields,
            description: fields.description || "",
            appointmentRequired: appointmentBool,
            countyRef: { connect: { id: county.id } },
            categories: connectedCategories.length ? { set: connectedCategories } : { set: [] },
          },
          create: {
            ...fields,
            description: fields.description || "",
            appointmentRequired: appointmentBool,
            serviceType: fields.serviceType,
            countyRef: { connect: { id: county.id } },
            categories: connectedCategories.length ? { connect: connectedCategories } : undefined,
          },
        });
      }
    }
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });