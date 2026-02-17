import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class DefinitionsAgent extends BaseAgent {
    public name = "Legal Definition Agent";
    public description = "Extracts key defined terms and their meanings from the policy document.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract the most important defined terms and their definitions (e.g., Claim, Insured, Professional Services).");

            const prompt = `Identify the most critical defined terms in this policy.
            Focus on core terms like 'Claim', 'Loss', 'Insured', 'Professional Services', 'Wrongful Act', etc.
            Return a list of terms and their corresponding definitions.`;

            const schema = JSON.stringify(MASTER_SCHEMA.definitions, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { definitions: data },
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
