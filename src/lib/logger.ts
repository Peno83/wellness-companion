type LogLevel = "debug" | "info" | "warn" | "error";

import { systemClock, type Clock } from "./clock";

type SafeLogContext = Readonly<Record<string, unknown>>;

const forbiddenKey =
  /(?:secret|token|password|credential|health|payload|measurement|user)/i;

const secretPatterns: readonly RegExp[] = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?(?:-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|$)/gi,
  /\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|mssql):\/\/[^\s:/@"'<>]+:[^\s/@"'<>]+@[^\s"'<>]+/gi,
  /DefaultEndpointsProtocol=https?;AccountName=[^;\s]+;AccountKey=[A-Za-z0-9+/=]{20,};EndpointSuffix=[^;\s]+/gi,
  /\bgithub_pat_[A-Za-z0-9_]{80,255}\b/g,
  /\bgh[pousr]_[A-Za-z0-9]{36,255}\b/g,
  /\bsk-ant-[A-Za-z0-9_-]{32,}\b/g,
  /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/g,
  /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  /\bBearer\s+[A-Za-z0-9._~+/-]{16,}={0,2}\b/gi,
  /(?:oauth[_-]?)?client[_-]?secret\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{16,}["']?/gi,
  /(?:api[_-]?key|access[_-]?token|password)\s*[:=]\s*["']?[A-Za-z0-9+/=_-]{16,}["']?/gi,
];

export function redactLogValue(value: unknown): unknown {
  if (typeof value === "string") {
    return secretPatterns.reduce(
      (redacted, pattern) => redacted.replace(pattern, "[REDACTED]"),
      value,
    );
  }
  if (Array.isArray(value)) return value.map(redactLogValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        forbiddenKey.test(key) ? "[REDACTED]" : redactLogValue(nestedValue),
      ]),
    );
  }
  return value;
}

export function log(
  level: LogLevel,
  message: string,
  context: SafeLogContext = {},
  clock: Clock = systemClock,
): void {
  const redactedContext = redactLogValue(context) as Readonly<
    Record<string, unknown>
  >;
  const entry = JSON.stringify({
    timestamp: clock.now().toISOString(),
    level,
    message: redactLogValue(message),
    ...redactedContext,
  });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.log(entry);
}
