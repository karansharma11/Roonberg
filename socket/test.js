const io = require('socket.io-client');

// Connect to your socket.io server
const socket = io('https://roonbergsocket.onrender.com');
//console.log(' socket ',socket);

// Event handlers for connection and messages
socket.on('connect', () => {
  console.log('Connected to the socket.io server');
});

socket.on('message', () => {
  console.log('Received message from server:');
});

// Send a test message to the server
socket.emit('message', 'Hello, server!');

// Close the connection when done testing
socket.close();
