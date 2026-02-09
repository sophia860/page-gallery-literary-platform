import { execSync } from "child_process";

try {
  const output = execSync("pnpm install --no-frozen-lockfile", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log(output);
  console.log("Lockfile updated successfully.");
} catch (error) {
  console.error("Error updating lockfile:", error.message);
  if (error.stdout) console.log(error.stdout);
  if (error.stderr) console.error(error.stderr);
  process.exit(1);
}
