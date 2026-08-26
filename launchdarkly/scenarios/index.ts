import type { Scenario } from "../types/_.context.js";
import type { FlagEnvironmentConfig } from "../routes/_.context.js";

const PROJECT = "commerce-platform";
const PRODUCTION = "production";
const SEMANTIC_CONTENT_TYPE =
  "application/json; domain-model=launchdarkly.semanticpatch";

const baselineFlags = [
  {
    key: "checkout-redesign",
    name: "Checkout redesign",
    description: "Controls the streamlined checkout experience",
    tags: ["checkout", "web"],
  },
  {
    key: "recommendation-model",
    name: "Recommendation model",
    description: "Selects the personalized product recommendation model",
    tags: ["personalization", "machine-learning"],
    variations: [
      { value: "stable", name: "Stable" },
      { value: "candidate", name: "Candidate" },
      { value: "control", name: "Control" },
    ],
  },
  {
    key: "search-v2",
    name: "Search v2",
    description: "Enables the relevance-tuned search service",
    tags: ["search", "backend"],
  },
  {
    key: "mobile-navigation",
    name: "Mobile navigation",
    description: "Enables the compact mobile navigation layout",
    tags: ["mobile", "navigation"],
  },
  {
    key: "saved-carts",
    name: "Saved carts",
    description: "Allows signed-in customers to save carts",
    tags: ["cart", "accounts"],
  },
  {
    key: "express-delivery",
    name: "Express delivery",
    description: "Offers expedited delivery for eligible addresses",
    tags: ["fulfillment", "shipping"],
  },
  {
    key: "account-security-center",
    name: "Account security center",
    description: "Enables the consolidated account security page",
    tags: ["accounts", "security"],
  },
  {
    key: "pricing-page-copy",
    name: "Pricing page copy",
    description: "Selects the pricing-page messaging variant",
    tags: ["marketing", "web"],
    variations: [
      { value: "benefit-led", name: "Benefit led" },
      { value: "feature-led", name: "Feature led" },
    ],
  },
  {
    key: "analytics-pipeline-v2",
    name: "Analytics pipeline v2",
    description:
      "Sends application events through the second-generation pipeline",
    tags: ["analytics", "platform"],
  },
  {
    key: "support-chat-widget",
    name: "Support chat widget",
    description: "Displays the embedded customer support widget",
    tags: ["support", "web"],
  },
  {
    key: "legacy-billing-page",
    name: "Legacy billing page",
    description: "Keeps the previous billing page available during migration",
    tags: ["billing", "migration"],
    temporary: false,
  },
  {
    key: "invoice-pdf-redesign",
    name: "Invoice PDF redesign",
    description: "Uses the updated invoice document layout",
    tags: ["billing", "documents"],
  },
] as const;

function requireBaseline($: Parameters<Scenario>[0]): void {
  try {
    $.context.getEnvironment(PROJECT, PRODUCTION);
  } catch {
    throw new Error(
      "LaunchDarkly baseline records are missing. Run `.scenario reset` first.",
    );
  }
}

function requireFlag($: Parameters<Scenario>[0], flagKey: string) {
  requireBaseline($);
  try {
    return $.context.getFlag(PROJECT, flagKey);
  } catch {
    throw new Error(
      `Required flag '${flagKey}' is missing. Run \`.scenario reset\` first.`,
    );
  }
}

/** Replace all live state with the deterministic two-project baseline. */
export const reset: Scenario = ($) => {
  $.context.reset();

  $.context.createProject({
    key: PROJECT,
    name: "Commerce Platform",
    tags: ["customer-facing", "platform"],
    environments: [
      {
        key: PRODUCTION,
        name: "Production",
        color: "2f80ed",
        critical: true,
        requireComments: true,
      },
      { key: "staging", name: "Staging", color: "9b51e0" },
      { key: "development", name: "Development", color: "27ae60" },
    ],
  });
  $.context.createProject({
    key: "internal-tools",
    name: "Internal Tools",
    tags: ["internal"],
    environments: [
      { key: PRODUCTION, name: "Production", color: "2f80ed", critical: true },
      { key: "test", name: "Test", color: "f2c94c" },
    ],
  });

  for (const flag of baselineFlags) {
    $.context.createFlag(PROJECT, {
      ...flag,
      variations: "variations" in flag ? [...flag.variations] : undefined,
      tags: [...flag.tags],
    });
  }

  $.context.createFlag("internal-tools", {
    key: "bulk-account-import",
    name: "Bulk account import",
    description: "Enables CSV account import for operations teams",
    tags: ["operations", "accounts"],
  });
  $.context.createFlag("internal-tools", {
    key: "audit-log-export",
    name: "Audit log export",
    description: "Enables downloadable audit log reports",
    tags: ["security", "reporting"],
  });

  for (const segment of [
    {
      key: "beta-testers",
      name: "Beta testers",
      description: "Customers who opted into preview features",
      tags: ["beta"],
    },
    {
      key: "enterprise-customers",
      name: "Enterprise customers",
      description: "Organizations on an enterprise agreement",
      tags: ["enterprise"],
    },
    {
      key: "employees",
      name: "Employees",
      description: "Internal employee accounts",
      tags: ["internal"],
    },
  ]) {
    $.context.createSegment(PROJECT, PRODUCTION, segment);
  }
  $.context.createSegment(PROJECT, "staging", {
    key: "qa-team",
    name: "QA team",
    description: "Quality engineering test accounts",
    tags: ["testing"],
  });
  $.context.patchSegment(PROJECT, PRODUCTION, "beta-testers", {
    patch: [
      {
        op: "replace",
        path: "/included",
        value: ["user-alex", "user-samira", "user-taylor"],
      },
    ],
  });
  $.context.patchSegment(PROJECT, PRODUCTION, "employees", {
    patch: [
      {
        op: "replace",
        path: "/includedContexts",
        value: [
          {
            contextKind: "organization",
            values: ["counterfact-labs", "northstar-retail"],
          },
        ],
      },
    ],
  });

  for (const flagKey of ["search-v2", "saved-carts", "support-chat-widget"]) {
    $.context.patchFlag(
      PROJECT,
      flagKey,
      { environmentKey: PRODUCTION, instructions: [{ kind: "turnFlagOn" }] },
      { contentType: SEMANTIC_CONTENT_TYPE },
    );
  }
};

/** Turn off checkout-redesign in production without changing its targeting rules. */
export const productionFlagOff: Scenario = ($) => {
  requireFlag($, "checkout-redesign");
  $.context.patchFlag(
    PROJECT,
    "checkout-redesign",
    { environmentKey: PRODUCTION, instructions: [{ kind: "turnFlagOff" }] },
    { contentType: SEMANTIC_CONTENT_TYPE },
  );
};

/** Apply a 10% production rollout to checkout-redesign, preserving other flags. */
export const canaryRollout: Scenario = ($) => {
  const flag = requireFlag($, "checkout-redesign");
  $.context.patchFlag(
    PROJECT,
    "checkout-redesign",
    {
      environmentKey: PRODUCTION,
      instructions: [
        {
          kind: "updateFallthrough",
          rolloutWeights: {
            [flag.variations[0]!._id!]: 10_000,
            [flag.variations[1]!._id!]: 90_000,
          },
          rolloutBucketBy: "key",
          rolloutContextKind: "user",
        },
      ],
    },
    { contentType: SEMANTIC_CONTENT_TYPE },
  );
};

/** Add the early-access segment and reference it from recommendation-model. */
export const earlyAccessSegment: Scenario = ($) => {
  const flag = requireFlag($, "recommendation-model");
  try {
    $.context.getSegment(PROJECT, PRODUCTION, "early-access");
  } catch {
    $.context.createSegment(PROJECT, PRODUCTION, {
      key: "early-access",
      name: "Early access",
      description: "Customers invited to evaluate upcoming capabilities",
      tags: ["preview", "customer-research"],
    });
    $.context.patchSegment(PROJECT, PRODUCTION, "early-access", {
      patch: [
        {
          op: "replace",
          path: "/included",
          value: ["user-jordan", "user-riley", "user-morgan"],
        },
      ],
    });
  }

  const config = flag.environments[PRODUCTION] as FlagEnvironmentConfig;
  if (!config.rules.some((rule) => rule._id === "rule-early-access")) {
    $.context.patchFlag(PROJECT, "recommendation-model", {
      patch: [
        {
          op: "add",
          path: `/environments/${PRODUCTION}/rules/-`,
          value: {
            _id: "rule-early-access",
            clauses: [
              {
                _id: "clause-early-access",
                contextKind: "user",
                attribute: "key",
                op: "segmentMatch",
                negate: false,
                values: ["early-access"],
              },
            ],
            variation: 1,
            trackEvents: false,
          },
        },
      ],
    });
  }
};

/** Explicitly remove the early-access segment and its known targeting rule. */
export const removeEarlyAccessSegment: Scenario = ($) => {
  const flag = requireFlag($, "recommendation-model");
  try {
    $.context.getSegment(PROJECT, PRODUCTION, "early-access");
  } catch {
    throw new Error(
      "The early-access segment is missing. Run `.scenario reset`, then `.scenario earlyAccessSegment` first.",
    );
  }
  const config = flag.environments[PRODUCTION] as FlagEnvironmentConfig;
  $.context.patchFlag(PROJECT, "recommendation-model", {
    patch: [
      {
        op: "replace",
        path: `/environments/${PRODUCTION}/rules`,
        value: config.rules.filter((rule) => rule._id !== "rule-early-access"),
      },
    ],
  });
  $.context.deleteSegment(PROJECT, PRODUCTION, "early-access");
};

/** Archive legacy-billing-page without replacing any other lifecycle state. */
export const archivedFlag: Scenario = ($) => {
  requireFlag($, "legacy-billing-page");
  $.context.patchFlag(
    PROJECT,
    "legacy-billing-page",
    { instructions: [{ kind: "archiveFlag" }] },
    { contentType: SEMANTIC_CONTENT_TYPE },
  );
};

export const startup: Scenario = ($) => reset($);
