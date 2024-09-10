"use client";
import { useState } from 'react';
import { Input } from "@/components/ui/input"; // 假設這是你使用的輸入組件
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from 'next/link';

export function Searchdogs({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // 處理按下 Enter 鍵
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // 當按下 Enter 時觸發搜尋
    }
  };

  // 定義搜尋功能
  const handleSearch = () => {
    onSearch(searchTerm); // 傳入搜尋詞
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <div className="relative w-full max-w-sm">
        
        <Input 
          type="text" 
          placeholder="Search..." 
          className="pr-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown} // 監聽按鍵事件
          
        />
        
      </div>
      
      <Button onClick={handleSearch}>搜尋</Button>
    </div>
    
  );
}
