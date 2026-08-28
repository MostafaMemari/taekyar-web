-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");

-- AlterTable: add new Post columns first
ALTER TABLE "Post" ADD COLUMN "categoryId" INTEGER;
ALTER TABLE "Post" ADD COLUMN "metaTitle" TEXT;
ALTER TABLE "Post" ADD COLUMN "metaDescription" TEXT;

-- Backfill: create categories from distinct post categories
INSERT INTO "Category" ("name", "slug")
SELECT DISTINCT "category", "category"
FROM "Post";

-- Backfill: create tags from post tag arrays
INSERT INTO "Tag" ("name", "slug")
SELECT DISTINCT t."value", t."value"
FROM "Post" p,
    unnest(p."tags") AS t("value");

-- Backfill: connect posts to their category
UPDATE "Post"
SET "categoryId" = c."id"
FROM "Category" c
WHERE c."name" = "Post"."category";

-- Backfill: connect posts to their tags
INSERT INTO "_PostToTag" ("A", "B")
SELECT p."id", t."id"
FROM "Post" p
JOIN "Tag" t ON t."name" = ANY (p."tags");

-- AlterTable: make categoryId required now that it is backfilled
ALTER TABLE "Post" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropLegacyColumns
ALTER TABLE "Post" DROP COLUMN "category";
ALTER TABLE "Post" DROP COLUMN "tags";
