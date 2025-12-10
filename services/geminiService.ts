import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let aiClient: GoogleGenAI | null = null;

// Initialize the client. In a real app, you might check if key exists.
// We assume process.env.API_KEY is available or injected.
try {
  if (process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Gemini client", error);
}

export const analyzeThreat = async (threatData: string): Promise<string> => {
  if (!aiClient) return "Gemini API Key not configured. Unable to analyze.";

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this network threat payload and suggest mitigation:\n${threatData}`,
      config: {
        systemInstruction: "You are a senior security engineer. Analyze the JSON threat data provided. Be brief and decisive.",
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Analysis failed", error);
    return "Error during analysis. Please check system logs.";
  }
};

export const chatWithAnalyst = async (message: string, history: {role: string, content: string}[]): Promise<string> => {
  if (!aiClient) return "Gemini API Key missing. Running in offline mode.";

  try {
    // We construct a simple chat history context
    // The SDK supports chat sessions, but for stateless REST-like simplicity in this demo:
    const chat = aiClient.chats.create({
      model: 'gemini-3-pro-preview', // Using the more powerful model for reasoning
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text || "No response received.";
  } catch (error) {
    console.error("Chat failed", error);
    return "I'm having trouble connecting to the security mainframe (API Error).";
  }
};

export const generateWafRules = async (attackPattern: string): Promise<string> => {
  if (!aiClient) return "API Key missing.";

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a ModSecurity or regex rule to block this pattern: ${attackPattern}. Return ONLY the rule logic.`,
    });
    return response.text || "Could not generate rule.";
  } catch (error) {
    return "Error generating rule.";
  }
}
