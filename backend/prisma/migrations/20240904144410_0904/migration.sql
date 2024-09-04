/*
  Warnings:

  - You are about to drop the column `avgage` on the `dog` table. All the data in the column will be lost.
  - You are about to drop the column `ecoNeeds` on the `dog` table. All the data in the column will be lost.
  - You are about to drop the column `environment` on the `dog` table. All the data in the column will be lost.
  - You are about to drop the column `exercise` on the `dog` table. All the data in the column will be lost.
  - You are about to drop the column `habits` on the `dog` table. All the data in the column will be lost.
  - Added the required column `AboutTheBreed` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AdaptabilityLevel` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AffectionateWithFamily` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BarkingLevel` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CoatGroomingFrequency` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CoatLength` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DroolingLevel` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Exercise` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GoodWithOtherDogsString` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GoodWithYoungChildren` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Grooming` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Health` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LifeExpectancy` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OpennessToStrangers` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PlayfulnessLevel` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SheddingLevel` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TrainabilityLevel` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Training` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Watchdog` to the `dog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Weight` to the `dog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dog` DROP COLUMN `avgage`,
    DROP COLUMN `ecoNeeds`,
    DROP COLUMN `environment`,
    DROP COLUMN `exercise`,
    DROP COLUMN `habits`,
    ADD COLUMN `AboutTheBreed` VARCHAR(191) NOT NULL,
    ADD COLUMN `AdaptabilityLevel` INTEGER NOT NULL,
    ADD COLUMN `AffectionateWithFamily` INTEGER NOT NULL,
    ADD COLUMN `BarkingLevel` INTEGER NOT NULL,
    ADD COLUMN `CoatGroomingFrequency` INTEGER NOT NULL,
    ADD COLUMN `CoatLength` VARCHAR(191) NOT NULL,
    ADD COLUMN `DroolingLevel` INTEGER NOT NULL,
    ADD COLUMN `Exercise` VARCHAR(191) NOT NULL,
    ADD COLUMN `GoodWithOtherDogsString` INTEGER NOT NULL,
    ADD COLUMN `GoodWithYoungChildren` INTEGER NOT NULL,
    ADD COLUMN `Grooming` VARCHAR(191) NOT NULL,
    ADD COLUMN `Health` VARCHAR(191) NOT NULL,
    ADD COLUMN `LifeExpectancy` VARCHAR(191) NOT NULL,
    ADD COLUMN `OpennessToStrangers` INTEGER NOT NULL,
    ADD COLUMN `PlayfulnessLevel` INTEGER NOT NULL,
    ADD COLUMN `SheddingLevel` INTEGER NOT NULL,
    ADD COLUMN `TrainabilityLevel` INTEGER NOT NULL,
    ADD COLUMN `Training` VARCHAR(191) NOT NULL,
    ADD COLUMN `Watchdog` INTEGER NOT NULL,
    ADD COLUMN `Weight` VARCHAR(191) NOT NULL;
