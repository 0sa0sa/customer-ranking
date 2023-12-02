/*
  Warnings:

  - You are about to drop the column `orderedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `totalInCents` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `order_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_in_cents` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderedAt",
DROP COLUMN "totalInCents",
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total_in_cents" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "orderId",
DROP COLUMN "paidAt",
ADD COLUMN     "order_id" INTEGER NOT NULL,
ADD COLUMN     "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
