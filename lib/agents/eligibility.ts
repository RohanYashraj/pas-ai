import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class EligibilityAgent extends BaseAgent {
    public name = "Eligibility & Territory Agent";
    public description = "Extracts eligibility criteria, entity types, and territorial/jurisdictional limits.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract eligibility criteria, eligible/ineligible entities, territorial scope, jurisdiction, and financial requirements (assets/employees).");

            const prompt = `Identify the eligibility and territorial rules for this product.
            Include:
            - Eligible Entities (which types of companies can buy this)
            - Ineligible Entities (companies excluded from buying this)
            - Territorial Scope (where the product provides coverage, e.g., Worldwide, USA/Canada)
            - Jurisdiction (which laws govern the policy)
            - Minimum Assets Requirement (if mentioned)
            - Maximum Employees Requirement (if mentioned)`;

            const schema = JSON.stringify(MASTER_SCHEMA.eligibility_territory, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { eligibility_territory: data },
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
