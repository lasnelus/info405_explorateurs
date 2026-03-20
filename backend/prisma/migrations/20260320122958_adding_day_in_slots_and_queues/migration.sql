/*
  Warnings:

  - Added the required column `day` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Queue` ADD COLUMN `day` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Slot` ADD COLUMN `day` DATETIME(3) NOT NULL;
