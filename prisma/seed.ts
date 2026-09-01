import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// import { blogPosts } from "./seed-data/posts.ts";
// import { getPostBlocks } from "./seed-data/post-content.ts";
// import { TAG_DESCRIPTIONS } from "./seed-data/taxonomy.ts";
// import { blogCategories } from "../data/blog/categories.ts";
// import { MOCK_COMMENTS } from "./seed-data/comments.ts";
import { hashPassword } from "../lib/session.ts";

const { PrismaClient } = prismaPackage;

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function seedAdmin() {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.warn("ADMIN_USERNAME/ADMIN_PASSWORD not set; skipping admin seed.");
    return;
  }

  await prisma.admin.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash: hashPassword(ADMIN_PASSWORD) },
    create: {
      username: ADMIN_USERNAME,
      passwordHash: hashPassword(ADMIN_PASSWORD),
    },
  });
}

// async function seedContent() {
//   if (await prisma.post.findFirst()) {
//     console.log("Posts already exist; skipping content seed.");
//     return;
//   }

//   const categoryIdByName = new Map<string, number>();
//   for (const name of blogCategories) {
//     const category = await prisma.category.create({
//       data: { name, slug: name, path: name },
//     });
//     categoryIdByName.set(name, category.id);
//   }

//   for (const [index, post] of blogPosts.entries()) {
//     const categoryId = categoryIdByName.get(post.category);
//     if (!categoryId) throw new Error(`Unknown category: ${post.category}`);

//     const created = await prisma.post.create({
//       data: {
//         slug: post.slug,
//         title: post.title,
//         excerpt: post.excerpt,
//         categoryId,
//         date: post.date,
//         readTimeMinutes: post.readTimeMinutes,
//         content: getPostBlocks(post.slug) ?? [],
//         createdAt: new Date(Date.now() - index * 60_000),
//         tags: {
//           connectOrCreate: post.tags.map((tagName) => ({
//             where: { name: tagName },
//             create: { name: tagName, slug: tagName, description: TAG_DESCRIPTIONS[tagName] ?? null },
//           })),
//         },
//       },
//     });

//     for (const comment of MOCK_COMMENTS) {
//       const parent = await prisma.comment.create({
//         data: {
//           post: { connect: { id: created.id } },
//           author: comment.author,
//           role: comment.role,
//           isTeamAuthor: comment.isTeamAuthor ?? false,
//           date: comment.date,
//           message: comment.message,
//           status: "APPROVED",
//         },
//       });

//       for (const reply of comment.replies ?? []) {
//         await prisma.comment.create({
//           data: {
//             post: { connect: { id: created.id } },
//             parent: { connect: { id: parent.id } },
//             author: reply.author,
//             role: reply.role,
//             isTeamAuthor: reply.isTeamAuthor ?? false,
//             date: reply.date,
//             message: reply.message,
//             status: "APPROVED",
//           },
//         });
//       }
//     }
//   }
// }

async function main() {
  await seedAdmin();
  // await seedContent();

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: "تک‌یار",
      siteTitle: "تک‌یار | همراه تمرینی تکواندو",
      siteDescription:
        "تک‌یار اپلیکیشن همراه تمرین تکواندوست؛ برنامه تمرین شخصی، آموزش گام‌به‌گام فن‌ها و پیگیری ارتقای کمربند، از کمربند سفید تا مشکی",
    },
  });
}

main()
  .then(() => {
    console.log("Seed completed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
