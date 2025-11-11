// src/index.ts
import { ApolloServer, gql } from "apollo-server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ===============================
   START: GraphQL Type Definitions
   =============================== */
const typeDefs = gql`
  type Resource {
    id: ID!
    name: String!
    description: String
    serviceType: String!
    address: String
    city: String
    county: String
    state: String
    zipCode: String
    phone: String
    email: String
    website: String
    hours: String
    eligibility: String
    appointmentRequired: Boolean
    sourceUrl: String
    categories: [Category!]
    createdAt: String
    updatedAt: String
  }

  type Category {
    id: ID!
    name: String!
  }
  type State {
    id: ID!
    name: String!
  }

  type County {
    id: ID!
    name: String!
    towns: [Town!]
  }

  type Town {
    id: ID!
    name: String!
    resourceCount: Int!
    resources: [Resource!]
  }

  type CountySummary {
    county: String!
    totalTowns: Int!
    totalResources: Int!
    totalCategories: Int!
  }

  type CategoryStat {
    category: String!
    count: Int!
  }

  input ResourceInput {
    name: String!
    description: String
    serviceType: String!
    address: String
    city: String
    county: String
    state: String = "NJ"
    zipCode: String
    phone: String
    email: String
    website: String
    hours: String
    eligibility: String
    appointmentRequired: Boolean = false
    sourceUrl: String
    categoryIds: [ID!]
  }

  type Query {
    resources(
      county: String
      town: String
      serviceType: String
      city: String
      category: String
      search: String
      limit: Int = 100
      offset: Int = 0
    ): [Resource!]

    # Get all resources of a given serviceType (e.g., all Shelters)
    resourcesByServiceType(serviceType: String!, county: String): [Resource!]

    resource(id: ID!): Resource
    categories: [Category!]
    states: [State!]!
    countiesByState(state: String!): [County!]!
    townsByCounty(county: String!): [Town!]!
    countySummary(county: String!): CountySummary!
    topResourceCategoriesByCounty(county: String!): [CategoryStat!]!
  }

  type Mutation {
    addResource(input: ResourceInput!): Resource!
    updateResource(id: ID!, input: ResourceInput!): Resource!
    deleteResource(id: ID!): Boolean!
    addCategory(name: String!): Category!
  }
`;
/* =============================
   END: GraphQL Type Definitions
   ============================= */

/* ===============================
   START: GraphQL Resolvers
   =============================== */
const resolvers = {
  Query: {
    // --- Standard resource filtering ---
    resources: async (_: any, args: any) => {
      const {
        county,
        serviceType,
        city,
        category,
        search,
        limit = 100,
        offset = 0,
      } = args;
      const where: any = {};

      if (county) where.county = { equals: county, mode: "insensitive" };
      if (serviceType)
        where.serviceType = { equals: serviceType, mode: "insensitive" };
      if (city) where.city = { equals: city, mode: "insensitive" };

      if (search) {
        const s = search.toLowerCase().trim();
        where.AND = [
          {
            OR: [
              { name: { contains: s, mode: "insensitive" } },
              { description: { contains: s, mode: "insensitive" } },
              { address: { contains: s, mode: "insensitive" } },
              { city: { contains: s, mode: "insensitive" } },
              { county: { contains: s, mode: "insensitive" } },
              { serviceType: { contains: s, mode: "insensitive" } },
            ],
          },
        ];
      }

      let categoryFilter = {};
      if (category) {
        const cat = await prisma.category.findFirst({
          where: { name: { equals: category, mode: "insensitive" } },
        });
        if (cat) categoryFilter = { some: { id: cat.id } };
        else return [];
      }

      const resources = await prisma.resource.findMany({
        where: { ...where, categories: category ? categoryFilter : undefined },
        include: { categories: true },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      return resources;
    },

    // --- Query by Service Type ---
    resourcesByServiceType: async (_: any, { serviceType, county }: any) => {
      const where: any = {
        serviceType: { equals: serviceType, mode: "insensitive" },
      };
      if (county) where.county = { equals: county, mode: "insensitive" };

      const resources = await prisma.resource.findMany({
        where,
        include: { categories: true },
        orderBy: { name: "asc" },
      });
      return resources;
    },

    resource: async (_: any, { id }: any) =>
      prisma.resource.findUnique({
        where: { id: Number(id) },
        include: { categories: true },
      }),

    categories: () => prisma.category.findMany(),

    // --- Query all towns within a county with their resources ---
    // townsByFirstCounty: async (_: any, { county }: any) => {
    //   const countyRecord = await prisma.county.findFirst({
    //     where: { name: { equals: county, mode: "insensitive" } },
    //   });
    //   if (!countyRecord) return [];

    //   const towns = await prisma.town.findMany({
    //     where: { countyId: countyRecord.id },
    //     include: {
    //       resources: {
    //         include: { categories: true },
    //         orderBy: { name: "asc" },
    //       },
    //     },
    //     orderBy: { name: "asc" },
    //   });

    //   return towns.map((t) => ({
    //     id: t.id,
    //     name: t.name,
    //     resourceCount: t.resources.length,
    //     resources: t.resources,
    //   }));
    // },

    // --- County Summary Statistics ---
    countySummary: async (_: any, { county }: any) => {
      const countyRecord = await prisma.county.findFirst({
        where: { name: { equals: county, mode: "insensitive" } },
      });
      if (!countyRecord)
        return { county, totalTowns: 0, totalResources: 0, totalCategories: 0 };

      const [totalTowns, totalResources, totalCategories] = await Promise.all([
        prisma.town.count({ where: { countyId: countyRecord.id } }),
        prisma.resource.count({ where: { countyId: countyRecord.id } }),
        prisma.category.count(),
      ]);

      return {
        county: countyRecord.name,
        totalTowns,
        totalResources,
        totalCategories,
      };
    },

    // --- Top Resource Categories for a County ---
    topResourceCategoriesByCounty: async (_: any, { county }: any) => {
      const countyRecord = await prisma.county.findFirst({
        where: { name: { equals: county, mode: "insensitive" } },
      });
      if (!countyRecord) return [];

      const resources = await prisma.resource.findMany({
        where: { countyId: countyRecord.id },
        include: { categories: true },
      });

      const categoryCountMap: Record<string, number> = {};
      for (const res of resources) {
        for (const cat of res.categories) {
          categoryCountMap[cat.name] = (categoryCountMap[cat.name] || 0) + 1;
        }
      }

      return Object.entries(categoryCountMap)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);
    },
    // 1. Query all states
    states: async () => prisma.state.findMany(),

    // 2. Query counties by state
    countiesByState: async (_: any, { state }: any) => {
      const stateObj = await prisma.state.findUnique({
        where: { name: state },
        include: {
          counties: {
            orderBy: { name: "asc" }, // <-- sort counties alphabetically
            include: {
              towns: {
                orderBy: { name: "asc" }, // <-- sort towns alphabetically
              },
            },
          },
        },
      });
      return stateObj?.counties || [];
    },

    // 3. Query towns by county (optional)
    townsByCounty: async (_: any, { county }: { county: string }) =>
      prisma.town.findMany({
        where: { county: { name: county } },
      }),
  },

  Mutation: {
    addResource: async (_: any, { input }: any) => {
      const { categoryIds, ...data } = input;
      const connectedCategories =
        categoryIds?.map((id: number) => ({ id })) || [];
      return prisma.resource.create({
        data: {
          ...data,
          categories: connectedCategories.length
            ? { connect: connectedCategories }
            : undefined,
        },
        include: { categories: true },
      });
    },

    updateResource: async (_: any, { id, input }: any) => {
      const { categoryIds, ...data } = input;
      const connectedCategories =
        categoryIds?.map((id: number) => ({ id })) || [];
      return prisma.resource.update({
        where: { id: Number(id) },
        data: {
          ...data,
          categories:
            connectedCategories.length > 0
              ? { deleteMany: {}, connect: connectedCategories }
              : undefined,
        },
        include: { categories: true },
      });
    },

    deleteResource: async (_: any, { id }: any) => {
      await prisma.resource.delete({ where: { id: Number(id) } });
      return true;
    },

    addCategory: async (_: any, { name }: any) => {
      const existing = await prisma.category.findUnique({ where: { name } });
      return existing || prisma.category.create({ data: { name } });
    },
  },
};
/* =============================
   END: GraphQL Resolvers
   ============================= */

/* ===============================
   START: Apollo Server Setup
   =============================== */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ prisma }),
  introspection: true,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
/* ===============================
   END: Apollo Server Setup
   =============================== */
