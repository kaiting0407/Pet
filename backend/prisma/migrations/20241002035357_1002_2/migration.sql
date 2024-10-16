/*
  Warnings:

  - You are about to drop the column `album_file` on the `animal_done` table. All the data in the column will be lost.
  - You are about to drop the column `animal_Variety` on the `animal_done` table. All the data in the column will be lost.
  - You are about to drop the column `animal_colour` on the `animal_done` table. All the data in the column will be lost.
  - You are about to drop the column `animal_kind` on the `animal_done` table. All the data in the column will be lost.
  - You are about to drop the column `animal_sex` on the `animal_done` table. All the data in the column will be lost.
  - You are about to drop the column `shelter_address` on the `animal_done` table. All the data in the column will be lost.
  - You are about to drop the column `shelter_name` on the `animal_done` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `animal_done` DROP COLUMN `album_file`,
    DROP COLUMN `animal_Variety`,
    DROP COLUMN `animal_colour`,
    DROP COLUMN `animal_kind`,
    DROP COLUMN `animal_sex`,
    DROP COLUMN `shelter_address`,
    DROP COLUMN `shelter_name`;

-- RedefineIndex
CREATE UNIQUE INDEX `animal_done_animal_id_key` ON `animal_done`(`animal_id`);
DROP INDEX `Animal_animal_id_key` ON `animal_done`;
