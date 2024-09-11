# -*- coding: utf-8 -*-
import tensorflow as tf
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
import models
import settings
import os

app = Flask(__name__)

# 加载模型
model = models.my_densenet()
model.load_weights(settings.MODEL_PATH)

class_names = ['台灣土狗', '柴犬', '臘腸狗', '比熊犬', '柯基', '秋田犬', '大麥町犬', '吉娃娃', '馬爾濟斯', '西施犬', '羅得西亞背脊犬', '阿富汗獵犬', '米格魯', '惠比特犬', '挪威獵麋犬', '威瑪犬', '約克夏㹴', '波士頓㹴', '迷你雪納瑞', '西高地白㹴', '黃金獵犬', '拉不拉多犬', '英國古代牧羊犬', '喜樂蒂牧羊犬', '邊境牧羊犬', '羅威那', '德國牧羊犬', '杜賓犬', '迷你品犬', '藏獒', '法國鬥牛犬', '聖伯納犬', '阿拉斯加雪橇犬', '哈士奇', '薩摩耶犬', '巴哥犬', '博美犬', '鬆獅犬', '貴賓狗']

def preprocess_image(image):
    # 確保圖像是RGB格式
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # 調整圖片大小
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    
    return image

def predict_image(image):
    # 進行預測
    img = preprocess_image(image)
    predictions = model.predict(img)
    
    # 獲取信心度最高的兩個類別及其信心度
    top_two_indices = np.argsort(predictions[0])[-2:]
    top_two_indices = top_two_indices[::-1]
    top_two_confidences = predictions[0][top_two_indices]
    
    return top_two_indices, top_two_confidences

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file and file.filename != '':
        image = Image.open(file)
        top_two_indices, top_two_confidences = predict_image(image)
        
        result = {
            "first_prediction": {
                "class": class_names[top_two_indices[0]],
                "confidence": float(top_two_confidences[0])
            },
            "second_prediction": {
                "class": class_names[top_two_indices[1]],
                "confidence": float(top_two_confidences[1])
            }
        }
        
        return jsonify(result)
    else:
        return jsonify({"error": "Invalid image file"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
