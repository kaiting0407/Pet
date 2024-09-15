import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

interface Prediction {
  class: string | null;
  confidence: number | null;
}

interface PredictionResultProps {
  result: {
    first_prediction: Prediction;
    second_prediction: Prediction;
  } | null;
  error: string | null;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result, error }) => {
  const renderPrediction = (prediction: Prediction, label: string) => (
    <div className="flex items-center space-x-2 mb-2">
      <CheckCircle2 className="text-green-500" />
      <span className="font-medium">{label}:</span>
      <span>{prediction.class || "無資料"}</span>
      <span className="text-sm text-gray-500">
        (信心度: {prediction.confidence !== null ? `${(prediction.confidence * 100).toFixed(2)}%` : "無資料"})
      </span>
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
        ) : result && result.first_prediction && result.second_prediction ? (
          <>
            {renderPrediction(result.first_prediction, "第一預測")}
            {renderPrediction(result.second_prediction, "第二預測")}
          </>
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