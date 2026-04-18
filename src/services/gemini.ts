import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  prepTime: string;
}

export async function generateRecipes(ingredients: string): Promise<Recipe[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a professional nutritionist and chef. Create 3 healthy recipes using the following ingredients as a base: ${ingredients}. You can assume basic pantry staples like salt, oil, and water are available. Return the response in a structured JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                  instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  calories: { type: Type.NUMBER },
                  prepTime: { type: Type.STRING }
                },
                required: ["title", "ingredients", "instructions", "calories", "prepTime"]
              }
            }
          },
          required: ["recipes"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result.recipes || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate recipes. Please try again later.");
  }
}

export async function getHealthTip(goal: string, lastMeal?: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `Provide a short, motivating health tip for someone whose goal is "${goal}"${lastMeal ? `. Their last meal was ${lastMeal}.` : ""}. Keep it under 150 characters.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    return "Stay hydrated and keep pushing toward your goals!";
  }
}
