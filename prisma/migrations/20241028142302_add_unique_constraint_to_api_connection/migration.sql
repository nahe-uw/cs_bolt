/*
  Warnings:

  - You are about to drop the `APIConnections` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `APIConnections` DROP FOREIGN KEY `APIConnections_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Table` DROP FOREIGN KEY `Table_apiConnectionId_fkey`;

-- DropTable
DROP TABLE `APIConnections`;

-- CreateTable
CREATE TABLE `APIConnection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `apiUrl` VARCHAR(191) NOT NULL,
    `apiToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `APIConnection_userId_apiUrl_key`(`userId`, `apiUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `APIConnection` ADD CONSTRAINT `APIConnection_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Table` ADD CONSTRAINT `Table_apiConnectionId_fkey` FOREIGN KEY (`apiConnectionId`) REFERENCES `APIConnection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
