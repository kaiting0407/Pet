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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });