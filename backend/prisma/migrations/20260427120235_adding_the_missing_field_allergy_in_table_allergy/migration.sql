/*
  Warnings:

  - Added the required column `allergy` to the `Allergy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Allergy` ADD COLUMN `allergy` VARCHAR(191) NOT NULL;
