// const express = require("express");
// const { dbConnect } = require("./database/db");
// const authRoutes = require("./routes/authRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// const cors = require("cors");

// const { authMiddleware } = require("./middleware/auth");
// require("dotenv").config();
// const cookieParser = require("cookie-parser");

// const {io,server,app} = require('./lib/socket');

// // const app =  express();

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//   origin:"http://localhost:5173/",
//   credentials:true
// }));


// app.get("/",(req,res)=>{
//   res.send("Hellow world");
// });

// dbConnect();

// //routes
// app.use("/api/v1/user" , authRoutes);
// app.use("/api/v1/message" ,messageRoutes);


// let port = process.env.PORT || 4000;
// server.listen(port,()=>{
//     console.log(`server is running at ${port}`);
// });





















const express = require("express");
const { dbConnect } = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");

const { authMiddleware } = require("./middleware/auth");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const { io, server, app } = require('./lib/socket');

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*", // http://localhost:5173
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Hello world");  // fixed typo "Hellow"
});

dbConnect();

// Routes
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/message", messageRoutes);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
