import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";

interface JwtResult {
  header?: unknown;
  payload?: unknown;
  signature?: string;
  algorithm?: string;
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
        const raw = await runHexkit<JwtResult>("jwt.decode", { input: seed });
        setResult(typeof raw === "string" ? safeParse(raw) : raw);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markdown = renderMarkdown(token, result, error);

  return (
    <Detail
      isLoading={loading}
      markdown={markdown}
      actions={
        <ActionPanel>
          {result?.payload != null && (
            <Action.CopyToClipboard
              title="Copy Payload JSON"
              content={JSON.stringify(result.payload, null, 2)}
            />
          )}
          {token && (
            <Action.CopyToClipboard title="Copy Token" content={token} />
          )}
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

function safeParse(raw: string): JwtResult | null {
  try {
    return JSON.parse(raw) as JwtResult;
  } catch {
    return null;
  }
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
  if (result.algorithm) lines.push(`**Algorithm:** \`${result.algorithm}\``, "");
  if (result.header !== undefined) {
    lines.push("### Header", "", "```json", JSON.stringify(result.header, null, 2), "```", "");
  }
  if (result.payload !== undefined) {
    lines.push("### Payload", "", "```json", JSON.stringify(result.payload, null, 2), "```", "");
  }
  if (result.signature) {
    lines.push("### Signature", "", "```", result.signature, "```");
  }
  return lines.join("\n");
}
