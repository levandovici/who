// Start entrypoint. Last-chance schema sync: if db push couldn't run during
// the build (build-host DNS restrictions, runtime-only env vars), try again
// here where the app actually connects. Failure is non-fatal.
import { execSync, spawnSync } from "node:child_process";

try {
  process.loadEnvFile();
} catch {}

const scheme = /^mongodb(\+srv)?:\/\//;
if (!scheme.test(process.env.DATABASE_URL ?? "")) {
  const uri = Object.values(process.env).find((v) => scheme.test(v ?? ""));
  if (uri) process.env.DATABASE_URL = uri;
}

if (scheme.test(process.env.DATABASE_URL ?? "")) {
  try {
    execSync("prisma db push", { stdio: "inherit" });
  } catch {
    console.warn("who: db push at startup failed — continuing anyway");
  }
}

const child = spawnSync("next", ["start"], { stdio: "inherit" });
process.exit(child.status ?? 1);
