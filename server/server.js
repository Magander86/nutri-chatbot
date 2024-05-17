import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const claudeApiKey = process.env.ANTHROPIC_APIKEY;
const anthropic = new Anthropic({ apiKey: claudeApiKey });
// Sets the behavior of the AI with prompts separated by comma
const systemResponse =
  "Respond only in brazilian portuguese, respond only to questions about nutrition health, address yourself as female";
try {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data) => {
      try {
        anthropic.messages
          .stream({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            temperature: 0,
            system: systemResponse,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: data,
                  },
                ],
              },
            ],
          })
          .on("text", (text) => {
            io.to(socket.id).emit("receive_message", text);
          })
          .on("end", () => socket.emit("message_end"));
      } catch (error) {
        throw error;
      }
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
