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
                dogid: uuidv4(),  // 生成唯一的狗ID
                dogname,
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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });