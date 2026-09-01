-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteName" TEXT NOT NULL,
    "siteTitle" TEXT NOT NULL,
    "siteDescription" TEXT NOT NULL,
    "defaultSeoTitle" TEXT,
    "defaultSeoDescription" TEXT,
    "logoImage" TEXT,
    "logoImageAlt" TEXT,
    "faviconImage" TEXT,
    "faviconImageAlt" TEXT,
    "defaultOgImage" TEXT,
    "defaultOgImageAlt" TEXT,
    "telegramUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "twitterUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
