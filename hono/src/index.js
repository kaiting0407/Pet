import http from 'http';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

const server = http.createServer(async (req, res) => {
  // 設置 CORS 標頭
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 處理預檢請求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 根路由
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
  } 

  // 查詢所有狗的 GET 路由
  else if (req.method === 'GET' && req.url === '/getalldog') {
    try {
      const allDogs = await prisma.dog.findMany({
        select: {
          dogid: true,
          dogname: true,
          image: true,
        },
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(allDogs));
    } catch (error) {
      console.error("Error fetching dogs:", error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch dogs' }));
    }
  } 

  // 新增狗資料的 POST 路由
  else if (req.method === 'POST' && req.url === '/adddog') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
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
      } = JSON.parse(body);

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
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newDog));
      } catch (error) {
        console.error("Error adding dog:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to add dog' }));
      }
    });
  } 

  // 根據地點和品種查詢的 POST 路由
  else if (req.method === 'POST' && req.url === '/dog') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { location, breed, page = 1 } = JSON.parse(body);
      const limit = 10;
      const skip = (page - 1) * limit;

      try {
        const result = await prisma.animal.findMany({
          where: {
            shelter_address: {
              startsWith: location,
            },
            animal_done: {
              predicted_breed: breed
            }
          },
          include: {
            animal_done: true
          },
          skip: skip,
          take: limit
        });

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

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: result,
          totalDogs,
          totalPages: Math.ceil(totalDogs / limit),
          currentPage: page
        }));
      } catch (error) {
        console.error("Error fetching dogs by location and breed:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Server error, unable to fetch data' }));
      }
    });
  } 

  // 根據狗的 ID 查詢狗的資料
  else if (req.method === 'GET' && req.url.startsWith('/dog/')) {
    const id = req.url.split('/')[2];
    try {
      const dog = await prisma.dog.findUnique({
        where: {
          dogid: id,
        },
      });

      if (!dog) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Dog not found' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(dog));
      }
    } catch (error) {
      console.error("Error fetching dog data:", error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to fetch dog data' }));
    }
  }

  // 根據狗名查詢狗的資料
  else if (req.method === 'POST' && req.url === '/getDogInfo') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const { dogname } = JSON.parse(body);
      try {
        const finddog = await prisma.dog.findMany({
          where: {
            dogname: dogname,
          },
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(finddog));
      } catch (error) {
        console.error("Error fetching dog by name:", error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch dog by name' }));
      }
    });
  }

  // 404 路由
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
