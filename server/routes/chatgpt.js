import { Router } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const chatgptApiKey = process.env.CHATGPT_APIKEY;

const openai = new OpenAI({apiKey: chatgptApiKey});

router.get("/chatgpt", async (req, res) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "tell me about yourself" }],
    model: "gpt-3.5-turbo",
  });

  const response = completion.choices[0];

  res.json(response);
});

export default router;