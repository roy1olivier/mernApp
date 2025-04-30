import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import expenseModel from './models/depenses'
import http from 'http';
import socketServer   from 'socket.io';
import {interfaceExpense} from './interfaces/depensesInterface'
import authRoutes from './routes/auth';
import dataRoutes from './routes/data'
import userModel from './models/users';
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
        .then(result => {io.emit('expenseUpdated:' + existingExpense.groupsId,result); console.log("expense updated"+result)})
        .catch(err => console.log(err));
      }
      else{
        console.log("Expense not found");
      }
	})

  
 /* socket.on('addExpense',(addData:interfaceExpense)=>{
    
    console.log("new expense received:: " +  addData);
		var expenseItem = new expenseModel({
			expenseName:addData.expenseName,
			expenseAmount:addData.expenseAmount,
			expenseDate: addData.expenseDate,
      expenseType:addData.expenseType,
      userId:addData.userId,
      groupsId:addData.groupsId,
		});
   
		expenseItem.save()
        .then(result => {io.emit('itemAdded',result); console.log("expense saved"+result)})
        .catch(err => console.log(err));
	})*/

  socket.on('addExpense', async(addData:interfaceExpense)=>{
    
    console.log("new expense received:: " +  addData);
		const session = await mongoose.startSession();

try {
  session.startTransaction();

  // 1. Save the expense
  const expenseItem = await expenseModel.create([{
    expenseName: addData.expenseName,
    expenseAmount: addData.expenseAmount,
    expenseDate: addData.expenseDate,
    expenseType: addData.expenseType,
    userId: addData.userId,
    groupsId: addData.groupsId,
  }], { session });

  // 2. Update the user
  await userModel.findByIdAndUpdate(
    addData.userId,
    { $push: { userExpenses: expenseItem[0]._id } },
    { session }
  );

  // 3. Commit the transaction
  await session.commitTransaction();
  session.endSession();

  // 4. Notify clients
  io.emit('itemAdded', expenseItem[0]);
  console.log("Expense and user updated:", expenseItem[0]);

} catch (error) {
  await session.abortTransaction();
  session.endSession();
  console.error("Transaction failed:", error);
}
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
app.use('/api/auth', authRoutes);
app.use('/api/data',dataRoutes);
io.listen(4000);
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
