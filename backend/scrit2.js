import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function processResultsToDb(resultsFilePath) {
    try {
        const data = fs.readFileSync(resultsFilePath, 'utf-8');
        const lines = data.split('\n');

        let currentAnimalId = null;
        let predictedBreed = null;
        let confidence = null;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('Image:')) {
                const idString = trimmedLine.split(' ')[1].replace('.png', '');
                currentAnimalId = idString ? parseInt(idString, 10) : null;
            } else if (trimmedLine.startsWith('Predicted Class:')) {
                predictedBreed = trimmedLine.split(': ')[1];
            } else if (trimmedLine.startsWith('Confidence:')) {
                confidence = parseFloat(trimmedLine.split(': ')[1]);

                if (confidence < 0.8) {
                    predictedBreed = '混種狗';
                }

                // 確認 currentAnimalId 是否存在於 animal 表中
                const animalExists = await prisma.animal.findUnique({
                    where: { animal_id: currentAnimalId },
                });

                if (animalExists && currentAnimalId !== null && predictedBreed !== null) {
                    console.log(`最終確認資料 - animal_id: ${currentAnimalId}, 品種: ${predictedBreed}, 信心度: ${confidence}`);

                    await prisma.animal_done.upsert({
                        where: { animal_id: currentAnimalId },
                        update: {
                            predicted_breed: predictedBreed,
                            prediction_confidence: confidence
                        },
                        create: {
                            animal_id: currentAnimalId,
                            predicted_breed: predictedBreed,
                            prediction_confidence: confidence,
                        }
                    });
                } else {
                    console.warn(`animal_id ${currentAnimalId} 不存在於 animal 表中，跳過寫入`);
                }

                // 清空暫存變數
                currentAnimalId = null;
                predictedBreed = null;
                confidence = null;
            } else if (trimmedLine.includes('辨識失敗')) {
                if (currentAnimalId !== null) {
                    const animalRecord = await prisma.animal.findUnique({
                        where: { animal_id: currentAnimalId },
                    });

                    predictedBreed = animalRecord ? animalRecord.animal_kind : '未知';
                } else {
                    predictedBreed = '未知';
                }

                confidence = null;
            }
        }

        console.log('所有結果已成功寫入資料庫');
    } catch (error) {
        console.error('寫入資料庫時出錯:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// 主函數
async function main() {
    const resultsFilePath = path.join(path.resolve(), 'results', 'all_results.txt');
    await processResultsToDb(resultsFilePath);
}

main();
