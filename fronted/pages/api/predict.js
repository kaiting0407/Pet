import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';
import { promisify } from 'util';
import fs from 'fs';

// 設置 multer 用於接收文件
const upload = multer({ dest: '/tmp' });
const uploadMiddleware = promisify(upload.single('image')); // 'image' 是前端發送的文件字段名稱

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // 處理文件上傳
      await uploadMiddleware(req, res);
      const file = req.file; // multer 將文件存入 req.file
      console.log(file);

      if (!file) {
        return res.status(400).json({ error: '沒有上傳圖片' });
      }

      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.path)); // 使用文件路徑讀取圖片並附加到 FormData

      // 向 Flask API 發送請求
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      // 刪除臨時文件
      fs.unlinkSync(file.path);

      return res.status(200).json({ output: response.data }); // 返回預測結果到前端
    } catch (error) {
      console.error('Error in API:', error);
      return res.status(500).json({ error: '圖片上傳或預測失敗' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export const config = {
  api: {
    bodyParser: false, // 禁用 Next.js 默認的 body 解析，讓 multer 處理
  },
};
