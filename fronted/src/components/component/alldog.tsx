"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AllDog() {
  const [dogs, setDogs] = useState([]);

  const fetchAllDogs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/getalldog");
      setDogs(res.data); 
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  useEffect(() => {
    fetchAllDogs();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {dogs.map((dog) => (
        <Link href={`/dogdetail/${dog.dogid}`} key={dog.dogname}>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
            <img src={dog.image} alt={dog.dogname} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-center">{dog.dogname}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
