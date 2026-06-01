import { Action, ActionPanel, Detail, Form, Icon, useNavigation } from "@raycast/api";
import { useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";

interface Match {
  start: number;
  end: number;
  text: string;
  groups: string[];
}

interface RegexpResult {
  matches: Match[];
  error: string | null;
}

interface FormValues {
  pattern: string;
  text: string;
  flags: string;
}

export default function Command() {
  const { push } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function submit(values: FormValues) {
    setError(undefined);
    if (!values.pattern) {
      setError("Enter a regular expression.");
      return;
    }
    try {
      const raw = await runHexkit<RegexpResult>("regexp.test", values);
      if (typeof raw === "string") {
        setError(`Couldn't parse regexp.test output: ${raw.slice(0, 200)}`);
        return;
      }
      if (raw.error) {
        setError(raw.error);
        return;
      }
      push(<ResultDetail input={values.text} matches={raw.matches} />);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Test" icon={Icon.MagnifyingGlass} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("regexp.test").catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="pattern" title="Pattern" placeholder="\\d+" error={error} onChange={() => error && setError(undefined)} />
      <Form.TextField id="flags" title="Flags" placeholder="gi" defaultValue="g" />
      <Form.TextArea id="text" title="Text" placeholder="String to search" />
    </Form>
  );
}

function ResultDetail({ input, matches }: { input: string; matches: Match[] }) {
  const md = matches.length
    ? matches
        .map(
          (m, i) =>
            `**Match ${i + 1}** \`[${m.start}-${m.end})\`\n\n\`\`\`\n${m.text}\n\`\`\`${
              m.groups.length ? "\n\n_Groups:_ " + m.groups.map((g) => `\`${g}\``).join(", ") : ""
            }`,
        )
        .join("\n\n")
    : "_No matches._";
  return (
    <Detail
      markdown={`## ${matches.length} match${matches.length === 1 ? "" : "es"}\n\n${md}`}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy All Matches" content={matches.map((m) => m.text).join("\n")} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("regexp.test", { input }).catch(toastError)}
          />
        </ActionPanel>
      }
    />
  );
}
