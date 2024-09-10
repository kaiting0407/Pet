from PIL import Image
import os

def resize_images_in_folder(folder_path, size=(640, 640)):
    # 獲取文件夾中的所有文件
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        # 檢查文件是否為圖片文件
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp')):
            try:
                # 打開圖片
                img = Image.open(file_path)
                
                # 修改圖片大小
                img = img.resize(size, Image.Resampling.LANCZOS)  # 使用 LANCZOS 替代 ANTIALIAS
                
                # 保存並覆蓋原圖
                img.save(file_path)
                print(f"已成功修改 {filename}")
            except Exception as e:
                print(f"處理 {filename} 時發生錯誤: {e}")

# 指定目標文件夾路徑
folder_path = "VOCdevkit/images/train"  # 替換成你的實際文件夾路徑
resize_images_in_folder(folder_path)
