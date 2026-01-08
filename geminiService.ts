
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeScreening = async (responses: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a preliminary, HIPAA-aware psychological screening analysis based on the following user input: "${responses}". 

      TASK:
      1. Analyze the described behaviors and thought patterns.
      2. Suggest potential clinical categories or specific personality disorder markers for professional discussion.
      
      Look specifically for markers such as:
      - Cluster A (Odd/Eccentric): Persistent distrust or suspiciousness (Paranoid), detachment from social relationships and restricted emotional expression (Schizoid), or eccentricities of behavior and cognitive/perceptual distortions such as "magical thinking" (Schizotypal).
      - Cluster B (Dramatic/Erratic): Disregard for rights of others or lack of remorse (Antisocial), pervasive instability of interpersonal relationships, self-image, and affects, often involving "splitting" or extreme fear of abandonment (Borderline), excessive emotionality and attention seeking (Histrionic), or grandiosity and a deep need for admiration (Narcissistic).
      - Cluster C (Anxious/Fearful): Social inhibition and hypersensitivity to negative evaluation or rejection (Avoidant), submissive and clinging behavior related to an excessive need to be taken care of (Dependent), or preoccupation with orderliness, perfectionism, and mental/interpersonal control (Obsessive-Compulsive).

      3. Categorize these strictly as "Educational Markers for Discussion" and NOT as clinical diagnoses.
      4. Maintain a supportive, clinical, and professional tone.

      Disclaimer: You are an AI, not a clinical professional. Emphasize that this is for informational purposes to facilitate a session with Dr. Ramakant Gadiwan or another specialist.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            observedPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Clinical patterns observed in the input text."
            },
            potentialCategories: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suggested personality disorder clusters or specific categories for professional discussion."
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable next steps for the patient."
            },
            disclaimer: { type: Type.STRING }
          },
          required: ["summary", "observedPatterns", "potentialCategories", "recommendations", "disclaimer"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
