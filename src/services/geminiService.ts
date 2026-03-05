import { GoogleGenAI, Type } from "@google/genai";
import { RawMessage, ProcessedMessage, DashboardStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MESSAGE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      sender: { type: Type.STRING },
      subject: { type: Type.STRING },
      content: { type: Type.STRING },
      source: { type: Type.STRING },
      timestamp: { type: Type.STRING },
    },
    required: ["id", "sender", "content", "source", "timestamp"],
  },
};

const PROCESSED_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      category: { type: Type.STRING },
      summary: { type: Type.STRING },
      priority: { type: Type.STRING },
      impact: { type: Type.STRING },
      recommendedExperts: { type: Type.ARRAY, items: { type: Type.STRING } },
      clientInsight: {
        type: Type.OBJECT,
        properties: {
          strategicAngle: { type: Type.STRING },
          relevantOfferings: { type: Type.ARRAY, items: { type: Type.STRING } },
          thoughtLeadership: { type: Type.STRING },
        },
      },
      delegationTarget: { type: Type.STRING },
      suggestedReply: { type: Type.STRING },
    },
    required: ["id", "category", "summary", "priority", "impact", "recommendedExperts"],
  },
};

export async function generateDemoMessages(): Promise<RawMessage[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate 20 realistic enterprise messages for a Capgemini Invent VP. Include a mix of Email, Teams, and WhatsApp. Scenarios: client questions, project updates, budget approvals, meeting coordination, FYI announcements. Return as JSON array.",
    config: {
      responseMimeType: "application/json",
      responseSchema: MESSAGE_SCHEMA,
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse generated messages", e);
    return [];
  }
}

export async function processMessages(messages: RawMessage[]): Promise<ProcessedMessage[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze these 20 enterprise messages for a Capgemini Invent VP. 
    Classify each: 'Decision Required', 'Delegatable', 'Suggested Auto Reply', 'FYI'.
    Assign Priority: 'Urgent & Strategic', 'Strategic but Not Urgent', 'Operational', 'Informational'.
    Assign Impact: 'Client Impact', 'Internal Leadership', 'Delivery / Program', 'Thought Leadership Opportunity'.
    Recommend 2-3 internal experts for decisions.
    If it's a client message, provide strategic insight (angle, offerings, thought leadership).
    If delegatable, suggest a target role (e.g., 'Delivery Lead').
    If auto-reply, suggest a short professional response.
    
    Messages: ${JSON.stringify(messages)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: PROCESSED_SCHEMA,
    },
  });

  try {
    const processedData = JSON.parse(response.text || "[]");
    return messages.map(msg => {
      const analysis = processedData.find((p: any) => p.id === msg.id) || {};
      return {
        id: msg.id,
        raw: msg,
        ...analysis
      };
    });
  } catch (e) {
    console.error("Failed to parse processed messages", e);
    return [];
  }
}

export function calculateStats(processed: ProcessedMessage[]): DashboardStats {
  return {
    totalProcessed: processed.length,
    handledAutomatically: processed.filter(m => m.category === 'Suggested Auto Reply' || m.category === 'FYI').length,
    delegationsPrepared: processed.filter(m => m.category === 'Delegatable').length,
    informational: processed.filter(m => m.category === 'FYI').length,
    decisionsRequired: processed.filter(m => m.category === 'Decision Required').length,
  };
}
