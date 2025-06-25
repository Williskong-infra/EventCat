-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `verifyCode` VARCHAR(191) NULL,
    ADD COLUMN `verifyCodeExpires` DATETIME(3) NULL;
