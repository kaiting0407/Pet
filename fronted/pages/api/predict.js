import formidable from 'formidable';
import { exec } from 'child_process';

export const config = {
  api: {
    bodyParser: false, // 禁用默认的 body 解析
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received POST request'); // 打印日志

    const form = formidable({
      keepExtensions: true, // 保留文件扩展名
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ message: 'Error parsing form data' });
      }

      // 确认解析到的文件信息
      console.log('Parsed files:', files);

      // 检查文件是否存在，注意 files.image 是数组，取第一项
      if (!files.image || !files.image[0] || !files.image[0].filepath) {
        console.error('No file uploaded');
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // 获取上传的文件路径
      const imagePath = files.image[0].filepath;
      console.log('Uploaded file path:', imagePath);

      // 调用 Python 脚本
      const pythonPath = 'C:\\Users\\Asus\\anaconda3\\envs\\tf3\\python.exe'; // Python 路径
      const scriptPath = 'C:\\Users\\Asus\\Desktop\\Project\\pet\\Pet\\breads\\pets_classifer-master\\test.py';

      exec(`${pythonPath} ${scriptPath} ${imagePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing Python script:', stderr);
          return res.status(500).json({ message: 'Error executing Python script', error: stderr });
        }

        console.log('Python script output:', stdout);
        return res.status(200).json({ message: 'Success', output: stdout });
      });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
