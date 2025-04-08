import { io, Socket } from 'socket.io-client';

export interface interfaceExpense {
  expenseName:string,
  expenseAmount:string,
  expenseDate:string,
  expenseType:string,
  __id?:string
}

// Create a Socket.io client instance
export const socket: Socket = io('http://localhost:4000');

// Function to send a message to the server
export const sendMessage = (message: string) => {
  socket.emit('message', message);
};

export const listenForNewExpenses = (socket: any, callback: (msg: interfaceExpense) => void) => {
  socket.on('itemAdded', callback);
};

// Listen for incoming messages
export const listenForMessages = (socket: any, callback: (msg: string) => void) => {
  socket.on('message', callback);
};

export const sendItem = (expense: interfaceExpense) => {
  console.log("Sending expense to server" )
  socket.emit("addExpense", expense);
};

export const sendServerExpenseReset = () => {
  socket.emit("serverExpenseReset");
};

// Listen for incoming messages
export const listenForServerExpenseReset = (socket: any, callback: (msg: string) => void) => {
  socket.on('serverExpenseResetCompleted', callback);
};

export const listenForServerExpenseError = (socket: any, callback: (msg: string) => void) => {
  socket.on('serverExpenseResetError', callback);
};