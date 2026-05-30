import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";

type Indent = "  " | "    " | "\t";

interface State {
  loading: boolean;
  input: string;
  output: string;
  error?: string;
  sort: boolean;
  indent: Indent;
}

export default function Command() {
  const [state, setState] = useState<State>({
    loading: true,
    input: "",
    output: "",
    sort: false,
    indent: "  ",
  });

  useEffect(() => {
    void (async () => {
      const seed = await readSeedText();
      await format(seed, "  ", false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function format(input: string, indent: Indent, sort: boolean) {
    if (!input.trim()) {
      setState({ loading: false, input, output: "", indent, sort });
      return;
    }
    setState((s) => ({ ...s, loading: true, input, indent, sort }));
    try {
      // `json.format` returns the formatted JSON as a plain string.
      const result = await runHexkit<string>("json.format", { input, indent, sort });
      const output = typeof result === "string" ? result : JSON.stringify(result, null, indent);
      setState({ loading: false, input, output, indent, sort });
    } catch (err) {
      setState({
        loading: false,
        input,
        output: "",
        indent,
        sort,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <Detail
      isLoading={state.loading}
      markdown={renderMarkdown(state)}
      actions={
        <ActionPanel>
          {state.output && (
            <Action.CopyToClipboard title="Copy Formatted JSON" content={state.output} />
          )}
          <Action
            title={state.sort ? "Disable Sort Keys" : "Sort Keys"}
            icon={Icon.ArrowUp}
            shortcut={{ modifiers: ["cmd"], key: "s" }}
            onAction={() => format(state.input, state.indent, !state.sort)}
          />
          <Action
            title={state.indent === "  " ? "Use 4-Space Indent" : "Use 2-Space Indent"}
            icon={Icon.Text}
            shortcut={{ modifiers: ["cmd"], key: "i" }}
            onAction={() => format(state.input, state.indent === "  " ? "    " : "  ", state.sort)}
          />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={async () => {
              try {
                await openInHexkitApp("json.format", { input: state.input });
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
    return [
      "## JSON Format failed",
      "",
      "```",
      state.error,
      "```",
      "",
      "Press `⌘O` to open the input in the Hexkit desktop app.",
    ].join("\n");
  }
  if (!state.input.trim()) {
    return [
      "## Format JSON",
      "",
      "Copy some JSON or select it in another app, then run this command again.",
      "",
      "_Tip: press `⌘S` to sort keys, `⌘I` to toggle indentation._",
    ].join("\n");
  }
  if (!state.output) return "";
  return ["```json", state.output, "```"].join("\n");
}
