
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateQuizQuestions(category: Category): Promise<Question[]> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Generate 8 interesting multiple-choice quiz questions for 3rd-grade students (8-9 years old) in the category: ${category}. 
  
  Specific Instructions:
  - For 'Reading Adventure', include a short (2-3 sentence) story or passage in the 'passage' field and ask a question about it.
  - For 'Ramayana', 'Mahabharata', and 'Indian Mythology', use simplified, kid-friendly versions focusing on heroes and moral lessons.
  - For 'Global Mythology', include Greek, Norse, or Egyptian myths.
  - For 'Science' and 'Social Studies', stick to 3rd-grade curriculum topics (water cycle, local government, etc.).
  
  Each object in the JSON array must have:
  - id: A unique string.
  - prompt: The question.
  - options: Exactly 4 choices.
  - correctAnswer: The correct choice.
  - imageDescription: A vivid, simple description for an AI to draw an image for this specific question.
  - explanation: A "Did you know?" style fun fact for kids.
  - passage: (Optional) Only for Reading Adventure/Comprehension questions.
  
  Make the content exciting and use vocabulary suitable for 3rd graders.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            prompt: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            imageDescription: { type: Type.STRING },
            explanation: { type: Type.STRING },
            passage: { type: Type.STRING }
          },
          required: ["id", "prompt", "options", "correctAnswer", "imageDescription", "explanation"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data.map((q: any) => ({
      ...q,
      category
    }));
  } catch (e) {
    console.error("Failed to parse questions", e);
    return [];
  }
}

export async function generateQuestionImage(description: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality, kid-friendly, vibrant, clear cartoon illustration of: ${description}. Bright colors, simple shapes, 3D claymation style, white background.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
}
