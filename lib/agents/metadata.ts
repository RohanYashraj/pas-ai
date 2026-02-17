import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class MetadataAgent extends BaseAgent {
    public name = "Product Metadata Agent";
    public description = "Extracts high-level product identification data (Name, LOB, Carrier, Version, Dates, Industry Focus)";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract high-level product identification data including Product Name, Line of Business, Carrier Name, Version number, Effective/Expiration dates, and Industry Focus.");

            const prompt = `Identify the high-level metadata of this insurance policy specification. 
            Include:
            - Product Name
            - Line of Business (LOB)
            - Carrier Name (the insurance company providing the product)
            - Version or Release Date
            - Effective Date and Expiration Date (if available)
            - A brief 1-2 sentence Description of the product
            - Industry Focus (a list of industries this product is specialized for, e.g., Healthcare, FinTech, Construction)`;

            const schema = JSON.stringify(MASTER_SCHEMA.product_metadata, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { product_metadata: data },
                status: "success",
            };
        } catch (error: any) {
            return {
                agentName: this.name,
                data: null,
                status: "error",
                message: error.message,
            };
        }
    }
}
