"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

function DogListing() {
  const [breeds] = useState([
    '台灣土狗', '柴犬', '臘腸狗', '比熊犬', '柯基', '秋田犬', '大麥町犬', '吉娃娃', '馬爾濟斯', '西施犬',
    '羅得西亞背脊犬', '阿富汗獵犬', '米格魯', '惠比特犬', '挪威獵麋犬', '威瑪犬', '約克夏㹴', '波士頓㹴',
    '迷你雪納瑞', '西高地白㹴', '黃金獵犬', '拉不拉多犬', '英國古代牧羊犬', '喜樂蒂牧羊犬', '邊境牧羊犬',
    '羅威那', '德國牧羊犬', '杜賓犬', '迷你品犬', '藏獒', '法國鬥牛犬', '聖伯納犬', '阿拉斯加雪橇犬',
    '哈士奇', '薩摩耶犬', '巴哥犬', '博美犬', '鬆獅犬', '貴賓狗'
  ]);
  const [selectedBreed, setSelectedBreed] = useState(''); // 選擇的狗品種
  const [selectedLocation, setSelectedLocation] = useState(''); // 選擇的地點
  const [dogs, setDogs] = useState([]); // 狗的資料
  const [page, setPage] = useState(1); // 當前頁面
  const [totalPages, setTotalPages] = useState(1); // 總頁數

  // 城市列表
  const cities = [
    "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "新竹縣", "苗栗縣", "彰化縣",
    "南投縣", "雲林縣", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣",
    "連江縣", "基隆市", "新竹市", "嘉義市"
  ];

  // Fetch dog data when page or search parameters change
  useEffect(() => {
    // 檢查選擇的品種與地點是否有效
    if (selectedBreed && selectedLocation) {
      axios.post('http://localhost:3001/dog', {
        location: selectedLocation,
        breed: selectedBreed,
        page: page
      })
      .then(response => {
        setDogs(response.data.data); // 設定狗的數據
        setTotalPages(response.data.totalPages); // 設定總頁數
      })
      .catch(error => console.error('Error fetching dogs:', error));
    }
  }, [page, selectedBreed, selectedLocation]); // 監聽 page, selectedBreed, selectedLocation 的變化
  

  // 查詢按鈕點擊後重置頁數並觸發查詢
  const handleSearch = () => {
    setPage(1); // 重置頁碼
    // 查詢會自動觸發，因為 selectedBreed 和 selectedLocation 改變會觸發 useEffect
  };

  return (
    <div>
      <div>
        {/* 狗品種下拉選單 */}
        <select onChange={e => setSelectedBreed(e.target.value)}>
          <option value="">選擇品種</option>
          {breeds.map(breed => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        {/* 城市下拉選單 */}
        <select onChange={e => setSelectedLocation(e.target.value)}>
          <option value="">選擇地點</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* 狗列表展示 */}
      <div>
        {dogs.length > 0 ? (
          dogs.map(dog => (
            <div key={dog.id}>
              <img src={dog.album_file} alt={dog.animal_kind} />
              <p>{dog.animal_kind} - {dog.animal_done.predicted_breed}</p>
            </div>
          ))
        ) : (
          <p>無符合條件的狗。</p>
        )}
      </div>

      {/* 分頁按鈕 */}
      <div>
  <button 
    onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
    disabled={page <= 1}
  >
    上一頁
  </button>
  
  <button 
    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
    disabled={page >= totalPages}
  >
    下一頁
  </button>
</div>

    </div>
  );
}

export default DogListing;
