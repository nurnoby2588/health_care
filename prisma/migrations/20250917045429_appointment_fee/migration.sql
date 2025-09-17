/*
  Warnings:

  - You are about to drop the column `appoitmentFee` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `appointmentFee` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."doctors" DROP COLUMN "appoitmentFee",
ADD COLUMN     "appointmentFee" INTEGER NOT NULL;
