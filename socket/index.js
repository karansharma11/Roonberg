
const io = require("socket.io")(8900, {
  cors: {
    origin: process.env.BASEURL_LIVE?process.env.BASEURL_LIVE:process.env.BASEURL_LOCAL,
  },
});
const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");

const app = express();
const port = process.env.PORT || 4500;
const server = http.createServer(app);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

server.listen(port, () => {
  console.log(`Server is working on port ${port}`);
});

let users = [];
let Notification = [];

const addUser = (userId, socketId, role) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, role });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //   //when ceonnect
  console.log("a user connected.");
  socket.on("addUser", (userId, role) => {
    addUser(userId, socket.id, role);
    io.emit("getUsers", users);
  });
  socket.on("video", (data) => {
    if (data.receiverdId.length == 2) {
      const video = data.video;
      const senderId = getUser(data.senderId);
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      io.to(senderId.socketId).emit("video", {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        video,
      });
      if (agent) {
        io.to(agent.socketId).emit("video", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit("video", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      }
    } else {
      const video = data.video;
      const senderId = getUser(data.senderId);
      const user = getUser(data.receiverdId);
      const AdminUser = users.filter(
        (item) => item.role === "admin" || item.role === "superadmin"
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit("video", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      });
      io.to(senderId.socketId).emit("video", {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        video,
      });
      if (user) {
        io.to(user.socketId).emit("video", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          video,
        });
      }
    }

    // io.emit('audio', audioData);
  });

  socket.on("audio", (data) => {
    if (data.receiverdId.length == 2) {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      if (senderId) {
        io.to(senderId.socketId).emit("audio", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
      if (agent) {
        io.to(agent.socketId).emit("audio", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit("audio", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    } else {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const user = getUser(data.receiverdId);
      const AdminUser = users.filter(
        (item) => item.role === "admin" || item.role === "superadmin"
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit("audio", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      });
      io.to(senderId.socketId).emit("audio", {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        audio,
      });
      if (user) {
        io.to(user.socketId).emit("audio", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    }
    // io.emit('audio', audioData);
  });
  socket.on("audioFile", (data) => {
    if (data.receiverdId.length == 2) {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      io.to(senderId.socketId).emit("audioFile", {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        audio,
      });

      if (agent) {
        io.to(agent.socketId).emit("audioFile", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit("audioFile", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
        // io.to(senderId.socketId).emit('audioFile', {
        //   senderId: data.senderId,
        //   audio,
        // });
      }
    } else {
      const audio = data.audio;
      const senderId = getUser(data.senderId);
      const user = getUser(data.receiverdId);
      io.to(senderId.socketId).emit("audioFile", {
        senderFirstName: data.senderFirstName,
        senderLastName: data.senderLastName,
        Sender_Profile: data.Sender_Profile,
        senderId: data.senderId,
        audio,
      });
      const AdminUser = users.filter(
        (item) => item.role === "admin" || item.role === "superadmin"
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit("audioFile", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      });
      if (user) {
        io.to(user.socketId).emit("audioFile", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          audio,
        });
      }
    }
    // io.emit('audio', audioData);
  });

  socket.on("image", (data) => {
    const base64Image = data.image;
    const senderId = getUser(data.senderId);

    // if (base64Image) {
    // Remove the data:image/jpeg;base64 prefix and convert to a Buffer
    const imageBuffer = Buffer.from(
      base64Image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const imageFileName = `uploads/${Date.now()}.jpeg`;

    fs.writeFile(imageFileName, imageBuffer, (err) => {
      if (err) {
        console.error(err);
      } else {
        // Broadcast the image URL to all clients
        // io.to(agent.socketId).emit('image', {
        //   senderId: data.senderId,
        //   image: imageFileName,
        // });
        io.to(senderId.socketId).emit("image", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: imageFileName,
        });
      }
    });
    // } else {
    //   // Broadcast the text message to all clients
    //   io.emit('message', { text });
    // }

    if (data.receiverdId.length == 2) {
      // const text = data.text;
      const agent = getUser(data.receiverdId[0]);
      const contractor = getUser(data.receiverdId[1]);
      if (agent) {
        io.to(agent.socketId).emit("image", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: imageFileName,
        });
      }
      if (contractor) {
        io.to(contractor.socketId).emit("image", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: imageFileName,
        });
      }
    } else {
      const user = getUser(data.receiverdId);
      const AdminUser = users.filter(
        (item) => item.role === "admin" || item.role === "superadmin"
      );
      AdminUser.map((item) => {
        io.to(item.socketId).emit("image", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: imageFileName,
        });
      });
      if (user) {
        // Broadcast the image URL to all clients
        io.to(user.socketId).emit("image", {
          senderFirstName: data.senderFirstName,
          senderLastName: data.senderLastName,
          Sender_Profile: data.Sender_Profile,
          senderId: data.senderId,
          image: imageFileName,
        });
      }
    }
  });

  // send and get message
  socket.on(
    "sendMessage",
    ({
      senderFirstName,
      senderLastName,
      Sender_Profile,
      senderId,
      receiverdId,
      text,
    }) => {
      console.log("users", users)

      if (receiverdId.length == 2) {
        const agent = getUser(receiverdId[0]);
        const contractor = getUser(receiverdId[1]);
        if (agent) {
          io.to(agent.socketId).emit("getMessage", {
            senderFirstName,
            senderLastName,
            Sender_Profile,

            senderId,
            text,
          });
        }
        if (contractor) {
          io.to(contractor.socketId).emit("getMessage", {
            senderFirstName,
            senderLastName,
            Sender_Profile,

            senderId,
            text,
          });
        }
      } else {
        const user = getUser(receiverdId);
        if (user) {
          io.to(user.socketId).emit("getMessage", {
            senderFirstName,
            senderLastName,
            Sender_Profile,
            senderId,
            text,
          });
        } else {
          console.log("karannn");
        }
        const AdminUser = users.filter(
          (item) => item.role === "admin" || item.role === "superadmin"
        );
        AdminUser.map((item) => {
          io.to(item.socketId).emit("getMessage", {
            senderFirstName,
            senderLastName,
            Sender_Profile,
            senderId,
            text,
          });
        });
      }
    }
  );

  socket.on('connectionForNotify', () => {
    console.log('User connected for notifications');
  });


  socket.on('notifyProjectBackend', (notifyUser, message) => {
    console.log('notify and mesage', notifyUser, message);
    io.emit("notifyProjectFrontend", notifyUser, message);
  });



  socket.on('notifyUserBackend', (notifyUser, message ,notificationId) => {
    console.log('notify and mesage for user', notifyUser, message,notificationId)
    io.emit("notifyUserFrontend", notifyUser, message,notificationId);
  });


  // when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});



