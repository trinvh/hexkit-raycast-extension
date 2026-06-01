import {
  Action,
  ActionPanel,
  Detail,
  Form,
  Icon,
  useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";

interface JwtResult {
  header: string;
  payload: string;
  signature: string;
}

interface Verification {
  valid: boolean;
  algorithm: string;
  reason: string | null;
}

interface FormValues {
  token: string;
  secret: string;
}

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then((text) => setSeed(text.trim()));
  }, []);

  async function handleSubmit(values: FormValues) {
    setError(undefined);
    const token = values.token.trim();
    if (!token) {
      setError("Paste a JWT to decode.");
      return;
    }
    try {
      const decoded = await runHexkit<JwtResult>("jwt.decode", { token });
      if (typeof decoded === "string") {
        setError(`Couldn't parse jwt.decode output: ${decoded.slice(0, 200)}`);
        return;
      }

      let verification: Verification | undefined;
      const secret = values.secret;
      if (secret) {
        const raw = await runHexkit<Verification>("jwt.verify", {
          token,
          secret,
        });
        if (typeof raw !== "string") verification = raw;
      }

      push(
        <ResultDetail token={token} result={decoded} verification={verification} />,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (seed === null) {
    return <Form isLoading />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Decode JWT"
            icon={Icon.Key}
            onSubmit={handleSubmit}
          />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={async () => {
              try {
                await openInHexkitApp("jwt.decode", { input: seed });
              } catch (err) {
                await toastError(err);
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="token"
        title="JWT"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"
        defaultValue={seed}
        error={error}
        onChange={() => {
          if (error) setError(undefined);
        }}
      />
      <Form.PasswordField
        id="secret"
        title="Signing key"
        placeholder="HS256/384/512 secret (leave empty to skip verification)"
      />
    </Form>
  );
}

function ResultDetail({
  token,
  result,
  verification,
}: {
  token: string;
  result: JwtResult;
  verification: Verification | undefined;
}) {
  return (
    <Detail
      markdown={renderMarkdown(result, verification)}
      actions={
        <ActionPanel>
          {result.payload && (
            <Action.CopyToClipboard
              title="Copy Payload JSON"
              content={prettify(result.payload)}
            />
          )}
          {result.header && (
            <Action.CopyToClipboard
              title="Copy Header JSON"
              content={prettify(result.header)}
            />
          )}
          <Action.CopyToClipboard title="Copy Token" content={token} />
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
        </ActionPanel>
      }
    />
  );
}

function renderMarkdown(
  result: JwtResult,
  verification: Verification | undefined,
): string {
  const lines: string[] = ["## Decoded JWT", ""];

  if (verification) {
    const status = verification.valid ? "✅ Signature valid" : "❌ Signature invalid";
    lines.push(`**${status}** · _alg: ${verification.algorithm}_`);
    if (!verification.valid && verification.reason) {
      lines.push("", `> ${verification.reason}`);
    }
    lines.push("");
  }

  if (result.header) {
    lines.push(
      "### Header",
      "",
      "```json",
      prettify(result.header),
      "```",
      "",
    );
  }
  if (result.payload) {
    lines.push(
      "### Payload",
      "",
      "```json",
      prettify(result.payload),
      "```",
      "",
    );
  }
  if (result.signature) {
    lines.push("### Signature", "", "```", result.signature, "```");
  }
  return lines.join("\n");
}

function prettify(json: string): string {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    return json;
  }
}
