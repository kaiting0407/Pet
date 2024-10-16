-- AddForeignKey
ALTER TABLE `animal_done` ADD CONSTRAINT `animal_done_animal_id_fkey` FOREIGN KEY (`animal_id`) REFERENCES `animal`(`animal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
