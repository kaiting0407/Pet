-- CreateTable
CREATE TABLE `Animal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_id` INTEGER NOT NULL,
    `animal_kind` VARCHAR(191) NOT NULL,
    `animal_Variety` VARCHAR(191) NOT NULL,
    `animal_sex` VARCHAR(191) NOT NULL,
    `animal_colour` VARCHAR(191) NOT NULL,
    `shelter_name` VARCHAR(191) NOT NULL,
    `shelter_address` VARCHAR(191) NOT NULL,
    `album_file` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Animal_animal_id_key`(`animal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
