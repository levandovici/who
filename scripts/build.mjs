// Build entrypoint. Hostinger injects the Atlas URI under its own env var
// name (e.g. MONGODB_URI), but Prisma only reads DATABASE_URL — adopt any
// env var holding a mongodb URI. A failed push never breaks the build;
// scripts/start.mjs retries it at app boot, where DNS is a different box.
import { execSync } from "node:child_process";

try {
  process.loadEnvFile();
} catch {}

const scheme = /^mongodb(\+srv)?:\/\//;
const run = (cmd) => execSync(cmd, { stdio: "inherit" });

let dbUrl = process.env.DATABASE_URL;
if (!scheme.test(dbUrl ?? "")) {
  dbUrl = Object.values(process.env).find((v) => scheme.test(v ?? ""));
}

if (dbUrl) {
  process.env.DATABASE_URL = dbUrl;
  try {
    run("prisma db push");
  } catch {
    console.warn("who: db push failed at build time — will retry at startup");
  }
} else {
  console.warn("who: no MongoDB URI found in env — generating client only");
  process.env.DATABASE_URL = "mongodb://localhost/who"; // generate doesn't connect
}

try {
  run("prisma generate");
} catch {
  /* engines already generated */
}

run("next build --webpack");
