# ##########爬虫############

IMAGE_CLASS_KEYWORD_MAP = {
    'Formosan_Mountain_Dog': '台灣犬',
    'Mixed_breed_dogs': '米克斯',
    ##'Shiba_Inu': '柴犬',
    ##'Dachshund': '臘腸犬',
    ##'Bichon_Frise': '比熊犬',
    ##'Corgi': '柯基犬',
    ##'Akita_Inu': '秋田犬',
    ##'Dalmatian': '大麥町犬',
}
IMAGES_ROOT = 'images'
SPIDER_DOWNLOAD_PAGES = 2  # 下载每个类别10页的图片

# #########数据###########

SAMPLES_PER_CLASS = 250
CLASSES = ['formosan', 'shiba', 'dachshund', 'bichon', 'corgi', 'akita', 'dalmatian','Chihuahua','Maltese_dog','Shih-Tzu','Rhodesian_ridgeback','Afghan_hound','beagle','whippet','Norwegian_elkhound','Weimaraner','Yorkshire_terrier','Boston_bull','miniature_schnauzer','West_Highland_white_terrier','golden_retriever','Labrador_retriever','Old_English_sheepdog','Shetland_sheepdog','Border_collie','Rottweiler','German_shepherd','Doberman','miniature_pinscher','Tibetan_mastiff','French_bulldog','Saint_Bernard','malamute','Siberian_husky','Samoyed','pug','Pomeranian','chow','poodle']
CLASS_NUM = len(CLASSES)
CLASSES = [
    'formosan',
    'shiba',
    'dachshund',
    'bichon',
    'corgi',
    'akita',
    'dalmatian',
    'Chihuahua',
    'Maltese_dog',
    'Shih-Tzu',
    'Rhodesian_ridgeback',
    'Afghan_hound',
    'beagle',
    'whippet',
    'Norwegian_elkhound',
    'Weimaraner',
    'Yorkshire_terrier',
    'Boston_bull',
    'miniature_schnauzer',
    'West_Highland_white_terrier',
    'golden_retriever',
    'Labrador_retriever',
    'Old_English_sheepdog',
    'Shetland_sheepdog',
    'Border_collie',
    'Rottweiler',
    'German_shepherd',
    'Doberman',
    'miniature_pinscher',
    'Tibetan_mastiff',
    'French_bulldog',
    'Saint_Bernard',
    'malamute',
    'Siberian_husky',
    'Samoyed',
    'pug',
    'Pomeranian',
    'chow',
    'poodle'
]
# 类别到编号的映射
CLASS_CODE_MAP = {
    'formosan': 0,
    'shiba': 1,
    'dachshund': 2,
    'bichon': 3,
    'corgi': 4,
    'akita': 5,
    'dalmatian': 6,
    'Chihuahua':7,
    'Maltese_dog':8,
    'Shih-Tzu':9,
    'Rhodesian_ridgeback':10,
    'Afghan_hound':11,
    'beagle':12,
    'whippet':13,
    'Norwegian_elkhound':14,
    'Weimaraner':15,
    'Yorkshire_terrier':16,
    'Boston_bull':17,
    'miniature_schnauzer':18,
    'West_Highland_white_terrier':19,
    'golden_retriever':20,
    'Labrador_retriever':21,
    'Old_English_sheepdog':22,
    'Shetland_sheepdog':23,
    'Border_collie':24,
    'Rottweiler':25,
    'German_shepherd':26,
    'Doberman':27,
    'miniature_pinscher':28,
    'Tibetan_mastiff':29,
    'French_bulldog':30,
    'Saint_Bernard':31,
    'malamute':32,
    'Siberian_husky':33,
    'Samoyed':34,
    'pug':35,
    'Pomeranian':36,
    'chow':37,
    'poodle':38
}
RANDOM_SEED = 13
TRAIN_DATASET = 0.7
DEV_DATASET = 0.15
TEST_DATASET = 0.15
BATCH_SIZE = 16
IMAGE_MEAN = [0.485, 0.456, 0.406]
IMAGE_STD = [0.299, 0.224, 0.225]

# #########训练#########

LEARNING_RATE = 0.0001
TRAIN_EPOCHS = 80
MODEL_PATH = r"C:\Users\Asus\Desktop\Project\pet\Pet\breads\pets_classifer-master\model.h5"

# ########Web#########

WEB_PORT = 5000