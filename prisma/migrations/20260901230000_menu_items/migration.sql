-- WordPress-like navigation menus, linked to existing content by relation.
CREATE TYPE "MenuItemType" AS ENUM ('PAGE', 'POST', 'CATEGORY', 'TAG', 'CUSTOM');
CREATE TYPE "MenuLocation" AS ENUM ('HEADER_DESKTOP', 'HEADER_MOBILE', 'FOOTER_QUICK', 'FOOTER_BLOG');

CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MenuItemType" NOT NULL,
    "customUrl" TEXT,
    "pageId" INTEGER,
    "postId" INTEGER,
    "categoryId" INTEGER,
    "tagId" INTEGER,
    "parentId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "location" "MenuLocation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MenuItem_parentId_idx" ON "MenuItem"("parentId");
CREATE INDEX "MenuItem_location_order_idx" ON "MenuItem"("location", "order");

ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
