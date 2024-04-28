import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_APIKEY, // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1000,
  temperature: 0,
  system: "Respond only in brazilian portuguese, respond only to questions about nutrition health, you are a doctor name Nora",
  messages: [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "quais lanches de baixo custo seriam saudáveis e práticos?"
        }
      ]
    }
  ]
});
console.log(msg);