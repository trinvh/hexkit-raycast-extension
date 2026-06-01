import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultMulti } from "./lib/result";

interface Cases {
  camel: string;
  pascal: string;
  snake: string;
  kebab: string;
  constant: string;
  title: string;
  sentence: string;
  lower: string;
  upper: string;
}

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then(setSeed);
  }, []);

  async function submit(values: { input: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter text to convert.");
      return;
    }
    try {
      const raw = await runHexkit<Cases>("case.convert", { input: values.input });
      if (typeof raw === "string") {
        setError(`Couldn't parse case.convert output: ${raw.slice(0, 200)}`);
        return;
      }
      push(
        <ResultMulti
          title="Case Converter"
          rows={[
            { label: "camelCase", value: raw.camel },
            { label: "PascalCase", value: raw.pascal },
            { label: "snake_case", value: raw.snake },
            { label: "kebab-case", value: raw.kebab },
            { label: "CONSTANT_CASE", value: raw.constant },
            { label: "Title Case", value: raw.title },
            { label: "Sentence case", value: raw.sentence },
            { label: "lowercase", value: raw.lower },
            { label: "UPPERCASE", value: raw.upper },
          ]}
          deepLink={{ action: "case.convert", params: { input: values.input } }}
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
          <Action.SubmitForm title="Convert" icon={Icon.Text} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("case.convert", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title="Text"
        placeholder="e.g. hello world"
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
    </Form>
  );
}
