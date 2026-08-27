import prismaPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { blogPosts } from "../data/blog/posts.ts";
import { getPostBlocks } from "../data/blog/post-content.ts";
import { MOCK_COMMENTS } from "../data/blog/comments.ts";
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

async function seedContent() {
  if (await prisma.post.findFirst()) {
    console.log("Posts already exist; skipping content seed.");
    return;
  }

  for (const [index, post] of blogPosts.entries()) {
    const created = await prisma.post.create({
      data: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        date: post.date,
        readTimeMinutes: post.readTimeMinutes,
        content: getPostBlocks(post.slug) ?? [],
        createdAt: new Date(Date.now() - index * 60_000),
      },
    });

    for (const comment of MOCK_COMMENTS) {
      const parent = await prisma.comment.create({
        data: {
          post: { connect: { id: created.id } },
          author: comment.author,
          role: comment.role,
          isTeamAuthor: comment.isTeamAuthor ?? false,
          date: comment.date,
          message: comment.message,
          status: "APPROVED",
        },
      });

      for (const reply of comment.replies ?? []) {
        await prisma.comment.create({
          data: {
            post: { connect: { id: created.id } },
            parent: { connect: { id: parent.id } },
            author: reply.author,
            role: reply.role,
            isTeamAuthor: reply.isTeamAuthor ?? false,
            date: reply.date,
            message: reply.message,
            status: "APPROVED",
          },
        });
      }
    }
  }
}

async function main() {
  await seedAdmin();
  await seedContent();
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
