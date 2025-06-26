/*
  Warnings:

  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `country`,
    DROP COLUMN `gender`,
    DROP COLUMN `language`,
    DROP COLUMN `nickName`,
    DROP COLUMN `timeZone`,
    ADD COLUMN `profilePic` VARCHAR(191) NULL;
