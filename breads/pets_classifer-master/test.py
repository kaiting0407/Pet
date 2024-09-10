# -*- coding: utf-8 -*-
import tensorflow as tf
import numpy as np
import os
from PIL import Image
import settings
import models

# 加载模型
model = models.my_densenet()
model.load_weights(settings.MODEL_PATH)

def preprocess_image(image_path):
    # 读取图片
    img = Image.open(image_path)
    
    # 确保图像是RGB格式，如果是RGBA或其他格式则转换为RGB
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # 调整图片大小到模型输入大小
    img = img.resize((224, 224))  # 假设模型输入大小是224x224
    
    # 将图片转化为numpy数组，并归一化像素值到[0, 1]
    img = np.array(img) / 255.0
    
    # 添加一个额外的维度，适配模型的输入
    img = np.expand_dims(img, axis=0)
    
    return img

def predict_image(image_path):
    # 预处理图片
    img = preprocess_image(image_path)
    
    # 使用模型进行预测
    predictions = model.predict(img)
    
    # 获取信心度最高的两个类别及其信心度
    top_two_indices = np.argsort(predictions[0])[-2:]  # 获取最高的两个索引
    top_two_indices = top_two_indices[::-1]  # 将它们按降序排列
    top_two_confidences = predictions[0][top_two_indices]
    
    return top_two_indices, top_two_confidences

def test_images_in_folder(folder_path, class_names):
    # 遍历文件夹中的所有图片
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
            image_path = os.path.join(folder_path, filename)
            top_two_indices, top_two_confidences = predict_image(image_path)
            
            # 输出第一个预测结果
            print(f"Image: {filename} - Predicted class: {class_names[top_two_indices[0]]} with confidence {top_two_confidences[0]:.2f}")
            
            # 如果第一个置信度低于90%，则输出第二个预测结果
            if top_two_confidences[0] < 0.9:
                print(f"  Second prediction: {class_names[top_two_indices[1]]} with confidence {top_two_confidences[1]:.2f}")


# 示例
test_folder_path = 'C://Users//User//Desktop//breads//testimage'  # 替换为你的测试文件夹路径
class_names = ['台灣土狗','柴犬', '臘腸狗', '比熊犬', '柯基', '秋田犬', '大麥町犬','吉娃娃','馬爾濟斯','西施犬','羅得西亞背脊犬','阿富汗獵犬','米格魯','惠比特犬','挪威獵麋犬','威瑪犬','約克夏㹴','波士頓㹴','迷你雪納瑞','西高地白㹴','黃金獵犬','拉不拉多犬','英國古代牧羊犬','喜樂蒂牧羊犬','邊境牧羊犬','羅威那','德國牧羊犬','杜賓犬','迷你品犬','藏獒','法國鬥牛犬','聖伯納犬','阿拉斯加雪橇犬','哈士奇','薩摩耶犬','巴哥犬','博美犬','鬆獅犬','貴賓狗']  # 替换为你的类别名称

test_images_in_folder(test_folder_path, class_names)
