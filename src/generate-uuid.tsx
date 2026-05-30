import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";

type Kind = "uuid_v4" | "uuid_v7" | "ulid" | "nano_id";

interface State {
  loading: boolean;
  kind: Kind;
  values: string[];
  error?: string;
}

export default function Command() {
  const [state, setState] = useState<State>({
    loading: true,
    kind: "uuid_v4",
    values: [],
  });

  useEffect(() => {
    void roll("uuid_v4");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function roll(kind: Kind) {
    setState((s) => ({ ...s, loading: true, kind }));
    try {
      // `id.generate` returns a JSON array of strings.
      const raw = await runHexkit<string[]>("id.generate", {
        kind,
        count: 5,
        lowercased: false,
      });
      const values = Array.isArray(raw) ? raw : [String(raw)];
      setState({ loading: false, kind, values });
    } catch (err) {
      setState({
        loading: false,
        kind,
        values: [],
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const primary = state.values[0];

  return (
    <Detail
      isLoading={state.loading}
      markdown={renderMarkdown(state)}
      actions={
        <ActionPanel>
          {primary && (
            <Action.CopyToClipboard title="Copy First ID" content={primary} />
          )}
          {state.values.length > 1 && (
            <Action.CopyToClipboard
              title="Copy All IDs"
              content={state.values.join("\n")}
            />
          )}
          <Action
            title="Generate More"
            icon={Icon.ArrowClockwise}
            shortcut={{ modifiers: ["cmd"], key: "g" }}
            onAction={() => void roll(state.kind)}
          />
          <Action
            title="Use UUID v4"
            icon={Icon.Dot}
            shortcut={{ modifiers: ["cmd"], key: "1" }}
            onAction={() => void roll("uuid_v4")}
          />
          <Action
            title="Use UUID v7"
            icon={Icon.Dot}
            shortcut={{ modifiers: ["cmd"], key: "2" }}
            onAction={() => void roll("uuid_v7")}
          />
          <Action
            title="Use ULID"
            icon={Icon.Dot}
            shortcut={{ modifiers: ["cmd"], key: "3" }}
            onAction={() => void roll("ulid")}
          />
          <Action
            title="Use Nano ID"
            icon={Icon.Dot}
            shortcut={{ modifiers: ["cmd"], key: "4" }}
            onAction={() => void roll("nano_id")}
          />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={async () => {
              try {
                await openInHexkitApp("id.generate");
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

function renderMarkdown(state: State): string {
  if (state.error) {
    return ["## Generate failed", "", "```", state.error, "```"].join("\n");
  }
  if (state.values.length === 0) return "Generating…";
  const heading = {
    uuid_v4: "UUID v4",
    uuid_v7: "UUID v7",
    ulid: "ULID",
    nano_id: "Nano ID",
  }[state.kind];
  const list = state.values.map((v) => `- \`${v}\``).join("\n");
  return [
    `## ${heading}`,
    "",
    list,
    "",
    "_Press `⌘G` for more, `⌘1`–`⌘4` to change ID kind, `⌘O` to open Hexkit._",
  ].join("\n");
}
