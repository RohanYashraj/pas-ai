import { MetadataAgent } from "./metadata";
import { CoverageAgent } from "./coverages";
import { addDocumentSections, clearDocumentSections } from "../vector-store";
import { BaseAgent, AgentResponse } from "./base";

export class AgentOrchestrator {
  private agents: BaseAgent[] = [];

  constructor() {
    this.agents = [new MetadataAgent(), new CoverageAgent()];
  }

  /**
   * Phase 1: Intake - Parses, chunks, and indexes the document.
   */
  public async ingestDocument(buffer: Buffer, fileName: string) {
    // 1. Parse PDF using the new PDFParse class API (version 2.4.x+)
    console.log(`[ORCHESTRATOR] Starting ingestion for: ${fileName}`);

    let pdfData;
    try {
      // Use @cedrugs/pdf-parse which is lightweight and serverless-friendly
      const pdfParse = require("@cedrugs/pdf-parse");

      console.log("[ORCHESTRATOR] Using @cedrugs/pdf-parse API");
      pdfData = await pdfParse(buffer);
    } catch (e) {
      console.error("[ORCHESTRATOR] PDF parsing failed:", e);
      throw new Error(
        `PDF processing engine failed: ${e instanceof Error ? e.message : "Unknown error"}`,
      );
    }

    let text = pdfData.text || "";
    if (!text) {
      console.warn("[ORCHESTRATOR] No text extracted from PDF");
    }

    // 1.5 Sanitize text: Remove null characters (\u0000) which break PostgreSQL text/jsonb columns
    text = text.replace(/\u0000/g, "");

    // 2. Clear old sections for this file (POC behavior)
    await clearDocumentSections(fileName);

    // 3. Semantic Chunking (Simple implementation)
    // In a real RAG, we'd use section headers. Here we split by double newlines & paragraphs.
    const chunks = this.semanticChunk(text);

    // 4. Index Chunks
    const sections = chunks.map((content, index) => ({
      content,
      metadata: {
        source: fileName,
        chunkIndex: index,
        totalChunks: chunks.length,
      },
    }));

    await addDocumentSections(sections);

    return {
      message: "Ingestion complete",
      chunksCreated: chunks.length,
    };
  }

  /**
   * Phase 2: Extraction - Runs all agents to build structured artefacts.
   */
  public async executeExtraction(documentId: string): Promise<AgentResponse[]> {
    const results = await Promise.all(
      this.agents.map((agent) => agent.run(documentId)),
    );
    return results;
  }

  /**
   * Simple semantic chunker that respects paragraph boundaries.
   */
  private semanticChunk(text: string): string[] {
    // Split by common insurance spec delimiters: headers or double newlines
    const paragraphs = text.split(/\n\n+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const para of paragraphs) {
      if (currentChunk.length + para.length > 1500 && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
      currentChunk += para + "\n\n";
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}
