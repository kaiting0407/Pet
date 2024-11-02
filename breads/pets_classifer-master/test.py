import tensorflow as tf
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
import models
import settings
import requests
from io import BytesIO
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载模型
model = models.my_densenet()
model.load_weights(settings.MODEL_PATH)

class_names = ['台灣土狗', '柴犬', '臘腸狗', '比熊犬', '柯基', '秋田犬', '大麥町犬', '吉娃娃', '馬爾濟斯', '西施犬', 
               '羅得西亞背脊犬', '阿富汗獵犬', '米格魯', '惠比特犬', '挪威獵麋犬', '威瑪犬', '約克夏㹴', '波士頓㹴', 
               '迷你雪納瑞', '西高地白㹴', '黃金獵犬', '拉不拉多犬', '英國古代牧羊犬', '喜樂蒂牧羊犬', '邊境牧羊犬', 
               '羅威那', '德國牧羊犬', '杜賓犬', '迷你品犬', '藏獒', '法國鬥牛犬', '聖伯納犬', '阿拉斯加雪橇犬', 
               '哈士奇', '薩摩耶犬', '巴哥犬', '博美犬', '鬆獅犬', '貴賓狗']

def preprocess_image(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

def predict_image(image):
    img = preprocess_image(image)
    predictions = model.predict(img)
    top_two_indices = np.argsort(predictions[0])[-2:][::-1]
    top_two_confidences = predictions[0][top_two_indices]
    return top_two_indices, top_two_confidences

@app.route('/predict', methods=['POST'])
def predict():
    if 'url' in request.form:
        image_url = request.form['url']
        try:
            response = requests.get(image_url)
            image = Image.open(BytesIO(response.content))
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
            logger.info(f"Prediction result: {result}")
            return jsonify(result)
        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            return jsonify({"error": f"Image processing failed: {str(e)}"}), 500

    elif 'file' in request.files:
        file = request.files['file']
        try:
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
            logger.info(f"Prediction result: {result}")
            return jsonify(result)
        except Exception as e:
            logger.error(f"Image processing failed: {e}")
            return jsonify({"error": f"Image processing failed: {str(e)}"}), 500

    return jsonify({"error": "No file or URL provided"}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
