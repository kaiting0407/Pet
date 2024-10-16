import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client'; // 使用 @prisma/client

// 初始化 Prisma 客戶端
const prisma = new PrismaClient();

// 解析 .txt 文件並將結果寫入資料庫
async function processResultsToDb(resultsFilePath) {
    try {
        // 讀取結果文件
        const data = fs.readFileSync(resultsFilePath, 'utf-8');

        // 按行分割文件內容
        const lines = data.split('\n');

        let currentAnimalId = null;
        let predictedBreed = null;
        let confidence = null;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith('Image:')) {
                // 從文件名中獲取 animal_id
                currentAnimalId = trimmedLine.split(' ')[1].replace('.png', '');
            } else if (trimmedLine.startsWith('Predicted Class:')) {
                // 取得預測的狗品種
                predictedBreed = trimmedLine.split(': ')[1];
            } else if (trimmedLine.startsWith('Confidence:')) {
                // 取得信心度
                confidence = parseFloat(trimmedLine.split(': ')[1]);
            } else if (trimmedLine.includes('辨識失敗')) {
                // 如果辨識失敗，將辨識失敗寫入 `predicted_breed`
                predictedBreed = '辨識失敗';
                confidence = null;
            }

            // 當有完整的資料時，使用 upsert 寫入或更新資料庫
            if (currentAnimalId && predictedBreed !== null) {
                await prisma.animal_done.upsert({
                    where: { animal_id: parseInt(currentAnimalId, 10) },
                    update: {
                        predicted_breed: predictedBreed,
                        prediction_confidence: confidence
                    },
                    create: {
                        animal_id: parseInt(currentAnimalId, 10),
                        predicted_breed: predictedBreed,
                        prediction_confidence: confidence,
                    }
                });

                // 重置變數以處理下一張圖片
                currentAnimalId = null;
                predictedBreed = null;
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
    // 指定結果文件的路徑
    const resultsFilePath = path.join(path.resolve(), 'results', 'all_results.txt');

    // 處理結果並將其寫入資料庫
    await processResultsToDb(resultsFilePath);
}

// 執行主函數
main();
