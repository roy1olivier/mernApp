import { io, Socket } from 'socket.io-client';

// Create a Socket.io client instance
const socket: Socket = io('http://localhost:4000');

// Function to send a message to the server
export const sendMessage = (message: string) => {
  socket.emit('message', message);
};

// Listen for messages from the server
export const listenForMessages = (callback: (message: string) => void) => {
  socket.on('receive-message', (msg: string) => {
    callback(msg);
  });
};