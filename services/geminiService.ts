import { GoogleGenAI, Type } from "@google/genai";
import { AiVerificationResult, AiProgressResult } from "../types";

// Initialize Gemini
// Note: In a production app, never expose keys on the client. This is for the demo context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Verifies if the uploaded image is a tree/sapling and identifies it.
 */
export const verifyTreeImage = async (base64Image: string): Promise<AiVerificationResult> => {
  try {
    // Remove data URL prefix if present for the API call
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: "Analyze this image. Is it a newly planted tree, sapling, or seed? If yes, identify the species (or 'unknown' if unsure) and assess its initial planting quality. Provide a short piece of advice."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isTree: { type: Type.BOOLEAN },
            species: { type: Type.STRING },
            healthAssessment: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            advice: { type: Type.STRING }
          },
          required: ["isTree", "species", "healthAssessment", "confidence", "advice"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AiVerificationResult;
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    throw new Error("Failed to verify tree. Please try again.");
  }
};

/**
 * Checks the progress of the tree based on a new photo.
 */
export const checkTreeProgress = async (base64Image: string, previousSpecies: string): Promise<AiProgressResult> => {
  try {
     const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: `This is a check-in for a tree identified previously as a ${previousSpecies}. Analyze the image. Is the tree alive? Does it look healthy?`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSameTree: { type: Type.BOOLEAN, description: "Does the image contain a tree consistent with the species?" },
            growthDetected: { type: Type.BOOLEAN },
            healthStatus: { type: Type.STRING, enum: ["healthy", "struggling", "dead"] },
            message: { type: Type.STRING, description: "Encouraging message or care tip." }
          },
          required: ["isSameTree", "healthStatus", "message"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AiProgressResult;
  } catch (error) {
    console.error("Gemini Progress Error:", error);
    throw new Error("Failed to check progress.");
  }
};