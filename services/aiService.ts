import { GoogleGenAI, Type } from "@google/genai";
import { AIConfig } from "../types";

export const generateThemeContent = async (userPrompt: string, pairCount: number, config: AIConfig): Promise<string[]> => {
  const systemPrompt = `Generate a list of exactly ${pairCount} unique, distinct emojis related to the theme: "${userPrompt}". 
      If the theme is abstract, use metaphoric emojis. 
      Ensure strictly no duplicates. Return ONLY JSON.`;

  try {
    if (config.provider === 'google') {
      return await generateGemini(userPrompt, pairCount, config);
    } else {
      return await generateOpenAICompatible(userPrompt, pairCount, config, systemPrompt);
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

// Google Gemini Implementation
const generateGemini = async (userPrompt: string, pairCount: number, config: AIConfig): Promise<string[]> => {
  // Use config key if provided, otherwise fallback to env
  const apiKey = config.apiKey || process.env.API_KEY;
  if (!apiKey) throw new Error("Missing API Key for Gemini");

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: config.modelName || 'gemini-2.5-flash',
    contents: `Generate ${pairCount} unique emojis for theme: ${userPrompt}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          emojis: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: `An array of exactly ${pairCount} emojis.`,
          },
        },
        required: ["emojis"],
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("No response from AI");
  
  const parsed = JSON.parse(jsonText);
  return validateAndSlice(parsed.emojis, pairCount);
};

// OpenAI / DeepSeek / Ollama Implementation
const generateOpenAICompatible = async (userPrompt: string, pairCount: number, config: AIConfig, systemInstruction: string): Promise<string[]> => {
  const apiKey = config.apiKey || 'sk-placeholder'; // Ollama might not need it, but fetch needs valid string
  const baseUrl = config.baseUrl || (config.provider === 'ollama' ? 'http://localhost:11434/v1' : 'https://api.openai.com/v1');
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const body = {
    model: config.modelName || 'gpt-3.5-turbo',
    messages: [
      { role: "system", content: systemInstruction + " Return format: { \"emojis\": [\"😀\", ...] }" },
      { role: "user", content: `Theme: ${userPrompt}` }
    ],
    temperature: 0.7,
    response_format: { type: "json_object" } 
  };

  // Note: Some older models or Ollama might not support response_format: json_object. 
  // If it fails, we might need a fallback or prompt engineering.
  // We'll try-catch or assume modern compatibility for now.

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from provider");

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    // Attempt to find JSON in text if markdown code blocks used
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      throw new Error("Could not parse JSON from response");
    }
  }

  // Handle keys: "emojis" or just array
  const list = Array.isArray(parsed) ? parsed : (parsed.emojis || parsed.items || []);
  return validateAndSlice(list, pairCount);
};

const validateAndSlice = (items: any[], count: number): string[] => {
  if (Array.isArray(items) && items.length >= count) {
    return items.slice(0, count);
  }
  throw new Error(`AI returned ${items?.length || 0} items, expected ${count}`);
};
