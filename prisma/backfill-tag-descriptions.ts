import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { TAG_DESCRIPTIONS } from "./seed-data/taxonomy.ts";

const { PrismaClient } = prismaPackage;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  let updated = 0;
  for (const [name, description] of Object.entries(TAG_DESCRIPTIONS)) {
    const result = await prisma.tag.updateMany({
      where: { name, description: null },
      data: { description },
    });
    updated += result.count;
  }
  console.log(`Updated ${updated} tags.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
