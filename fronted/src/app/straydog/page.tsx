"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import './DogListing.css'; // Import a CSS file for styling
import  Header  from "@/components/component/Header";
function DogListing() {
  const [breeds] = useState([
    '台灣土狗', '柴犬', '臘腸狗', '比熊犬', '柯基', '秋田犬', '大麥町犬', '吉娃娃', '馬爾濟斯', '西施犬',
    '羅得西亞背脊犬', '阿富汗獵犬', '米格魯', '惠比特犬', '挪威獵麋犬', '威瑪犬', '約克夏㹴', '波士頓㹴',
    '迷你雪納瑞', '西高地白㹴', '黃金獵犬', '拉不拉多犬', '英國古代牧羊犬', '喜樂蒂牧羊犬', '邊境牧羊犬',
    '羅威那', '德國牧羊犬', '杜賓犬', '迷你品犬', '藏獒', '法國鬥牛犬', '聖伯納犬', '阿拉斯加雪橇犬',
    '哈士奇', '薩摩耶犬', '巴哥犬', '博美犬', '鬆獅犬', '貴賓狗'
  ]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [dogs, setDogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const cities = [
    "臺北市", "新北市", "桃園市", "臺中市", "臺南市", "高雄市", "新竹縣", "苗栗縣", "彰化縣",
    "南投縣", "雲林縣", "嘉義縣", "屏東縣", "宜蘭縣", "花蓮縣", "臺東縣", "澎湖縣", "金門縣",
    "連江縣", "基隆市", "新竹市", "嘉義市"
  ];

  useEffect(() => {
    axios.post('http://localhost:3001/dog', {
      location: selectedLocation || '',
      breed: selectedBreed || '',
      page: page
    })
    .then(response => {
      setDogs(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    })
    .catch(error => console.error('Error fetching dogs:', error));
  }, [page, selectedBreed, selectedLocation]);

  const handleSearch = () => {
    setPage(1);
  };

  return (
    
    <div className="dog-listing">
      <Header />
      <div className="search-section">
        <select onChange={e => setSelectedBreed(e.target.value)}>
          <option value="">選擇品種</option>
          {breeds.map(breed => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>

        <select onChange={e => setSelectedLocation(e.target.value)}>
          <option value="">選擇地點</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <div className="dog-list">
        {dogs.length > 0 ? (
          dogs.map(dog => (
            <div key={dog.id} className="dog-card">
              <img src={dog.album_file || "default.jpg"} alt={dog.animal_kind} className="dog-image"/>
              <div className="dog-info">
                <p><strong>{dog.animal_kind}</strong> - {dog.animal_done?.predicted_breed || "未知"}</p>
                <p>收容所：{dog.shelter_name || "未知"}</p>
                <p>電話：{dog.shelter_tel || "無"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">無符合條件的狗。</p>
        )}
      </div>

      <div className="pagination">
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
