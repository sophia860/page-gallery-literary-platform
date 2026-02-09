import { execSync } from "child_process";

try {
  console.log("Running pnpm install --no-frozen-lockfile...");
  const output = execSync("pnpm install --no-frozen-lockfile", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log(output);
  console.log("Lockfile updated successfully.");
} catch (error) {
  console.error("Error:", error.message);
  if (error.stdout) console.log("stdout:", error.stdout);
  if (error.stderr) console.log("stderr:", error.stderr);
  process.exit(1);
}
