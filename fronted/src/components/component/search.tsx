"use client";
import { useState, useRef } from 'react'; // 引入 useRef
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';


export default function Search() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 儲存圖片預覽的 URL
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 使用 useRef 來獲取 input 元素的引用
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedImage(file);

    if (file) {
      // 產生圖片預覽 URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('請先選擇圖片');
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
      console.log('Response data:', response.data);

      if (response.data.error) {
        setError(response.data.error);
        setResult(null);
      } else {
        setResult(response.data.output); // 提取 API 回應
        setError(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('圖片上傳或預測失敗');
      setResult(null);
    }
  };

  // 觸發 input 的點擊事件
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
        <Link href={"/dogs"}>圖鑑</Link>

      <label className="file-label">
        {/* 隱藏的 input 元素 */}
        <input 
          ref={fileInputRef} // 使用 useRef 來獲取 input
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          style={{ display: 'none' }} 
        />
        {/* Button 用於觸發 input 點擊事件 */}
        <Button as="span" onClick={handleFileSelect}>選擇檔案</Button>
      </label>

      {/* 如果有選擇圖片，顯示圖片預覽 */}
      {imagePreview && <img src={imagePreview} alt="圖片預覽" className="w-64 h-64 object-contain mt-4" />}

      <Button onClick={handleUpload}>上傳並預測</Button>

      {error && <div className="error">{error}</div>}

      {result && result.first_prediction && result.second_prediction ? (
        <div>
          <h2>預測結果</h2>
          <p>
            第一預測: {result.first_prediction.class || "無資料"} (信心度:{" "}
            {result.first_prediction.confidence !== undefined ? result.first_prediction.confidence.toFixed(2) : "無資料"})
          </p>
          <p>
            第二預測: {result.second_prediction.class || "無資料"} (信心度:{" "}
            {result.second_prediction.confidence !== undefined ? result.second_prediction.confidence.toFixed(2) : "無資料"})
          </p>
        </div>
      ) : (
        <div>請上傳圖片進行預測</div>
      )}
    </div>
  );
}
