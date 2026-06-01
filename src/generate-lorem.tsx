import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { ResultText } from "./lib/result";

type Kind = "words" | "paragraphs";

export default function Command() {
  const { push } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function submit(values: { kind: Kind; count: string }) {
    setError(undefined);
    const count = Math.max(1, Math.min(50, Number.parseInt(values.count, 10) || 3));
    try {
      const out = await runHexkit<string>("lorem.generate", {
        kind: values.kind,
        count,
      });
      push(
        <ResultText
          title={`Lorem (${values.kind})`}
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "lorem.generate", params: { input: "" } }}
        />,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Generate" icon={Icon.Text} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("lorem.generate").catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="kind" title="Kind" defaultValue="paragraphs" error={error}>
        <Form.Dropdown.Item value="words" title="Words" />
        <Form.Dropdown.Item value="paragraphs" title="Paragraphs" />
      </Form.Dropdown>
      <Form.TextField id="count" title="Count" placeholder="1–50" defaultValue="3" />
    </Form>
  );
}
