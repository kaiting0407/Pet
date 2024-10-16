import express from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const cors = require('cors');
const app = express()
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.post("/adddog", async (req, res) => {
    const {
        dogname,
        image,
        Weight,
        LifeExpectancy,
        AffectionateWithFamily,
        GoodWithYoungChildren,
        GoodWithOtherDogs,
        SheddingLevel,
        CoatGroomingFrequency,
        DroolingLevel,
        CoatLength,
        OpennessToStrangers,
        PlayfulnessLevel,
        Watchdog,
        AdaptabilityLevel,
        TrainabilityLevel,
        BarkingLevel,
        AboutTheBreed,
        Health,
        Grooming,
        Exercise,
        Training
    } = req.body;

    try {
        const newDog = await prisma.dog.create({
            data: {
                dogid: uuidv4(), 
                dogname,
                image,
                Weight,
                LifeExpectancy,
                AffectionateWithFamily: parseInt(AffectionateWithFamily),
                GoodWithYoungChildren: parseInt(GoodWithYoungChildren),
                GoodWithOtherDogs: parseInt(GoodWithOtherDogs),
                SheddingLevel: parseInt(SheddingLevel),
                CoatGroomingFrequency: parseInt(CoatGroomingFrequency),
                DroolingLevel: parseInt(DroolingLevel),
                CoatLength,
                OpennessToStrangers: parseInt(OpennessToStrangers),
                PlayfulnessLevel: parseInt(PlayfulnessLevel),
                Watchdog: parseInt(Watchdog),
                AdaptabilityLevel: parseInt(AdaptabilityLevel),
                TrainabilityLevel: parseInt(TrainabilityLevel),
                BarkingLevel: parseInt(BarkingLevel),
                AboutTheBreed,
                Health,
                Grooming,
                Exercise,
                Training
            }
        });
        res.status(201).json(newDog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add dog', message: error });
    }
});

app.get("/getalldog", async (req, res) => {
    try {
        const allDogs = await prisma.dog.findMany({
            select: {
                dogid:true,
                dogname: true,
                image: true 
            }
        });
        res.status(200).json(allDogs);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch dogs' });
    }
});

app.get('/dog/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const dog = await prisma.dog.findUnique({
        where: {
          dogid: id,
        },
      });
  
      if (!dog) {
        return res.status(404).json({ error: 'Dog not found' });
      }
  
      res.status(200).json(dog);
    } catch (error) {
      console.error("Error fetching dog data:", error);
      res.status(500).json({ error: 'Failed to fetch dog data' });
    }
  });
app.post('/getDogInfo',async(req,res)=>{
  const {dogname} = req.body
  try {
    const finddog = await prisma.dog.findMany({
      where:{
        dogname:dogname
      },
    })
    res.status(200).json(finddog)
  } catch (error) {
    console.log(error)
  }
})

app.post('/dog', async (req, res) => {
  const { location, breed, page = 1 } = req.body;  // 從請求中獲取地點、品種和頁數
  const limit = 10; // 每頁顯示10隻狗
  const skip = (page - 1) * limit; // 根據頁數計算要跳過的狗數量
  
  try {
    // 使用 Prisma 進行查詢
    const result = await prisma.animal.findMany({
      where: {
        shelter_address: {
          startsWith: location,  // 使用 `startsWith` 來匹配地址的前三個字
        },
        animal_done: {
          predicted_breed: breed   // 僅匹配選定的狗品種來自 animal_done 表
        }
      },
      include: {
        animal_done: true  // 包含 `animal_done` 表中的對應數據
      },
      skip: skip,  // 跳過前面的記錄，用於分頁
      take: limit  // 只取前10條記錄
    });

    // 總記錄數量，用於分頁
    const totalDogs = await prisma.animal.count({
      where: {
        shelter_address: {
          startsWith: location,
        },
        animal_done: {
          predicted_breed: breed
        }
      }
    });

    // 返回查詢結果
    res.status(200).json({
      success: true,
      data: result,
      totalDogs: totalDogs, // 返回總狗數
      totalPages: Math.ceil(totalDogs / limit), // 總頁數
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: '伺服器錯誤，無法查詢資料',
    });
  }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });