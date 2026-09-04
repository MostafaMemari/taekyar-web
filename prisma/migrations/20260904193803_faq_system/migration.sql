-- CreateEnum
CREATE TYPE "FaqLocation" AS ENUM ('HOMEPAGE', 'BLOG');

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "location" "FaqLocation" NOT NULL DEFAULT 'HOMEPAGE',
    "postId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Faq_location_order_idx" ON "Faq"("location", "order");

-- CreateIndex
CREATE INDEX "Faq_postId_order_idx" ON "Faq"("postId", "order");

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
