import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const port = 5000;
const phraseArray = ["Coding", "is", "an", "art", "and", "science"];

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    console.log(`${data} from ${socket.id}`);
    for (const word of phraseArray) {
      socket.emit("receive_message", {word});
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
