/**
 * Environment variable validation and access
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

const optionalEnvVars = ["CRON_SECRET", "NEXT_PUBLIC_SITE_URL"] as const;

/**
 * Validates that all required environment variables are set
 */
export function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

/**
 * Gets environment variable with type safety
 */
export function getEnv(key: typeof requiredEnvVars[number]): string;
export function getEnv(key: typeof optionalEnvVars[number]): string | undefined;
export function getEnv(key: string): string | undefined {
  return process.env[key];
}

/**
 * Gets environment variable or throws if missing
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

// Validate on module load (only in server-side code)
if (typeof window === "undefined") {
  try {
    validateEnv();
  } catch (error) {
    // Only throw in production to allow dev setup
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
  }
}

