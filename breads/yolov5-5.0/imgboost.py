import cv2
import os
import random
import numpy as np
import time

# 随机选择背景图片
def get_random_background(background_folder):
    background_files = os.listdir(background_folder)
    while background_files:
        random_background_file = random.choice(background_files)
        background_path = os.path.join(background_folder, random_background_file)
        background = cv2.imread(background_path)

        # 检查图片是否成功读取
        if background is not None:
            return cv2.resize(background, (640, 640))  # 调整背景图片到 640x640
        else:
            print(f"Failed to load background image: {background_path}, trying another.")
            background_files.remove(random_background_file)  # 移除无效的背景图片
    
    raise FileNotFoundError("No valid background images found in the folder.")

# 检查狗是否重叠
def is_overlap(existing_boxes, new_box):
    x_new, y_new, w_new, h_new = new_box
    for box in existing_boxes:
        x_existing, y_existing, w_existing, h_existing = box
        # 检查是否有重叠
        if not (x_new + w_new <= x_existing or x_new >= x_existing + w_existing or
                y_new + h_new <= y_existing or y_new >= y_existing + h_existing):
            return True
    return False

# 将图片放置在画布上的随机不重叠位置
def place_image_on_canvas(canvas, image, existing_boxes):
    h_canvas, w_canvas = canvas.shape[:2]
    h_image, w_image = image.shape[:2]

    # 最大尝试次数，避免无限循环
    max_attempts = 100
    attempts = 0

    while attempts < max_attempts:
        x_offset = random.randint(0, w_canvas - w_image)
        y_offset = random.randint(0, h_canvas - h_image)

        new_box = (x_offset, y_offset, w_image, h_image)

        # 检查是否与其他图片重叠
        if not is_overlap(existing_boxes, new_box):
            existing_boxes.append(new_box)
            canvas[y_offset:y_offset+h_image, x_offset:x_offset+w_image] = image
            return canvas, existing_boxes

        attempts += 1

    # 如果达到最大尝试次数仍无法找到合适位置，放弃这只狗
    return canvas, existing_boxes

# 将1到3只狗放置到随机背景上，且不重叠
def augment_image_with_dogs(dog_folder, background_folder):
    # 创建640x640的随机背景
    canvas = get_random_background(background_folder)
    existing_boxes = []  # 存储已放置的狗的边界框

    # 随机选择 1 到 3 只狗
    dog_files = random.sample(os.listdir(dog_folder), random.randint(2, 3))

    for dog_file in dog_files:
        dog_path = os.path.join(dog_folder, dog_file)
        dog_image = cv2.imread(dog_path)

        # 检查狗图片是否成功读取
        if dog_image is None:
            print(f"Failed to load dog image: {dog_path}, skipping.")
            continue

        # 转换颜色为 RGB 格式
        dog_image = cv2.cvtColor(dog_image, cv2.COLOR_BGR2RGB)

        # 检查图片尺寸，如果大于 640x640 则跳过
        h_image, w_image = dog_image.shape[:2]
        if w_image > 640 or h_image > 640:
            print(f"Skipping {dog_file} because it is larger than 640x640.")
            continue

        # 随机缩放图片，不进行最大化
        scale_factor = random.uniform(0.5, 0.8)  # 随机缩小比例
        new_w = int(dog_image.shape[1] * scale_factor)
        new_h = int(dog_image.shape[0] * scale_factor)
        resized_dog_image = cv2.resize(dog_image, (new_w, new_h))

        # 将狗放置在随机不重叠位置，无需旋转
        canvas, existing_boxes = place_image_on_canvas(canvas, resized_dog_image, existing_boxes)

    return canvas

# 读取文件夹中的图片并进行数据增强
def augment_images_in_folder(dog_folder, background_folder, output_folder, num_augmented_copies=3):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for _ in range(num_augmented_copies):
        augmented_image = augment_image_with_dogs(dog_folder, background_folder)
        augmented_image = cv2.cvtColor(augmented_image, cv2.COLOR_RGB2BGR)  # 转回 BGR 格式以供保存

        # 使用时间戳和随机数生成唯一文件名
        augmented_filename = f"augmented_{int(time.time())}_{random.randint(0, 10000)}.jpg"
        augmented_image_path = os.path.join(output_folder, augmented_filename)
        cv2.imwrite(augmented_image_path, augmented_image)
        print(f"Saved augmented image: {augmented_image_path}")

# 设置文件夹路径
dog_folder = "C:/Users/User/Desktop/test"  # 替換成你的狗圖像資料夾
background_folder = "C:/Users/User/Desktop/back"  # 替換成你背景圖片的資料夾
output_folder = "C:/Users/User/Desktop/finn"  # 替換成增強後的圖像存放資料夾

# 執行數據增強，從用戶輸入中動態控制生成數量
augment_images_in_folder(dog_folder, background_folder, output_folder, num_augmented_copies=8)
