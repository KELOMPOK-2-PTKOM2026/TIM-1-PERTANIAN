-- CreateEnum
CREATE TYPE "PesticideType" AS ENUM ('HERBISIDA', 'INSEKTISIDA', 'FUNGISIDA', 'AKARISIDA');

-- CreateTable
CREATE TABLE "Pesticide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PesticideType" NOT NULL,
    "activeIngredient" TEXT NOT NULL,
    "targets" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "packaging" TEXT,
    "manufacturer" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pesticide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pesticide_slug_key" ON "Pesticide"("slug");

-- CreateIndex
CREATE INDEX "Pesticide_type_idx" ON "Pesticide"("type");
