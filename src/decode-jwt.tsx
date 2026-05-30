import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";

// `jwt.decode` returns header/payload as already-pretty JSON strings. We try
// to parse them so we can re-pretty with our own formatting, but we still
// render whatever the CLI gave us if the parse fails (the upstream string is
// always a faithful representation of the token).
interface JwtResult {
  header: string;
  payload: string;
  signature: string;
}

export default function Command() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<JwtResult | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void (async () => {
      const seed = (await readSeedText()).trim();
      setToken(seed);
      if (!seed) {
        setLoading(false);
        return;
      }
      try {
        const raw = await runHexkit<JwtResult>("jwt.decode", { token: seed });
        if (typeof raw === "string") {
          // CLI returned a raw string we couldn't parse — surface the error.
          setError(`Couldn't parse jwt.decode output: ${raw.slice(0, 200)}`);
        } else {
          setResult(raw);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Detail
      isLoading={loading}
      markdown={renderMarkdown(token, result, error)}
      actions={
        <ActionPanel>
          {result?.payload && (
            <Action.CopyToClipboard
              title="Copy Payload JSON"
              content={result.payload}
            />
          )}
          {result?.header && (
            <Action.CopyToClipboard title="Copy Header JSON" content={result.header} />
          )}
          {token && <Action.CopyToClipboard title="Copy Token" content={token} />}
          {token && (
            <Action
              title="Open in Hexkit"
              icon={Icon.AppWindow}
              shortcut={{ modifiers: ["cmd"], key: "o" }}
              onAction={async () => {
                try {
                  await openInHexkitApp("jwt.decode", { input: token });
                } catch (err) {
                  await toastError(err);
                }
              }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}

function renderMarkdown(token: string, result: JwtResult | null, error?: string): string {
  if (error) {
    return ["## Decode JWT failed", "", "```", error, "```"].join("\n");
  }
  if (!token) {
    return [
      "## Decode JWT",
      "",
      "Copy a JWT or select one in another app, then run this command again.",
    ].join("\n");
  }
  if (!result) return "";
  const lines: string[] = ["## Decoded JWT", ""];
  if (result.header) {
    lines.push("### Header", "", "```json", prettifyJsonString(result.header), "```", "");
  }
  if (result.payload) {
    lines.push("### Payload", "", "```json", prettifyJsonString(result.payload), "```", "");
  }
  if (result.signature) {
    lines.push("### Signature", "", "```", result.signature, "```");
  }
  return lines.join("\n");
}

function prettifyJsonString(jsonText: string): string {
  try {
    return JSON.stringify(JSON.parse(jsonText), null, 2);
  } catch {
    return jsonText;
  }
}
