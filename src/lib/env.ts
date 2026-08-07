import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/)
    .default("0.1.0"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Environment = z.infer<typeof environmentSchema>;

export function parseEnvironment(input: NodeJS.ProcessEnv): Environment {
  return environmentSchema.parse(input);
}

export function getEnvironment(): Environment {
  return parseEnvironment(process.env);
}

export function getPublicEnvironment(): Pick<
  Environment,
  "APP_VERSION" | "NODE_ENV"
> {
  const environment = getEnvironment();
  return {
    APP_VERSION: environment.APP_VERSION,
    NODE_ENV: environment.NODE_ENV,
  };
}
