"use client";
import { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // 引入 React Icons 來顯示星星
import axios from 'axios';
import BackButton from '@/components/component/backbutton'; // 引入返回按鈕組件

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-500" />);
    }
  }
  return <div className="flex">{stars}</div>; 
};

export default function DogDetailPage({ params }) {
  const { id } = params;
  const [dog, setDog] = useState(null); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/dog/${id}`);
        setDog(response.data);
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching dog data:", error);
        setLoading(false); 
      }
    };

    fetchDog();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dog) {
    return <div>Dog not found</div>;
  }

  return (
    <div className="relative max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* 引入返回按鈕 */}
      <BackButton />

      <h1 className="text-2xl font-bold text-center mb-4">{dog.dogname}</h1>
      <div className="flex justify-center mb-4">
        <img 
          src={dog.image} 
          alt={dog.dogname} 
          className="w-64 h-64 object-cover rounded-lg" // 固定圖片大小為 64x64，並保持圖片的比例
        />
      </div>
      <div className="space-y-2">
        <p><strong>重量:</strong> {dog.Weight}</p>
        <p><strong>預期壽命:</strong> {dog.LifeExpectancy}</p>
        <p className="flex"><strong>與家人相愛程度:</strong> {renderStars(dog.AffectionateWithFamily)}</p>
        <p className="flex"><strong>適合年幼孩子:</strong> {renderStars(dog.GoodWithYoungChildren)}</p>
        <p className="flex"><strong>與其他狗相處融洽:</strong> {renderStars(dog.GoodWithOtherDogs)}</p>
        <p className="flex"><strong>脫落程度:</strong> {renderStars(dog.SheddingLevel)}</p>
        <p className="flex"><strong>毛髮梳理頻率:</strong> {renderStars(dog.CoatGroomingFrequency)}</p>
        <p className="flex"><strong>流口水程度:</strong> {renderStars(dog.DroolingLevel)}</p>
        <p><strong>毛長度:</strong> {dog.CoatLength}</p>
        <p className="flex"><strong>對陌生人開放程度:</strong> {renderStars(dog.OpennessToStrangers)}</p>
        <p className="flex"><strong>趣味程度:</strong> {renderStars(dog.PlayfulnessLevel)}</p>
        <p className="flex"><strong>看門狗/保護性質:</strong> {renderStars(dog.Watchdog)}</p>
        <p className="flex"><strong>環境變化適應性:</strong> {renderStars(dog.AdaptabilityLevel)}</p>
        <p className="flex"><strong>學習力:</strong> {renderStars(dog.TrainabilityLevel)}</p>
        <p className="flex"><strong>吠叫等級:</strong> {renderStars(dog.BarkingLevel)}</p>
        <p><strong>關於品種:</strong> {dog.AboutTheBreed}</p>
        <p><strong>健康狀況:</strong> {dog.Health}</p>
        <p><strong>儀容儀表:</strong> {dog.Grooming}</p>
        <p><strong>所需運動量:</strong> {dog.Exercise}</p>
        <p><strong>訓練:</strong> {dog.Training}</p>
      </div>
    </div>
  );
}
