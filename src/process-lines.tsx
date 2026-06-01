import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultText } from "./lib/result";

interface FormValues {
  input: string;
  sort: boolean;
  reverse: boolean;
  dedupe: boolean;
  trim: boolean;
}

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then(setSeed);
  }, []);

  async function submit(values: FormValues) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Paste some lines to process.");
      return;
    }
    try {
      const out = await runHexkit<string>("lines.process", values);
      push(
        <ResultText
          title="Lines"
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "lines.process", params: { input: values.input } }}
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
          <Action.SubmitForm title="Process" icon={Icon.AppWindowList} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("lines.process", { input: seed }).catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="Lines" defaultValue={seed} placeholder="One value per line" error={error} onChange={() => error && setError(undefined)} />
      <Form.Checkbox id="sort" label="Sort" defaultValue={true} />
      <Form.Checkbox id="reverse" label="Reverse order" defaultValue={false} />
      <Form.Checkbox id="dedupe" label="Deduplicate" defaultValue={true} />
      <Form.Checkbox id="trim" label="Trim whitespace" defaultValue={true} />
    </Form>
  );
}
