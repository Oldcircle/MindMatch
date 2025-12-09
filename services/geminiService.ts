import { GoogleGenAI, Type } from "@google/genai";
import { CASUAL_PAIRS_COUNT } from "../constants";

// Initialize Gemini Client
// Note: We use process.env.API_KEY as per instructions.
// If not present, the app will handle the error gracefully in the UI.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateThemeContent = async (userPrompt: string): Promise<string[]> => {
  try {
    const model = "gemini-2.5-flash"; // Optimized for speed and simple logic

    const response = await ai.models.generateContent({
      model: model,
      contents: `Generate a list of exactly ${CASUAL_PAIRS_COUNT} unique, distinct emojis related to the theme: "${userPrompt}". 
      If the theme is abstract, use metaphoric emojis. 
      Ensure strictly no duplicates.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emojis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of emojis matching the theme.",
            },
          },
          required: ["emojis"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");

    const parsed = JSON.parse(jsonText);
    
    if (parsed.emojis && Array.isArray(parsed.emojis) && parsed.emojis.length >= CASUAL_PAIRS_COUNT) {
       return parsed.emojis.slice(0, CASUAL_PAIRS_COUNT);
    }
    
    throw new Error("AI returned invalid format");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};