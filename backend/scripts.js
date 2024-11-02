import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 定義 __dirname 替代方案
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

// 定義圖片下載函數
const downloadImage = async (imageUrl, savePath) => {
  const writer = fs.createWriteStream(savePath);

  const response = await axios({
    url: imageUrl,
    method: 'GET',
    responseType: 'stream',
  });

  // 將圖片數據寫入檔案
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const saveAnimalData = async () => {
  try {
    // 抓取 API 資料
    const response = await axios.get('https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL');
    const animalData = response.data;

    // 設定圖片保存資料夾
    const saveFolder = path.resolve(__dirname, 'animal_images');
    if (!fs.existsSync(saveFolder)) {
      fs.mkdirSync(saveFolder, { recursive: true });
    }

    // 過濾狗的資料並存入資料庫
    for (const animal of animalData) {
      if (animal.animal_kind === '狗') {
        await prisma.animal.upsert({
          where: { animal_id: animal.animal_id },
          update: {}, // 如果動物已存在，不做任何更新
          create: {
            animal_id: animal.animal_id,
            animal_kind: animal.animal_kind,
            animal_Variety: animal.animal_Variety,
            animal_sex: animal.animal_sex,
            animal_colour: animal.animal_colour,
            shelter_name: animal.shelter_name,
            shelter_address: animal.shelter_address,
            album_file: animal.album_file || '',
          },
        });

        // 如果有圖片，下載圖片
        if (animal.album_file) {
          const fileExtension = path.extname(animal.album_file) || '.png';
          const savePath = path.join(saveFolder, `${animal.animal_id}${fileExtension}`);
          
          try {
            await downloadImage(animal.album_file, savePath);
            console.log(`圖片已下載: ${savePath}`);
          } catch (downloadError) {
            console.error(`圖片下載失敗: ${animal.album_file}`, downloadError);
            // 當圖片下載失敗時，將 wrong.png 複製到指定路徑
            const wrongImagePath = path.resolve('C:\\Users\\Asus\\Desktop\\Project\\pet\\Pet\\backend', 'wrong.png');
            fs.copyFileSync(wrongImagePath, savePath);
            console.log(`使用預設圖片: ${wrongImagePath} 取代下載失敗的圖片.`);
          }
        }
      }
    }

    console.log('資料成功存入資料庫');
  } catch (error) {
    console.error('Error saving animal data:', error);
  } finally {
    await prisma.$disconnect();
  }
};

saveAnimalData();

