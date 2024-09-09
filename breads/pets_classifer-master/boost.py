from PIL import Image, ImageOps
import os

def flip_image_horizontally(image):
    """
    对图像进行水平翻转。

    :param image: Pillow Image 对象
    :return: 水平翻转后的图像
    """
    return ImageOps.mirror(image)

def process_images(input_dir, output_dir):
    """
    处理输入目录中的所有图片，进行水平翻转，并保存到输出目录。

    :param input_dir: 输入图片目录
    :param output_dir: 输出翻转后图片的目录
    """
    # 检查输出目录是否存在，如果不存在则创建
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # 遍历输入目录中的所有文件
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
            img_path = os.path.join(input_dir, filename)
            img = Image.open(img_path)
            
            # 检查并转换图像模式为 RGB，如果是P模式或带透明度通道的图像
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            flipped_img = flip_image_horizontally(img)  # 进行水平翻转
            flipped_img.save(os.path.join(output_dir, f'flipped_{filename}'))  # 保存翻转后的图像


# 使用示例
input_directory = 'C:/Users/User/Desktop/images/Weimaraner'  # 替换为你的输入图片文件夹路径
output_directory = 'C:/Users/User/Desktop/images/boost'  # 替换为你希望保存增强图片的文件夹路径
process_images(input_directory, output_directory)
