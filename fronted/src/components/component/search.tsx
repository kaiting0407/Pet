'use client';

import { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UploadIcon, ImageIcon } from 'lucide-react';
import PredictionResult from "@/components/component/PredictionResult";

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError('請先選擇圖片');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setResult(data);

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data); // 直接設置為 data，不再使用 data.output
        setError(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('圖片上傳或預測失敗');
      setResult(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">圖片上傳與預測</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
        </div>
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="圖片預覽" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    點擊選擇圖片
                  </span>
                </div>
              )}
            </div>
          </Label>
          <Input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleUpload} disabled={!selectedImage || isUploading}>
          {isUploading ? (
            <>
              <UploadIcon className="mr-2 h-4 w-4 animate-spin" />
              上傳中...
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              上傳並預測
            </>
          )}
        </Button>
      </CardFooter>
      <CardContent>
        <PredictionResult result={result} error={error} />
      </CardContent>
    </Card>
  );
}
