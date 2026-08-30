ALTER TABLE "Category" ADD COLUMN "path" TEXT;
UPDATE "Category" SET "path" = "slug";
ALTER TABLE "Category" ALTER COLUMN "path" SET NOT NULL;
CREATE UNIQUE INDEX "Category_path_key" ON "Category"("path");

ALTER TABLE "Category" ADD COLUMN "parentId" INTEGER;
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
