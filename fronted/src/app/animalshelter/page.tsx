"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnimalData() {
  const [animalData, setAnimalData] = useState([]);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get('https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL');
        setAnimalData(response.data);  
      } catch (error) {
        console.error('Error fetching animal data:', error);
      }
    };

    fetchAnimalData();
  }, []);

  return (
    <div>
      <h1>動物領養資料</h1>
      <ul>
        {animalData.map((animal, index) => (
          <li key={index}>
            <strong>品種: </strong>{animal.animal_kind} <br />
            <strong>顏色: </strong>{animal.animal_colour} <br />
            <strong>性別: </strong>{animal.animal_sex} <br />
            <strong>收容所: </strong>{animal.shelter_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
