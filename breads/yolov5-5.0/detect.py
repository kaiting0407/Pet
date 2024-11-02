from flask import Flask, request, jsonify
import numpy as np
import cv2
import torch
import base64
from models.experimental import attempt_load
from utils.general import check_img_size, non_max_suppression, scale_coords
from utils.torch_utils import select_device

app = Flask(__name__)

# 模型載入
device = select_device('')
weights = 'yolov5-5.0/weights/best.pt'
try:
    model = attempt_load(weights, map_location=device)
    stride = int(model.stride.max())
    imgsz = check_img_size(640, s=stride)
    half = device.type != 'cpu'
    if half:
        model.half()
except Exception as e:
    print("Error loading model:", str(e))

@app.route('/detect', methods=['POST'])
def detect_objects():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "未上傳圖片"}), 400
        
        file = request.files['image']
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
        
        # 調整影像大小
        resized_image = cv2.resize(image, (imgsz, imgsz))
        img = torch.from_numpy(resized_image).to(device)
        img = img.permute(2, 0, 1).unsqueeze(0)
        img = img.half() if half else img.float()
        img /= 255.0
        
        # YOLO 模型預測
        pred = model(img, augment=True)[0]
        pred = non_max_suppression(pred, conf_thres=0.1, iou_thres=0.3, classes=None, agnostic=False)
        
        # 儲存裁剪後的圖像
        cropped_images = []
        for i, det in enumerate(pred):
            if len(det):
                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], resized_image.shape).round()
                for *xyxy, conf, cls in det:
                    x1, y1, x2, y2 = int(xyxy[0]), int(xyxy[1]), int(xyxy[2]), int(xyxy[3])
                    
                    # 檢查座標是否在影像範圍內
                    if x1 < 0 or y1 < 0 or x2 > resized_image.shape[1] or y2 > resized_image.shape[0]:
                        print(f"Skipping invalid crop coordinates: ({x1}, {y1}), ({x2}, {y2})")
                        continue
                    
                    crop_img = resized_image[y1:y2, x1:x2]
                    
                    # 檢查裁剪圖像是否成功
                    if crop_img.size == 0:
                        print("Crop image size is 0, skipping this crop.")
                        continue
                    
                    # 縮小裁剪圖像以減少 base64 編碼的長度
                    crop_img = cv2.resize(crop_img, (128, 128))

                    # 編碼為 base64
                    success, buffer = cv2.imencode('.jpg', crop_img)
                    if success:
                        img_base64 = base64.b64encode(buffer).decode('utf-8')
                        cropped_images.append({
                            "filename": f"crop_{i}.jpg",
                            "image_data": img_base64,
                            "prediction": {
                                "first_prediction": {"class": "拉不拉多犬", "confidence": 0.986},
                                "second_prediction": {"class": "黃金獵犬", "confidence": 0.0095}
                            }
                        })
                    else:
                        print("Error encoding image")

        # 確認最終回傳的資料結構
        print("Final JSON data to return:", {"predictions": cropped_images})
        return jsonify({"predictions": cropped_images})
    
    except Exception as e:
        # 回傳錯誤訊息至前端
        print("An error occurred:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
