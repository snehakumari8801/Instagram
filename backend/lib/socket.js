// // lib/socket.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"], // no trailing slash
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   socket.on("disconnect", (reason) => {
//     console.log("A user disconnected:", socket.id, "Reason:", reason);
//   });
// });

// module.exports = { io, server, app };

// // lib/socket.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// // Socket.IO setup with CORS
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"], // frontend URL
//     credentials: true,
//   },
// });

// // Socket.IO connection logic
// io.on("connection", (socket) => {
//   console.log("✅ New client connected:", socket.id);

//   // Listen for messages
//   socket.on("send_message", (data) => {
//     console.log("📨 Message received:", data);

//     // Listen for incoming messages
//     socket.on("receive_message", (message) => {
//       console.log("📩 New message received:", message);

//       // For incoming messages, determine if they're from you or someone else
//       const formattedMessage = {
//         ...message,
//         // Check if the incoming message is from you (should be rare for socket messages)
//         sender: message.senderId === chatUserId ? "me" : "other",
//       };

//       setMessages((prev) => [...prev, formattedMessage]);
//     });

//     // Emit message to all other clients
//     socket.broadcast.emit("receive_message", data);
//   });

//   // Disconnect
//   socket.on("disconnect", (reason) => {
//     console.log("❌ Client disconnected:", socket.id, "Reason:", reason);
//   });
// });

// module.exports = { server, app };

// // lib/socket.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);

// // Socket.IO setup
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"], // frontend URL
//     credentials: true,
//   },
// });

// // Store online users
// const onlineUsers = {};

// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   // Register user after login
//   socket.on("register", (userId) => {
//     console.log("userId", userId)
//     onlineUsers[userId] = socket.id;
//     console.log("User registered:==========", userId);
//   });

//   // Disconnect
//   socket.on("disconnect", () => {
//     for (let userId in onlineUsers) {
//       if (onlineUsers[userId] === socket.id) {
//         delete onlineUsers[userId];
//         console.log("User disconnected:", userId);
//       }
//     }
//   });
// });

// module.exports = { io, server, app, onlineUsers };

// lib/socket.js













const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("../modals/Message"); // MongoDB model

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

const onlineUsers = {}; // userId -> socket.id

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Register logged-in user
  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("User registered:", userId);
  });

  // Fetch all messages between two users
  socket.on("get_all_messages", async ({ myId, chatUserId }) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: chatUserId },
          { senderId: chatUserId, receiverId: myId },
        ],
      }).sort({ createdAt: 1 });

      socket.emit("all_messages", messages);
    } catch (err) {
      console.error(err);
      socket.emit("all_messages_error", {
        message: "Failed to fetch messages",
      });
    }
  });

  // Send a new message
  // lib/socket.js
  socket.on("send_message", async (data) => {
  try {
    const message = await Message.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      text: data.text,
      pic: data.pic || null,
      video: data.video || null,
    });

    // Only emit to receiver if online
    const receiverSocketId = onlineUsers[data.receiverId];
    if (receiverSocketId)
      io.to(receiverSocketId).emit("receive_message", message); 
    //send that specific user

    // Optionally, send ACK to sender
    socket.emit("message_sent", message); // no duplication, just confirmation
  } catch (err) {
    console.error(err);
    socket.emit("send_message_error", { message: "Failed to send message" });
  }
});


  // Disconnect
  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log("User disconnected:", userId);
      }
    }
  });
});

module.exports = { io, server, app, onlineUsers };
