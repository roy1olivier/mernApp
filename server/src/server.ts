import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import expenseModel from './models/depenses'
import http from 'http';
import socketServer   from 'socket.io';
import {interfaceExpense} from './interfaces/depensesInterface'

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
app.post('/addExpense', async (req, res) => {
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
  app.get('/getAllExpenses', async (req, res) => {
    try {
      const depense = await expenseModel.find({}, { __v:0 });
      res.status(200).json(depense);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to retrieve people', details: error.message });
    }
  });


  app.get('/wipe-everything', async (req, res) => {
    try {
      const depensess = await expenseModel.deleteMany({})
      res.status(200).json(depensess);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to delete people', details: error.message });
    }
  });

  // GET endpoint for testing purpose...
  app.get('/getExpense', async (req, res) => {
  
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

const PORT: string | number = process.env.PORT || 3000;


// Create an HTTP server
const server = http.createServer(app);
const io = new socketServer.Server(server, {
  cors: {
    origin: "*", // You can replace "*" with your frontend app's URL for security reasons
  },
});
const connections = [];
io.on('connection', function (socket) {
	//console.log("Connected to Socket!!"+ socket.id)	
	connections.push(socket)


	socket.on('disconnect', function(){
		//console.log('Disconnected - '+ socket.id);
	});

  
  socket.on('message', (msg: string) => {
    console.log('Received message:', msg);
    io.emit('message', msg); // Broadcast the message to all connected clients
  });

  // Send a welcome message to the client
  //console.log('Sending welcome message');
  //socket.send('Welcome to the WebSocket server!');
	
  socket.on('updateExpense',async (updatedExpense:interfaceExpense)=>{
      const existingExpense = await expenseModel.findById(updatedExpense._id);//updatedExpense.__id);
      if(existingExpense){
        existingExpense.expenseAmount = updatedExpense.expenseAmount;
        existingExpense.expenseDate = updatedExpense.expenseDate;
        existingExpense.expenseName = updatedExpense.expenseName;
        existingExpense.expenseType = updatedExpense.expenseType;
  
         await existingExpense.save()
        .then(result => {io.emit('expenseUpdated',result); console.log("expense updated"+result)})
        .catch(err => console.log(err));
      }
      else{
        console.log("Expense not found");
      }
	})

  
  socket.on('addExpense',(addData:interfaceExpense)=>{
    console.log("new expense received:: " +  addData);
		var expenseItem = new expenseModel({
			expenseName:addData.expenseName,
			expenseAmount:addData.expenseAmount,
			expenseDate: addData.expenseDate,
      expenseType:addData.expenseType
		});
   
		expenseItem.save()
        .then(result => {io.emit('itemAdded',result); console.log("expense saved"+result)})
        .catch(err => console.log(err));
	})

  socket.on('serverExpenseReset', async function() {
    console.log("RESET ALL EXPENSES");

    try {
        // Wait for the delete operation to finish
        const dd = await expenseModel.deleteMany({});
        
        console.log("after reset::", dd);
        io.emit('serverExpenseResetCompleted', "Data Reset Completed");
        console.log("RESET Done");
    } catch (error) {
        io.emit('serverExpenseResetError', error);
        console.log("RESET failed", error);
    }
});

  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    // Emit an event back to the client
    socket.emit('chat response', 'Server received: ' + msg);
  });

});

io.listen(4000);
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
