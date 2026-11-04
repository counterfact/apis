/**
 * Platform limit with usage computed externally. Example: PVCs use the count_owned_pro_voices_in_billing_group function to compute the usage.
 */
export type ComputedUsagePlatformLimit = { limit?: number | null };
