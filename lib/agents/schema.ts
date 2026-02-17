export const MASTER_SCHEMA = {
    product_metadata: {
        product_name: "string",
        line_of_business: "string",
        carrier_name: "string",
        version: "string",
        effective_date: "string | null",
        expiration_date: "string | null",
        description: "string | null",
        industry_focus: ["string"],
    },
    coverages: [
        {
            coverage_name: "string",
            description: "string | null",
            limit_of_liability: "string | null",
            deductible: "string | null",
            retention: "string | null",
            waiting_period: "string | null",
            sub_limits: [
                {
                    name: "string",
                    limit: "string"
                }
            ]
        }
    ],
    exclusions: [
        {
            exclusion_name: "string",
            description: "string | null",
            category: "string | null", // e.g., General, Professional Liability, Cyber, etc.
            applicability: "string | null"
        }
    ],
    eligibility_territory: {
        eligible_entities: ["string"],
        ineligible_entities: ["string"],
        territorial_scope: "string | null",
        jurisdiction: "string | null",
        min_assets: "string | null",
        max_employees: "string | null",
    },
    definitions: [
        {
            term: "string",
            definition: "string | null",
        }
    ],
    claims_procedures: {
        reporting_contact: "string | null",
        notice_period: "string | null",
        reporting_format: "string | null",
        requirements: "string | null"
    }
};

export const SCHEMA_STRING = JSON.stringify(MASTER_SCHEMA, null, 2);
