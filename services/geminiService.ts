
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "MetalOS", the operating system for Kelurahan Yosomulyo.
Your role is to assist the Lurah and citizens with data-driven insights based on the "Single Source of Truth".

Context:
- Yosomulyo is transforming into a self-reliant digital village (Desa Mandiri).
- Key pillars: Pancadaya Philosophy, WargaPay (Finance), Warga-Enviro (Environment), Pasar Payungi (Economy).
- Specific Programs: Mocaf Hub (Cassava processing), Anjelo (Local Courier), Trash-for-Data.
- Data availability: You have access to simulated data regarding stunting, budget (APBDes), and environmental sensors.

Style:
- Professional yet approachable (Nemui Nyimah - hospitality).
- Data-driven but concise.
- If asked about the budget, refer to the "Glass House Governance" principle of transparency.
- You have access to Google Search and Google Maps. Use them to provide up-to-date information about events, news, locations, and general queries.
`;

export interface GeminiResponse {
    text: string;
    groundingMetadata?: any;
}

export const sendMessageToGemini = async (message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[]): Promise<GeminiResponse> => {
  try {
    if (!apiKey) {
        return { text: "API Key is missing. Please configure the environment." };
    }

    const model = 'gemini-2.5-flash';
    
    // Construct the chat history for context
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
      history: history,
    });

    const result = await chat.sendMessage({
      message: message
    });

    return {
        text: result.text || "I apologize, I couldn't process that request.",
        groundingMetadata: result.candidates?.[0]?.groundingMetadata
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Sorry, the cognitive system is currently offline." };
  }
};
