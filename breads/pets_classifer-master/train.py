import tensorflow as tf
from data import train_db, dev_db
import models
import settings
import matplotlib.pyplot as plt

# 从models文件中导入模型
model = models.my_densenet()
model.summary()

# 配置优化器、损失函数、以及监控指标
model.compile(tf.keras.optimizers.Adam(settings.LEARNING_RATE), 
              loss=tf.keras.losses.categorical_crossentropy,
              metrics=['accuracy'])

# 在每个epoch结束后尝试保存模型参数，只有当前参数的val_accuracy比之前保存的更优时，才会覆盖掉之前保存的参数
model_check_point = tf.keras.callbacks.ModelCheckpoint(filepath=settings.MODEL_PATH, monitor='val_accuracy',
                                                       save_best_only=True)

# 使用tf.keras的高级接口进行训练，并记录训练过程
history = model.fit(train_db, epochs=settings.TRAIN_EPOCHS, 
                    validation_data=dev_db, 
                    callbacks=[model_check_point])

# 绘制训练和验证的损失、准确率随epoch变化的图表
plt.figure(figsize=(12, 4))

# 绘制损失图
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Training and Validation Loss')
plt.legend()

# 绘制准确率图
plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.title('Training and Validation Accuracy')
plt.legend()

# 显示图表
plt.show()
