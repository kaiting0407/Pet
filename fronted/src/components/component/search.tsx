"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('请先选择图片');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data.output); // 显示预测结果
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>上傳並預測</button>
      {result && <div>{result}</div>}
    </div>
  );
}
