import express from "express";
import { createServer as createViteServer } from "vite";
import TelegramBot from "node-telegram-bot-api";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.TELEGRAM_BOT_TOKEN;
const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey) {
  console.error("GEMINI_API_KEY is missing. Please set it in the Secrets panel.");
}

const ai = geminiKey ? new GoogleGenAI({ apiKey: geminiKey }) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/status", (req, res) => {
    res.json({ 
      status: "ok", 
      botInitialized: !!token,
      geminiInitialized: !!ai
    });
  });

  // Telegram Bot Setup
  let bot: TelegramBot | null = null;

  if (token) {
    bot = new TelegramBot(token, { polling: true });
    console.log("Telegram Bot initialized with polling.");

    bot.on("message", async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (!text) return;

      if (text === "/start") {
        bot?.sendMessage(chatId, "မင်္ဂလာပါ။ ကျွန်တော်က အချက်အလက်တွေကို မှန်မှန်ကန်ကန် ရှာဖွေပေးမဲ့ Bot ဖြစ်ပါတယ်။ ဘာအကြောင်းအရာကို ရှာဖွေပေးရမလဲ ခိုင်းနိုင်ပါတယ်ခင်ဗျာ။");
        return;
      }

      if (!ai) {
        bot?.sendMessage(chatId, "Gemini API Key မရှိသေးတဲ့အတွက် ရှာဖွေလို့မရသေးပါဘူး။ ကျေးဇူးပြု၍ API Key ကို အရင်ထည့်ပေးပါ။");
        return;
      }

      bot?.sendChatAction(chatId, "typing");

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: `User query: ${text}. 
          Please search for accurate information about this topic. 
          Provide a summary in Burmese. 
          Specifically look for and include valid YouTube, TikTok, and Facebook links related to this topic.
          If you cannot find the information or the links, clearly state that you couldn't find them in Burmese.
          Always respond in Burmese language.` }] }],
          config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: "You are a helpful assistant that provides accurate information in Burmese. You must use Google Search to find real-time information and social media links (YouTube, TikTok, Facebook). If information is not found, say 'ရှာဖွေလို့မတွေ့ပါဘူး' (Not found) clearly."
          },
        });

        const replyText = response.text;
        
        // Extract URLs from grounding metadata if available to ensure they are listed
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        let additionalLinks = "";
        if (groundingChunks) {
          const links = groundingChunks
            .filter(chunk => chunk.web?.uri)
            .map(chunk => chunk.web?.uri)
            .filter((uri, index, self) => self.indexOf(uri) === index); // unique
          
          if (links.length > 0) {
            additionalLinks = "\n\nကိုးကားလင့်ခ်များ:\n" + links.join("\n");
          }
        }

        bot?.sendMessage(chatId, replyText + additionalLinks);
      } catch (error) {
        console.error("Gemini Error:", error);
        bot?.sendMessage(chatId, "တောင်းပန်ပါတယ်၊ အချက်အလက်ရှာဖွေရာမှာ အမှားတစ်ခု ဖြစ်သွားပါတယ်။ ခဏနေမှ ပြန်ကြိုးစားကြည့်ပေးပါ။");
      }
    });
  } else {
    console.warn("TELEGRAM_BOT_TOKEN is missing. Bot will not start.");
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
