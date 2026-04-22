import { execFile } from "node:child_process";

function execFileAsync(
  command: string,
  args: string[],
  cwd: string,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      { cwd, timeout: 10 * 60 * 1000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(
            new Error(
              `Command failed: ${command} ${args.join(" ")}\n${stderr || stdout || error.message}`,
            ),
          );
          return;
        }

        resolve({ stdout, stderr });
      },
    );
  });
}

export async function rebuildWebStack() {
  const rebuildScript = process.env.REBUILD_WEB_SCRIPT;

  if (!rebuildScript) {
    throw new Error("REBUILD_WEB_SCRIPT is not configured for rebuild operations.");
  }

  const result = await execFileAsync("sh", [rebuildScript], process.cwd());

  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}
