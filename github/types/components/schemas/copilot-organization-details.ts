import type { copilot_organization_seat_breakdown } from "./copilot-organization-seat-breakdown.js";

/**
 * Information about the seat breakdown and policies set for an organization with a Copilot Business or Copilot Enterprise subscription.
 */
export type copilot_organization_details = {
  seat_breakdown: copilot_organization_seat_breakdown;
  /**
   * The organization policy for allowing or blocking suggestions matching public code (duplication detection filter).
   */
  public_code_suggestions: "allow" | "block" | "unconfigured";
  /**
   * The organization policy for allowing or disallowing Copilot Chat in the IDE.
   */
  ide_chat?: "enabled" | "disabled" | "unconfigured";
  /**
   * The organization policy for allowing or disallowing Copilot features on GitHub.com.
   */
  platform_chat?: "enabled" | "disabled" | "unconfigured";
  /**
   * The organization policy for allowing or disallowing Copilot CLI.
   */
  cli?: "enabled" | "disabled" | "unconfigured";
  /**
   * The mode of assigning new seats.
   */
  seat_management_setting:
    | "assign_all"
    | "assign_selected"
    | "disabled"
    | "unconfigured";
  /**
   * The Copilot plan of the organization, or the parent enterprise, when applicable.
   */
  plan_type?: "business" | "enterprise";
  [key: string]: unknown;
};
