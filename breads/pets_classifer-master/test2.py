# -*- coding: utf-8 -*-
import tensorflow as tf
import numpy as np
from PIL import Image, UnidentifiedImageError
from pathlib import Path
import models
import settings

# 加載模型
model = models.my_densenet()
model.load_weights(settings.MODEL_PATH)

# 類別名稱
class_names = ['台灣土狗', '柴犬', '臘腸狗', '比熊犬', '柯基', '秋田犬', '大麥町犬', '吉娃娃', '馬爾濟斯', '西施犬', 
               '羅得西亞背脊犬', '阿富汗獵犬', '米格魯', '惠比特犬', '挪威獵麋犬', '威瑪犬', '約克夏㹴', '波士頓㹴', 
               '迷你雪納瑞', '西高地白㹴', '黃金獵犬', '拉不拉多犬', '英國古代牧羊犬', '喜樂蒂牧羊犬', '邊境牧羊犬', 
               '羅威那', '德國牧羊犬', '杜賓犬', '迷你品犬', '藏獒', '法國鬥牛犬', '聖伯納犬', '阿拉斯加雪橇犬', 
               '哈士奇', '薩摩耶犬', '巴哥犬', '博美犬', '鬆獅犬', '貴賓狗']

# 圖片預處理
def preprocess_image(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize((224, 224))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# 圖片辨識
def predict_image(image):
    img = preprocess_image(image)
    predictions = model.predict(img)
    top_index = np.argmax(predictions[0])
    top_confidence = predictions[0][top_index]
    return top_index, top_confidence

# 讀取圖片並進行辨識，將結果寫入單一的文字檔
def process_images(image_folder, output_file):
    # 確保輸出文件存在，使用 'a' 模式（追加寫入）
    with open(output_file, 'a', encoding='utf-8') as f:
        for image_path in Path(image_folder).glob('*.png'):
            try:
                # 嘗試打開圖片
                image = Image.open(image_path)
                top_index, top_confidence = predict_image(image)
                predicted_class = class_names[top_index]
                
                # 解析 animal_id 從文件名 (假設文件名是 animal_id.png)
                animal_id = image_path.stem

                # 將結果寫入同一個文字檔
                f.write(f"Image: {image_path.name}\n")
                f.write(f"Predicted Class: {predicted_class}\n")
                f.write(f"Confidence: {top_confidence:.4f}\n")
                f.write("\n")  # 換行分隔每張圖片的結果

                print(f'圖片 {image_path.name} 已處理，結果已寫入 {output_file}')
            
            except UnidentifiedImageError:
                f.write(f"Image: {image_path.name}\n")
                f.write("無法識別的圖片格式，辨識失敗\n")
                f.write("\n")  # 換行分隔每張圖片的結果
                print(f"無法識別的圖片格式: {image_path.name}")
            except Exception as e:
                f.write(f"Image: {image_path.name}\n")
                f.write(f"辨識失敗: {e}\n")
                f.write("\n")  # 換行分隔每張圖片的結果
                print(f'圖片處理失敗 {image_path.name}: {e}')

# 主函數
def main():
    # 設定圖片來源資料夾和輸出文件路徑
    image_folder = 'C:/Users/Asus/Desktop/Project/pet/Pet/backend/animal_images'
    output_file = 'C:/Users/Asus/Desktop/Project/pet/Pet/backend/results/all_results.txt'

    # 處理圖片並輸出結果
    process_images(image_folder, output_file)

if __name__ == '__main__':
    main()
