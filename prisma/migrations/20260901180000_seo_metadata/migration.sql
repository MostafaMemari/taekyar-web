-- Manual SEO overrides live in one dedicated 1:1 table shared by Post, Category and Tag.
-- Existing metaTitle/metaDescription values are preserved as seoTitle/seoDescription overrides.
CREATE TABLE "SeoMetadata" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER,
    "categoryId" INTEGER,
    "tagId" INTEGER,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "keywords" TEXT,
    "canonical" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoMetadata_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SeoMetadata_postId_key" ON "SeoMetadata"("postId");
CREATE UNIQUE INDEX "SeoMetadata_categoryId_key" ON "SeoMetadata"("categoryId");
CREATE UNIQUE INDEX "SeoMetadata_tagId_key" ON "SeoMetadata"("tagId");

ALTER TABLE "SeoMetadata" ADD CONSTRAINT "SeoMetadata_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeoMetadata" ADD CONSTRAINT "SeoMetadata_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeoMetadata" ADD CONSTRAINT "SeoMetadata_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "SeoMetadata" ("postId", "seoTitle", "seoDescription")
SELECT "id", "metaTitle", "metaDescription"
FROM "Post"
WHERE "metaTitle" IS NOT NULL OR "metaDescription" IS NOT NULL;

INSERT INTO "SeoMetadata" ("categoryId", "seoTitle", "seoDescription")
SELECT "id", "metaTitle", "metaDescription"
FROM "Category"
WHERE "metaTitle" IS NOT NULL OR "metaDescription" IS NOT NULL;

INSERT INTO "SeoMetadata" ("tagId", "seoTitle", "seoDescription")
SELECT "id", "metaTitle", "metaDescription"
FROM "Tag"
WHERE "metaTitle" IS NOT NULL OR "metaDescription" IS NOT NULL;

ALTER TABLE "Post" DROP COLUMN "metaTitle";
ALTER TABLE "Post" DROP COLUMN "metaDescription";
ALTER TABLE "Category" DROP COLUMN "metaTitle";
ALTER TABLE "Category" DROP COLUMN "metaDescription";
ALTER TABLE "Tag" DROP COLUMN "metaTitle";
ALTER TABLE "Tag" DROP COLUMN "metaDescription";
