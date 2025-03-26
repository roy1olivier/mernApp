import { io, Socket } from 'socket.io-client';

export interface interfaceExpense {
  expenseName:string,
  expenseAmount:string,
  expenseDate:string,
  expenseType:string
}

// Create a Socket.io client instance
const socket: Socket = io('http://localhost:4000');

// Function to send a message to the server
export const sendMessage = (message: string) => {
  socket.emit('message', message);
};

// Listen for messages from the server
export const listenForMessages = () => {
  socket.on('message', (msg: string) => {
    console.log("MESSAGE RECEIVED FROM SERVER::" + msg);
  });
  socket.on('itemAdded', (msg: interfaceExpense) => {
    console.log("MESSAGE RECEIVED FROM SERVER: ITEM ADDED:" + msg.expenseDate);
  });

};

export const sendItem = (expense: interfaceExpense) => {
  console.log("Sending expense to server" )
  socket.emit("addExpense", expense);
}