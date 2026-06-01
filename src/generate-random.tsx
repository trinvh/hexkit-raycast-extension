import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { ResultText } from "./lib/result";

interface FormValues {
  length: string;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
}

export default function Command() {
  const { push } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function submit(values: FormValues) {
    setError(undefined);
    const length = Math.max(1, Math.min(2048, Number.parseInt(values.length, 10) || 24));
    if (!values.uppercase && !values.lowercase && !values.digits && !values.symbols) {
      setError("Enable at least one character class.");
      return;
    }
    try {
      const out = await runHexkit<string>("random.generate", {
        length,
        uppercase: values.uppercase,
        lowercase: values.lowercase,
        digits: values.digits,
        symbols: values.symbols,
      });
      push(
        <ResultText
          title={`Random string (${length})`}
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "random.generate", params: { input: "" } }}
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
          <Action.SubmitForm title="Generate" icon={Icon.Shuffle} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("random.generate").catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="length" title="Length" placeholder="1–2048" defaultValue="24" error={error} onChange={() => error && setError(undefined)} />
      <Form.Checkbox id="uppercase" label="Uppercase (A–Z)" defaultValue={true} />
      <Form.Checkbox id="lowercase" label="Lowercase (a–z)" defaultValue={true} />
      <Form.Checkbox id="digits" label="Digits (0–9)" defaultValue={true} />
      <Form.Checkbox id="symbols" label="Symbols (!@#…)" defaultValue={false} />
    </Form>
  );
}
