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
  // `object` keeps interface-typed form values assignable without sprinkling
  // `as Record<string, unknown>` casts at every call site — the value is
  // JSON-serialised below, so structural shape doesn't matter at this layer.
  params: object = {},
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
  params: Record<string, unknown> = {},
): Promise<void> {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    // Booleans become "true"/"false", numbers stringify, strings pass through.
    qs.set(key, typeof value === "string" ? value : String(value));
  }
  const queryString = qs.toString();
  const url = `hexkit://${action}${queryString ? `?${queryString}` : ""}`;
  try {
    await open(url);
  } catch (err) {
    throw friendlyOpenError(err);
  }
}

/**
 * `hexkit://` is registered with macOS Launch Services via the bundled .app's
 * Info.plist. `make dev` ships a raw debug binary with no Info.plist, so
 * Launch Services has nothing to route the URL to and `open` returns
 * "The file … can't be found." Translate that to actionable copy.
 */
function friendlyOpenError(err: unknown): Error {
  const raw = err instanceof Error ? err.message : String(err);
  const lower = raw.toLowerCase();
  const looksLikeMissingHandler =
    lower.includes("can't be found") ||
    lower.includes("doesn't exist") ||
    lower.includes("no application") ||
    lower.includes("not found");
  if (!looksLikeMissingHandler) return err instanceof Error ? err : new Error(raw);
  return new Error(
    "macOS couldn't open `hexkit://` — Hexkit isn't registered as a URL " +
      "handler on this Mac yet. Build the app once with `pnpm tauri build` " +
      "in the hexkit-devutils repo (or install a release from " +
      "https://github.com/trinvh/hexkit/releases) so the .app's Info.plist " +
      "claims the scheme. After that, deep links route to whichever Hexkit " +
      "is installed — including the version you're iterating on via " +
      "`make dev`.",
  );
}

export async function toastError(err: unknown, title = "Hexkit error"): Promise<void> {
  const message = err instanceof Error ? err.message : String(err);
  await showToast({ style: Toast.Style.Failure, title, message });
}
