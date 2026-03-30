/*
  Warnings:

  - A unique constraint covering the columns `[childId,day]` on the table `Queue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[childId,day]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Queue_childId_day_key` ON `Queue`(`childId`, `day`);

-- CreateIndex
CREATE UNIQUE INDEX `Slot_childId_day_key` ON `Slot`(`childId`, `day`);
