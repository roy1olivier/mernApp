import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import DepenseModel from './models/depenses'
dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({ extended: true }));
const uri: string =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/your-app';

(async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to the database');
    } catch(error) {
        console.error(error);
    }
})();

app.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});


// POST endpoint to insert data into the database
app.use(express.json());
app.post('/add-user', async (req, res) => {
    try {
        const { name, amount, date, typeD } = req.body;
        const depense = new DepenseModel({ name, amount, date, typeD});
        await depense.save();
        res.status(201).json({ message: 'Person added successfully', depense });
      } catch (error : any) {
        res.status(400).json({ error: 'Failed to add person', details: error.message });
      }
  });
  
  // GET endpoint to retrieve all people from the database
  app.use(express.json());
  app.get('/getuser', async (req, res) => {
    try {
      const depense = await DepenseModel.find();
      res.status(200).json(depense);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to retrieve people', details: error.message });
    }
  });


  app.get('/wipe-everything', async (req, res) => {
    try {
      const depensess = await DepenseModel.deleteMany({})
      res.status(200).json(depensess);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to delete people', details: error.message });
    }
  });


const PORT: string | number = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});