"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Searchdogs } from './Searchdogs'; // 引入搜尋組件


export default function AllDog() {
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);

  // 獲取所有狗的資料
  const fetchAllDogs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getalldog");
      setDogs(res.data);
      setFilteredDogs(res.data); // 預設顯示所有狗
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  // 定義搜尋功能
  const handleSearch = (searchTerm) => {
    const filtered = dogs.filter(dog => 
      dog.dogname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDogs(filtered); // 更新篩選後的狗列表
  };

  useEffect(() => {
    fetchAllDogs();
  }, []);

  return (
    <div>
      <Link href={'/'}>回首頁</Link>
      <Searchdogs onSearch={handleSearch} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredDogs.map((dog) => (
          <Link href={`/dogdetail/${dog.dogid}`} key={dog.dogid}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
              <img src={dog.image} alt={dog.dogname} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-center">{dog.dogname}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
