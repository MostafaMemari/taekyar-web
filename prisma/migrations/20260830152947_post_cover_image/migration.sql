-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "coverImageAlt" TEXT;

-- AlterTable
ALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_PostToTag_AB_unique";
