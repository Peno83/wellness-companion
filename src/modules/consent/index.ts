export interface ConsentContract {
  readonly purpose: string;
  readonly scopes: readonly string[];
  readonly granted: boolean;
  readonly policyVersion: string;
}
