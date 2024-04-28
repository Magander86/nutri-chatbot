import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const claudeApiKey = process.env.ANTHROPIC_APIKEY;
const anthropic = new Anthropic({ apiKey: claudeApiKey });
const systemResponse =
  "Respond only in brazilian portuguese, respond only to questions about nutrition health, you are a doctor name Nora";

router.post("/claudechat", async (req, res) => {
  try {
    const questionRequest = req.body.message;

    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      temperature: 0,
      system: systemResponse,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: questionRequest,
            },
          ],
        },
      ],
    });

    return res.json(message);

    // anthropic.messages
    //   .stream({
    //     model: "claude-3-sonnet-20240229",
    //     max_tokens: 1000,
    //     temperature: 0,
    //     system: systemResponse,
    //     messages: [
    //       {
    //         role: "user",
    //         content: [
    //           {
    //             type: "text",
    //             text: questionRequest,
    //           },
    //         ],
    //       },
    //     ],
    //   })
    //   .on("text", (text) => {
    //     console.log(text);
    //     wss.clients.forEach((client) => {
    //       client.send(JSON.stringify({ text }));
    //     });
    //   })
    //   .on("end", (text) => res.json(text));
  } catch (error) {
    console.log(error);
  }
});

export {router};
