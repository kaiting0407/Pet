import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import { promisify } from 'util';
import fs from 'fs';

const upload = multer({ dest: '/tmp' });
const uploadMiddleware = promisify(upload.single('image'));

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await uploadMiddleware(req, res);
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: '沒有上傳圖片' });
      }

      const formData = new FormData();
      formData.append('image', fs.createReadStream(file.path));

      // 發送圖片到 YOLO API 進行裁剪
      let yoloResponse;
      try {
        yoloResponse = await axios.post('http://127.0.0.1:5001/detect', formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });
      } catch (error) {
        console.error('Error from YOLO API:', error.message);
        return res.status(500).json({ error: 'YOLO API 請求失敗' });
      }

      // 刪除暫存文件
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // 檢查 YOLO API 回應格式
      const croppedImages = yoloResponse.data.predictions;
      if (!Array.isArray(croppedImages)) {
        console.error('YOLO API response is not an array:', croppedImages);
        return res.status(500).json({ error: 'YOLO API 回應格式錯誤' });
      }

      // 對每張裁剪後的圖片進行預測
      const predictions = await Promise.all(
        croppedImages.map(async (cropped) => {
          try {
            const predictFormData = new FormData();
            const buffer = Buffer.from(cropped.image_data, 'base64');
            predictFormData.append('file', buffer, cropped.filename);

            // 向 Predict API 發送裁剪圖片
            const predictResponse = await axios.post('http://127.0.0.1:5000/predict', predictFormData, {
              headers: {
                ...predictFormData.getHeaders(),
              },
            });

            return { filename: cropped.filename, image_data: cropped.image_data, prediction: predictResponse.data };
          } catch (error) {
            console.error(`Error from Predict API for ${cropped.filename}:`, error.message);
            return { filename: cropped.filename, image_data: cropped.image_data, error: '預測失敗' };
          }
        })
      );

      // 確認最終返回的 predictions 結構
      console.log("Final predictions structure:", predictions);
      return res.status(200).json({ predictions });
    } catch (error) {
      console.error('Error in API:', error.message);
      return res.status(500).json({ error: '圖片上傳或預測失敗' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
