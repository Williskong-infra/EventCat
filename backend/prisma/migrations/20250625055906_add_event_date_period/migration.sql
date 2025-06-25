/*
  Warnings:

  - You are about to drop the column `date` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `date`,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `startDate` DATETIME(3) NULL;
