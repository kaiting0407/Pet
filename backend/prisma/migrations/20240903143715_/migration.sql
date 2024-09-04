-- CreateTable
CREATE TABLE `dog` (
    `dogid` VARCHAR(191) NOT NULL,
    `dogname` VARCHAR(191) NOT NULL,
    `habits` VARCHAR(191) NOT NULL,
    `ecoNeeds` VARCHAR(191) NOT NULL,
    `environment` VARCHAR(191) NOT NULL,
    `exercise` VARCHAR(191) NOT NULL,
    `avgage` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `dog_dogname_key`(`dogname`),
    PRIMARY KEY (`dogid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
