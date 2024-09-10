from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import os
import requests
from PIL import Image
import io
import hashlib

# 設定要抓取的狗品種
dog_breeds = [
    "台灣犬 Formosan Mountain Dog",
    "米克斯 Mixed-breed dogs",
    "柴犬 Shiba Inu",
    "臘腸犬 Dachshund",
    "比熊犬 Bichon Frise",
    "柯基犬 Corgi",
    "秋田犬 Akita Inu",
    "大麥町犬 Dalmatian"
]

# 創建保存圖片的目錄
if not os.path.exists('dog_images'):
    os.mkdir('dog_images')

# 初始化Selenium WebDriver
driver = webdriver.Chrome()  # 确保已安装了ChromeDriver

# 用於存儲已下載圖片的哈希值
hashes = set()

def is_image_valid(img_data):
    """檢查圖片是否有效並且符合最低分辨率要求"""
    try:
        image = Image.open(io.BytesIO(img_data))
        if image.width < 150 or image.height < 150:
            return False
        return True
    except Exception as e:
        return False

def get_image_hash(img_data):
    """計算圖片的哈希值，用於檢測重複圖片"""
    image = Image.open(io.BytesIO(img_data))
    image_hash = hashlib.md5(image.tobytes()).hexdigest()
    return image_hash

for breed in dog_breeds:
    # 用於保存圖片的目錄
    breed_dir = os.path.join('dog_images', breed.replace(" ", "_"))
    if not os.path.exists(breed_dir):
        os.mkdir(breed_dir)

    # 打開Google圖片搜索頁面
    search_url = f"https://www.google.com/search?hl=en&tbm=isch&q={breed}"
    driver.get(search_url)

    # 滾動頁面以加載更多圖片
    for _ in range(5):  # 可以調整滾動次數以加載更多圖片
        driver.find_element_by_tag_name("body").send_keys(Keys.END)
        time.sleep(2)  # 等待頁面加載

    # 獲取圖片的元素
    img_elements = driver.find_elements_by_css_selector("img.Q4LuWd")

    downloaded_count = 0

    for img_element in img_elements:
        try:
            # 點擊圖片以打開大圖
            img_element.click()
            time.sleep(1)  # 等待大圖加載

            # 獲取大圖的URL
            img_url = driver.find_element_by_css_selector("img.n3VNCb").get_attribute("src")
            if not img_url.startswith('http'):
                continue

            # 發送請求下載圖片
            img_data = requests.get(img_url).content

            # 檢查圖片質量
            if not is_image_valid(img_data):
                print(f"Skipped low-quality image from {img_url}")
                continue

            # 計算圖片哈希值並檢查是否重複
            img_hash = get_image_hash(img_data)
            if img_hash in hashes:
                print(f"Skipped duplicate image from {img_url}")
                continue

            # 如果圖片質量合格且不重複，保存圖片並記錄哈希值
            img_name = f"{breed_dir}/{breed.replace(' ', '_')}_{downloaded_count + 1}.jpg"
            with open(img_name, 'wb') as img_file:
                img_file.write(img_data)

            hashes.add(img_hash)
            downloaded_count += 1
            print(f"Saved {img_name}")

            # 限制下載的圖片數量，例如只下載150張圖片
            if downloaded_count >= 150:
                break

        except Exception as e:
            print(f"Could not download image. Error: {e}")
            continue

    print(f"Downloaded {downloaded_count} images of {breed}")

# 關閉瀏覽器
driver.quit()
