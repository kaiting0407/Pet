"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnimalDataWithBreedRecognition() {
  const [animalData, setAnimalData] = useState<any[]>([]);
  const [recognitionResults, setRecognitionResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get('https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL');
        const dogData = response.data.filter((animal: any) => animal.animal_kind === "狗");
        setAnimalData(dogData); // 過濾只要狗的資料
        // 自動辨識每隻狗的品種
        dogData.forEach(dog => recognizeBreed(dog));
      } catch (error) {
        console.error('Error fetching animal data:', error);
      }
    };
    fetchAnimalData();
  }, []);

  const recognizeBreed = async (dog: any) => {
    if (!dog.album_file) {
      console.warn(`No image found for dog: ${dog.animal_Variety}`);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/predict', {
        url: dog.album_file // 傳遞圖片網址
      });

      if (!response.data.error) {
        setRecognitionResults(prev => ({
          ...prev,
          [dog.animal_id]: response.data // 存儲每隻狗的辨識結果
        }));
      } else {
        console.error(`Error recognizing breed for dog ${dog.animal_Variety}:`, response.data.error);
      }
    } catch (error) {
      console.error(`Error recognizing breed for dog ${dog.animal_Variety}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>動物領養資料</h1>
      {loading && <p>辨識中...</p>}
      <ul>
        {animalData.map((animal, index) => (
          <li key={index}>
            <strong>品種: </strong>
            {/* 如果有辨識結果，顯示辨識品種，否則顯示 API 的品種 */}
            {recognitionResults[animal.animal_id] 
              ? recognitionResults[animal.animal_id].first_prediction.class 
              : animal.animal_Variety} 
            <br />
            <strong>顏色: </strong>{animal.animal_colour} <br />
            <strong>性別: </strong>{animal.animal_sex} <br />
            <strong>收容所: </strong>{animal.shelter_name} <br />
            {animal.album_file && <img src={animal.album_file} alt={animal.animal_Variety} width="200" />}
            {recognitionResults[animal.animal_id] && (
              <div>
                <p>辨識結果: {recognitionResults[animal.animal_id].first_prediction.class}</p>
                <p>信心度: {(recognitionResults[animal.animal_id].first_prediction.confidence * 100).toFixed(2)}%</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
