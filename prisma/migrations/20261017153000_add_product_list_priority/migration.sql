-- CreateEnum
CREATE TYPE "ProductListPriority" AS ENUM ('high', 'medium', 'low');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN "listPriority" "ProductListPriority" NOT NULL DEFAULT 'medium';
