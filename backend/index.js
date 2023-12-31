const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const path = require("path");
const cors = require("cors");

const connectDB = require("./mongoose_conn.js");

const userRoutes = require("./routes/userRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddlewares.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000",
  "https://chatwithme-zuf0.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // This option enables cookies and other credentials to be sent with the request
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);

//---------------------------Deployment----------------

const __dirname1 = path.resolve();
//console.log(path.join(__dirname1, "../frontend/build"));
console.log(path.resolve(__dirname1, "../frontend", "build", "index.html"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/build")));

  app.get("*", (req, res) => {
    console.log(path.resolve(__dirname1, "../frontend", "build", "index.html")),
      res.sendFile(
        path.resolve(__dirname1, "../frontend", "build", "index.html")
      );
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

//---------------------------Deployment----------------
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);

      const io = require("socket.io")(server, {
        /* pingTimeout: 60000, */
        cors: {
          origin: allowedOrigins,
          methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
          credentials: true,
        },
      });
      io.on("connection", (socket) => {
        console.log("Connected to socket.io");

        socket.on("setup", (userData) => {
          socket.join(userData._id);
          console.log("index setup", userData._id);
          socket.emit("connected");
        });

        socket.on("join chat", (room) => {
          console.log("User Joined Room: " + room);
          socket.join(room);
        });

        socket.on("typing", (room) => {
          //console.log("hii");
          socket.in(room).emit("typing", room);
        });

        socket.on("stop typing", (room) => {
          socket.in(room).emit("stop typing", room);
        });

        socket.on("new message", (newMessageRecieved) => {
          var chat = newMessageRecieved.chat;
          //console.log(chat);
          if (!chat.users) return console.log("chat.users not defined");

          chat.users.forEach((user) => {
            if (user._id === newMessageRecieved.sender._id) return;
            // console.log("newMsg", newMessageRecieved);
            socket.in(user._id).emit("message recieved", newMessageRecieved);
          });
        });

        socket.on("newNotification", (notification) => {
          console.log("New Notification Recived", notification);
          var chat = notification.fullNotification[0].chat;
          //console.log("chat", chat);

          if (!chat.users) return console.log("chat.users not defined");
          //console.log("chat users", chat.users);
          chat.users.forEach((user) => {
            if (user === notification.fullNotification[0].sender._id) return;

            socket
              .in(chat._id)
              .except(notification.fullNotification[0].sender._id)
              .emit("notify", notification);
          });
        });

        socket.off("setup", () => {
          console.log("USER DISCONNECTED");
          socket.leave(userData._id);
        });

        socket.on("disconnect", () => {
          // Leave the room when the user disconnects
          socket.leaveAll();
          console.log("Disconnected from socket.io");
        });
      });
    });
  })
  .catch((err) => {
    console.log("Error in connecting to database", err);
  });
