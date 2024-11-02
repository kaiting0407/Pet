-- CreateTable
CREATE TABLE `dog` (
    `dogid` VARCHAR(191) NOT NULL,
    `dogname` VARCHAR(191) NOT NULL,
    `AboutTheBreed` VARCHAR(191) NOT NULL,
    `AdaptabilityLevel` INTEGER NOT NULL,
    `AffectionateWithFamily` INTEGER NOT NULL,
    `BarkingLevel` INTEGER NOT NULL,
    `CoatGroomingFrequency` INTEGER NOT NULL,
    `CoatLength` VARCHAR(191) NOT NULL,
    `DroolingLevel` INTEGER NOT NULL,
    `Exercise` VARCHAR(191) NOT NULL,
    `GoodWithYoungChildren` INTEGER NOT NULL,
    `Grooming` VARCHAR(191) NOT NULL,
    `Health` VARCHAR(191) NOT NULL,
    `LifeExpectancy` VARCHAR(191) NOT NULL,
    `OpennessToStrangers` INTEGER NOT NULL,
    `PlayfulnessLevel` INTEGER NOT NULL,
    `SheddingLevel` INTEGER NOT NULL,
    `TrainabilityLevel` INTEGER NOT NULL,
    `Training` VARCHAR(191) NOT NULL,
    `Watchdog` INTEGER NOT NULL,
    `Weight` VARCHAR(191) NOT NULL,
    `GoodWithOtherDogs` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `dog_dogname_key`(`dogname`),
    PRIMARY KEY (`dogid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `animal` (
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

-- CreateTable
CREATE TABLE `animal_done` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `animal_id` INTEGER NOT NULL,
    `predicted_breed` VARCHAR(191) NULL,
    `prediction_confidence` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `animal_done_animal_id_key`(`animal_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `animal_done` ADD CONSTRAINT `animal_done_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `animal`(`animal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
