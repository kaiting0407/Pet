const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!imageUrl) {
    setError('請提供圖片網址');
    return;
  }

  setLoading(true);
  setError(null);
  setResult(null);

  try {
    const response = await axios.post('/api/predict', {
      url: imageUrl,
    });

    if (response.data.error) {
      setError('辨識失敗，請確認圖片是否有效');
    } else {
      setResult(response.data.first_prediction.class);
      setConfidence(response.data.first_prediction.confidence * 100);
    }
  } catch (error: any) {
    // 打印出具體的錯誤信息
    console.error('錯誤信息:', error.response || error.message);
    setError(`圖片上傳或辨識失敗: ${error.response?.data?.error || error.message}`);
  } finally {
    setLoading(false);
  }
};
