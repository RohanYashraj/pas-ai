import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class CoverageAgent extends BaseAgent {
  public name = "Coverage Specialist Agent";
  public description = "Extracts detailed coverage information, including limits, deductibles, retentions, sub-limits, and waiting periods.";

  public async run(documentId: string): Promise<AgentResponse> {
    try {
      const context = await this.getContext("Extract all coverage types, their respective limits, deductibles, retentions, sub-limits, and waiting periods from this policy specification.");

      const prompt = `Identify all coverages listed in the document.
            For each coverage, extract:
            - Coverage Name
            - Description (brief)
            - Limit of Liability
            - Deductible
            - Retention (if different from deductible)
            - Waiting Period (common in Cyber or BI coverages)
            - Sub-limits (a list of specific items covered under a lower limit than the main coverage)`;

      const schema = JSON.stringify(MASTER_SCHEMA.coverages, null, 2);

      const data = await this.extract<any>(context, prompt, schema);

      return {
        agentName: this.name,
        data: { coverages: data },
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
