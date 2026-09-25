import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 3001;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "UniFlow AI Server is running 🚀",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "You are UniFlow AI Assistant, a friendly university study assistant. " +
        "Give clear, simple and helpful answers. " +
        "Help students with courses, assignments, grades, schedules, programming and study questions. " +
        "Do not invent personal academic information that has not been provided.",
      input: message,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (error) {
    console.error("AI error:", error);

    res.status(500).json({
      error: "Unable to get an AI response.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`UniFlow AI Server running on http://localhost:${PORT}`);
});