/*
  Warnings:

  - You are about to drop the column `GoodWithOtherDogsString` on the `dog` table. All the data in the column will be lost.
  - Added the required column `GoodWithOtherDogs` to the `dog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dog` DROP COLUMN `GoodWithOtherDogsString`,
    ADD COLUMN `GoodWithOtherDogs` INTEGER NOT NULL;
