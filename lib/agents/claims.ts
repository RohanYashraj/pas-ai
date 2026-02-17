import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class ClaimsAgent extends BaseAgent {
    public name = "Claims Procedure Agent";
    public description = "Extracts claims reporting requirements, notice periods, and contact information.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract claims reporting procedures, notice periods, reporting contacts, and formatting requirements.");

            const prompt = `Identify how claims must be reported for this policy.
            Include:
            - Reporting Contact (email, address, or portal mentioned)
            - Notice Period (how soon after an event must it be reported)
            - Reporting Format (e.g., in writing, via specific form)
            - Requirements (any specific documentation required for a notice)`;

            const schema = JSON.stringify(MASTER_SCHEMA.claims_procedures, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { claims_procedures: data },
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
