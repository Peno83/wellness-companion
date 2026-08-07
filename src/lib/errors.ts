export type ApplicationErrorCode =
  | "CONFIGURATION_INVALID"
  | "GOVERNANCE_DENIED"
  | "GOVERNANCE_MISSING"
  | "INVALID_SYNTHETIC_INPUT"
  | "MODULE_DISABLED";

export class ApplicationError extends Error {
  readonly code: ApplicationErrorCode;
  readonly safeMessage: string;

  constructor(
    code: ApplicationErrorCode,
    safeMessage: string,
    options?: ErrorOptions,
  ) {
    super(safeMessage, options);
    this.name = "ApplicationError";
    this.code = code;
    this.safeMessage = safeMessage;
  }
}
