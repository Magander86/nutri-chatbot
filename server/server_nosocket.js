import express from "express";
import cors from "cors";
import {router as claudeChat} from "./routes/claudeChat.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/", claudeChat);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);    
});