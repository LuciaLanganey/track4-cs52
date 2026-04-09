import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";

export const processVoice = action({
  args: { transcript: v.string() },
  handler: async (ctx, { transcript }) => {
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(
      `Respond to this voice input: ${transcript}`,
    );

    const response = await result.response;
    return response.text();
  },
});
