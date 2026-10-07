import axios from "axios";

// Helper to query Gemini API directly
const askGemini = async (messages, apiKey) => {
  const systemMsg = messages.find((m) => m.role === "system" || m.role === "developer");
  const nonSystemMsgs = messages.filter((m) => m.role !== "system" && m.role !== "developer");

  const contents = nonSystemMsgs.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content || "" }],
  }));

  const requestBody = { contents };
  if (systemMsg && systemMsg.content) {
    requestBody.system_instruction = {
      parts: [{ text: systemMsg.content }],
    };
  }

  // Primary model and fallback model
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await axios.post(url, requestBody, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      const candidate = response?.data?.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err) {
      lastError = err;
      console.warn(`Gemini (${model}) failed:`, err.response?.data?.error?.message || err.message);
    }
  }

  throw lastError || new Error("Gemini returned empty response");
};

// Helper to query OpenRouter
const askOpenRouter = async (messages, apiKey) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: messages,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new Error("OpenRouter returned empty response.");
  }
  return content.trim();
};

export const askAi = async (messages) => {
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is empty.");
  }

  const geminiKey = process.env.GEMINI_API_KEY || (process.env.OPENROUTER_API_KEY?.startsWith("AQ.") || process.env.OPENROUTER_API_KEY?.startsWith("AIzaSy") ? process.env.OPENROUTER_API_KEY : null);
  const openRouterKey = process.env.OPENROUTER_API_KEY?.startsWith("sk-") ? process.env.OPENROUTER_API_KEY : null;

  try {
    if (geminiKey) {
      return await askGemini(messages, geminiKey);
    } else if (openRouterKey) {
      return await askOpenRouter(messages, openRouterKey);
    } else if (process.env.OPENROUTER_API_KEY) {
      // Default fallback
      return await askOpenRouter(messages, process.env.OPENROUTER_API_KEY);
    } else {
      throw new Error("No AI API key found. Please provide GEMINI_API_KEY or OPENROUTER_API_KEY in server/.env");
    }
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};