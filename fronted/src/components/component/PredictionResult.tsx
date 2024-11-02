'use client';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Prediction {
  class: string | null;
  confidence: number | null;
}

interface PredictionResultProps {
  result: {
    predictions: Array<{
      filename: string;
      image_data: string | undefined;  // 圖片 base64 字串，可能為 undefined
      prediction: {
        first_prediction: Prediction;
        second_prediction: Prediction;
      };
    }>;
  } | null;
  error: string | null;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result, error }) => {
  const router = useRouter();

  useEffect(() => {
    if (result && Array.isArray(result.predictions)) {
      result.predictions.forEach((item) => {
        if (item.image_data) {
          console.log("Image data length for", item.filename, ":", item.image_data.length);
        } else {
          console.error(`Image data is undefined for ${item.filename}`);
        }
      });
    } else {
      console.error("Error: predictions is not an array or is missing.");
    }
  }, [result]);

  const handleViewInfo = async (prediction: Prediction) => {
    try {
      const res = await axios.post('http://localhost:3001/getDogInfo', { dogname: prediction.class });
      const dogId = res.data[0]?.dogid;
      if (dogId) {
        router.push(`/dogdetail/${dogId}`);
      } else {
        console.error("No dog ID found");
      }
    } catch (error) {
      console.error('Error fetching dog info:', error);
    }
  };

  const renderPrediction = (prediction: Prediction, label: string) => (
    <div className="flex items-center space-x-2 mb-2">
      <CheckCircle2 className="text-green-500" />
      <span className="font-medium">{label}:</span>
      <span>{prediction.class || "無資料"}</span>
      <span className="text-sm text-gray-500">
        (信心度: {prediction.confidence !== null ? `${(prediction.confidence * 100).toFixed(2)}%` : "無資料"})
      </span>
      <Button variant="link" onClick={() => handleViewInfo(prediction)}>
        查看他的訊息
      </Button>
    </div>
  );

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-bold">預測結果</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="flex items-center space-x-2 text-red-500">
            <XCircle />
            <span>{error}</span>
          </div>
        ) : result && Array.isArray(result.predictions) && result.predictions.length > 0 ? (
          result.predictions.map((item, index) => (
            <div key={index} className="mb-4 border-b border-gray-200 pb-4">
              
              {/* 顯示 base64 字串的預覽 */}


              {/* 顯示裁剪圖片 */}
              {item.image_data ? (
                <img
                  src={`data:image/jpeg;base64,${item.image_data}`}
                  alt={`Cropped image ${index}`}
                  className="w-full h-auto rounded-md mb-4 shadow-lg"
                  onError={(e) => console.error(`Image load error for ${item.filename}`, e)}
                />
              ) : (
                <div className="text-red-500">圖片數據不可用</div>
              )}
              
              {renderPrediction(item.prediction.first_prediction, "第一預測")}
              {renderPrediction(item.prediction.second_prediction, "第二預測")}
            </div>
          ))
        ) : (
          <div className="flex items-center space-x-2 text-yellow-500">
            <AlertTriangle />
            <span>請上傳圖片進行預測</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResult;
