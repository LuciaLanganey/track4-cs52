import { action } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v } from "convex/values";

export const extractText = action({
  args: {
    base64Image: v.string(),
    mimeType: v.string(),
  },
  handler: async (ctx, { base64Image, mimeType }) => {
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Image,
        },
      },
      "Extract all text from this image.",
    ]);

    const response = await result.response;
    return response.text();
  },
});
