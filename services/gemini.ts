import { GoogleGenAI, Type } from "@google/genai";
import { RecipeIdea } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to generate recipe ideas based on current trend/season
export const generateRecipeIdeas = async (season: string): Promise<RecipeIdea[]> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Generate 5 trending, viral-worthy recipe ideas suitable for short-form video content (TikTok/Reels).
    Focus on the theme: ${season}.
    The recipes should be visually appealing.
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              viralityScore: { type: Type.INTEGER },
              ingredients: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["id", "title", "description", "ingredients"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RecipeIdea[];
    }
    return [];
  } catch (error) {
    console.error("Error generating ideas:", error);
    throw error;
  }
};

// Helper to generate the storyboard (text descriptions of frames)
export const generateStoryboard = async (recipe: RecipeIdea): Promise<{
  hookPrompt: string;
  ingredientsPrompt: string;
  steps: { description: string, prompt: string }[];
}> => {
  if (!apiKey) throw new Error("API Key missing");

  const prompt = `
    Create a visual storyboard for a viral cooking video for: ${recipe.title}.
    
    I need:
    1. A "Hook" image prompt: The finished dish looking absolutely delicious, cinematic lighting, 4k.
    2. An "Ingredients" image prompt: Knolling style (flat lay) of ingredients, clean background.
    3. 3 to 5 key preparation steps. For each step, provide a short description and a highly detailed image generation prompt.
    
    The image prompts must be optimized for a realistic AI image generator.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Use Pro for better reasoning on visual direction
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hookPrompt: { type: Type.STRING },
          ingredientsPrompt: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                prompt: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }
  throw new Error("Failed to generate storyboard");
};

// Helper to generate a single image
export const generateImageFrame = async (prompt: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  // Using gemini-3-pro-image-preview (Nano Banana Pro equivalent for high quality)
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16", // Vertical video format
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (e) {
    console.error("Image generation failed", e);
    // Fallback for demo purposes if API fails or quota exceeded
    return `https://picsum.photos/1080/1920?random=${Math.random()}`; 
  }
};
