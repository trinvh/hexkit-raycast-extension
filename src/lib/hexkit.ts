import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { homedir } from "node:os";
import { existsSync } from "node:fs";
import { getPreferenceValues, open, showToast, Toast } from "@raycast/api";

const execFileAsync = promisify(execFile);

interface Preferences {
  hexkitCliPath?: string;
  licenseKey?: string;
}

/**
 * Likely install locations to fall back to when the user-configured path is
 * just `hexkit` and Raycast's spawn environment doesn't inherit the user's
 * shell PATH. Order matters — first match wins.
 */
const FALLBACK_BIN_PATHS = [
  "/opt/homebrew/bin/hexkit",
  "/usr/local/bin/hexkit",
  `${homedir()}/.cargo/bin/hexkit`,
  `${homedir()}/.local/bin/hexkit`,
];

function resolveCliPath(): string {
  const configured = getPreferenceValues<Preferences>().hexkitCliPath?.trim();
  if (configured && configured.includes("/")) return configured;

  for (const candidate of FALLBACK_BIN_PATHS) {
    if (existsSync(candidate)) return candidate;
  }
  return configured && configured.length > 0 ? configured : "hexkit";
}

/**
 * Run a Hexkit action via the `hexkit` CLI and return its output.
 *
 * String-shaped results are returned as the raw string. Object/array results
 * arrive as pretty-printed JSON; we parse them transparently. Errors raised by
 * the CLI surface as `Error` with the original message.
 */
export async function runHexkit<T = unknown>(
  action: string,
  params: Record<string, unknown> = {},
): Promise<T | string> {
  const bin = resolveCliPath();
  try {
    const { stdout } = await execFileAsync(bin, [action, JSON.stringify(params)], {
      timeout: 30_000,
      maxBuffer: 16 * 1024 * 1024,
    });
    const trimmed = stdout.replace(/\n$/, "");
    try {
      return JSON.parse(trimmed) as T;
    } catch {
      return trimmed;
    }
  } catch (err) {
    throw normalizeCliError(err, bin);
  }
}

function normalizeCliError(err: unknown, bin: string): Error {
  if (typeof err === "object" && err !== null) {
    const e = err as { code?: string; stderr?: string; message?: string };
    if (e.code === "ENOENT") {
      return new Error(
        `Could not find the \`hexkit\` CLI at \`${bin}\`. Set the path in Hexkit extension preferences or install the CLI.`,
      );
    }
    if (e.stderr) {
      const match = e.stderr.match(/error:\s*(.+)/);
      return new Error(match ? match[1].trim() : e.stderr.trim());
    }
    if (e.message) return new Error(e.message);
  }
  return new Error(String(err));
}

/**
 * Open the Hexkit desktop app at a specific tool, optionally pre-seeding the
 * input via query parameters. Used for tools whose UI doesn't fit in Raycast
 * (color picker, QR, certificate visualizer, etc.).
 */
export async function openInHexkitApp(
  action: string,
  params: Record<string, string> = {},
): Promise<void> {
  const qs = new URLSearchParams(params).toString();
  const url = `hexkit://${action}${qs ? `?${qs}` : ""}`;
  await open(url);
}

export async function toastError(err: unknown, title = "Hexkit error"): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  await showToast({ style: Toast.Style.Failure, title, message });
}
