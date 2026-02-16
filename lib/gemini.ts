import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates an embedding for a given text chunk.
 * Using gemini-embedding-001 with outputDimensionality: 768 to match database.
 */
export async function generateEmbedding(text: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent({
        content: { role: "user", parts: [{ text }] },
        outputDimensionality: 768,
    } as any);
    return result.embedding.values;
}

/**
 * Interacts with Gemini Pro for structured extraction or general reasoning.
 */
export async function generateContent(prompt: string, modelName = "gemini-3-pro-preview") {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * Generates structured JSON output from Gemini using a schema-following prompt.
 */
export async function generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T> {
    console.log("[GEMINI] Generating structured output...");
    const model = genAI.getGenerativeModel({
        model: "gemini-3-pro-preview",
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const fullPrompt = `
    ${prompt}
    
    You MUST return the output as a JSON object following this schema:
    ${schemaDescription}
  `;

    try {
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        console.log("[GEMINI] Response received");
        return JSON.parse(text) as T;
    } catch (error: any) {
        console.error("[GEMINI] Error or Parse Failure:", error.message);
        throw new Error(`Gemini failed: ${error.message}`);
    }
}
