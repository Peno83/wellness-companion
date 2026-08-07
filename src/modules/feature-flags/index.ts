export const featureFlagKeys = [
  "connector_framework",
  "source_selection",
  "source_reconciliation",
  "capability_coverage",
  "whoop",
  "apple_health",
  "health_connect",
  "samsung_health",
  "hume",
  "garmin",
  "fitbit",
  "oura",
  "ai",
  "scoring",
  "notifications",
  "reporting",
] as const;

export type FeatureFlagKey = (typeof featureFlagKeys)[number];
export type FeatureFlagState = Readonly<Record<FeatureFlagKey, boolean>>;

export const defaultFeatureFlags: FeatureFlagState = Object.freeze(
  Object.fromEntries(
    featureFlagKeys.map((key) => [key, false]),
  ) as unknown as FeatureFlagState,
);

export interface FeatureFlagProvider {
  isEnabled(key: FeatureFlagKey): boolean;
}

export class StaticFeatureFlagProvider implements FeatureFlagProvider {
  constructor(private readonly flags: FeatureFlagState = defaultFeatureFlags) {}

  isEnabled(key: FeatureFlagKey): boolean {
    return this.flags[key];
  }
}

export const governanceIsFeatureFlagged = false as const;
