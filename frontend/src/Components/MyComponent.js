import React, { useEffect } from 'react';
import io from 'socket.io-client';
const socketUrl = process.env.REACT_APP_SOCKETURL;
console.log('socketUrl ',socketUrl)
const socket = io(socketUrl); // Replace with your server URL

const MyComponent = () => {
  socket.emit('message', 'admin');
  useEffect(() => {
    socket.on('message', (role) => {
      // Handle the received event data here
      console.log('Received event:', role);

    });
  }, []);

  // ...

  return <div>React Component</div>;
};

export default MyComponent;