import os
from PIL import Image, PngImagePlugin

def is_valid_image(filepath):
    """
    检查文件是否是有效的图像文件（JPEG, PNG, GIF, BMP），并修复PNG文件中的iCCP chunk问题。
    
    :param filepath: 图像文件的路径
    :return: 如果是有效图像文件返回 True，否则返回 False
    """
    try:
        with Image.open(filepath) as img:
            img.verify()  # 检查图像是否有效
            if img.format == "PNG":
                # 处理PNG文件，移除有问题的iCCP chunk
                img = Image.open(filepath)  # 重新打开图像以进行修改
                if "icc_profile" in img.info:
                    img.info.pop("icc_profile")  # 移除错误的iCCP chunk
                    img.save(filepath)  # 保存修复后的图像
            return img.format in ("JPEG", "PNG", "GIF", "BMP")  # 只接受这些格式
    except (IOError, SyntaxError):
        return False

def clean_dataset(directory):
    """
    清理数据集目录，移除不支持的图像文件，并修复PNG文件中的iCCP chunk问题。
    
    :param directory: 包含图像的目录
    """
    for foldername in os.listdir(directory):
        folder_path = os.path.join(directory, foldername)
        if os.path.isdir(folder_path):
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                if not is_valid_image(file_path):
                    print(f"Removing invalid image file: {file_path}")
                    os.remove(file_path)

# 使用示例
dataset_directory = 'C:/Users/User/Desktop/breads/pets_classifer-master/images/'  # 替换为你的数据集路径
clean_dataset(dataset_directory)
