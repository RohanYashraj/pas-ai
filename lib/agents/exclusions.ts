import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class ExclusionsAgent extends BaseAgent {
    public name = "Exclusions Expert Agent";
    public description = "Extracts policy exclusions, limitations, and specific carve-outs.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract all policy exclusions, limitations, and specific carve-outs or conditions.");

            const prompt = `Identify all exclusions listed in the policy.
            For each exclusion, extract:
            - Exclusion Name (e.g., War, Terrorism, Nuclear, Prior Acts)
            - Description (brief explanation of what is excluded)
            - Category (e.g., General, Professional, Cyber, Conduct)
            - Applicability (to which sections of the policy does it apply)`;

            const schema = JSON.stringify(MASTER_SCHEMA.exclusions, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { exclusions: data },
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
