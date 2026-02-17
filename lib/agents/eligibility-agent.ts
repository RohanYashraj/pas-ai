import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class EligibilityAgent extends BaseAgent {
    public name = "Eligibility Agent";
    public description = "Owner of eligibility_rules domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract entry age bounds, residency, occupation classes, financial sum assured limits, and policy term constraints.");

            const prompt = `Extract entry/expiry ages, residency requirements, occupation eligibility (allowed/excluded), financial limits (SA bounds), and policy term constraints.
      - entry_age: min/maximum (numeric), unit.
      - expiry_age: maximum (numeric), unit.
      - residency_requirements: allowed_statuses (resident/nri/oci) and restrictions.
      - occupation_eligibility: allowed_classes, excluded_classes, special_conditions.
      - financial_limits: minimum_sum_assured and maximum_sum_assured.
      - policy_term_constraints: min_years, max_years.
      Ensure all numerical outputs are pure numbers. Strictly follow the DEFINITIVE_PAS_SCHEMA.eligibility_rules structure.`;

            const schema = JSON.stringify({ eligibility_rules: DEFINITIVE_PAS_SCHEMA.eligibility_rules }, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data,
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
