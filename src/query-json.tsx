import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultText } from "./lib/result";

type Indent = "  " | "    " | "\t";

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then(setSeed);
  }, []);

  async function submit(values: { input: string; path: string; indent: Indent }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Paste JSON to query.");
      return;
    }
    if (!values.path.trim()) {
      setError("Enter a JSONPath expression.");
      return;
    }
    try {
      const out = await runHexkit<string>("json.query", values);
      push(
        <ResultText
          title="JSONPath result"
          language="json"
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "json.query", params: { input: values.input } }}
        />,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (seed === null) return <Form isLoading />;

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Query" icon={Icon.MagnifyingGlass} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("json.query", { input: seed }).catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="JSON" placeholder="{...}" defaultValue={seed} error={error} onChange={() => error && setError(undefined)} />
      <Form.TextField id="path" title="JSONPath" placeholder="$.users[*].id" defaultValue="$" />
      <Form.Dropdown id="indent" title="Indent" defaultValue="  ">
        <Form.Dropdown.Item value="  " title="2 spaces" />
        <Form.Dropdown.Item value="    " title="4 spaces" />
        <Form.Dropdown.Item value="\t" title="Tab" />
      </Form.Dropdown>
    </Form>
  );
}
