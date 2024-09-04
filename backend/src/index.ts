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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });