import mongoose from 'mongoose';
import expenseModel from '../models/depenses'
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Server is running');
});


// POST endpoint to insert data into the database
router.post('/addExpense', async (req, res) => {
    try {
        const { name, amount, date, typeD } = req.body;
        const depense = new expenseModel({ name, amount, date, typeD});
        await depense.save();
        res.status(201).json({ message: 'Person added successfully', depense });
      } catch (error : any) {
        res.status(400).json({ error: 'Failed to add person', details: error.message });
      }
  });
  
  // GET endpoint to retrieve all people from the database
  router.get('/getAllExpenses', async (req, res) => {
    try {
      const depense = await expenseModel.find({}, { __v:0 });
      res.status(200).json(depense);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to retrieve people', details: error.message });
    }
  });


  router.get('/wipe-everything', async (req, res) => {
    try {
      const depensess = await expenseModel.deleteMany({})
      res.status(200).json(depensess);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to delete people', details: error.message });
    }
  });

  // GET endpoint for testing purpose...
  router.get('/getExpense', async (req, res) => {
  
    //console.log(await expenseModel.find().lean());
    console.log(expenseModel.schema.paths);
    try {
      const ObjectId = mongoose.Types.ObjectId;
      const expense = await expenseModel.findById(new ObjectId(""));
      res.status(200).json(expense);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to retrieve people', details: error.message });
    }
  });

  export default router;