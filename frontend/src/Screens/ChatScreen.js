// // Chat.js (frontend)

// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// // const socket = io.connect('http://localhost:5000'); // Replace with your server URL

// function ChatScreen() {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

// //   useEffect(() => {
// //     // Listen for incoming messages
// //     socket.on('chat message', (message) => {
// //       setMessages([...messages, message]);
// //     });
// //   }, [messages]);

//   const sendMessage = () => {
//     if (message.trim() !== '') {
//     //   socket.emit('chat message', message);
//       setMessage('');
//     }
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((msg, index) => (
//           <div key={index}>{msg}</div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your message..."
//       />
//       <button onClick={sendMessage}>Send</button>
//     </div>
//   );
// }

// export default ChatScreen;
