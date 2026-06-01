import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultMulti } from "./lib/result";

interface AllBases {
  binary: string;
  octal: string;
  decimal: string;
  hexadecimal: string;
  custom: string;
}

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then((t) => setSeed(t.trim()));
  }, []);

  async function submit(values: { input: string; base: string; custom: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter a number to convert.");
      return;
    }
    const base = Number.parseInt(values.base, 10) || 10;
    const customBase = Number.parseInt(values.custom, 10) || 36;
    try {
      const raw = await runHexkit<AllBases>("number.all", {
        input: values.input,
        base,
        custom_base: customBase,
      });
      if (typeof raw === "string") {
        setError(`Couldn't parse number.all output: ${raw.slice(0, 200)}`);
        return;
      }
      push(
        <ResultMulti
          title="Number Base"
          rows={[
            { label: "Binary (2)", value: raw.binary },
            { label: "Octal (8)", value: raw.octal },
            { label: "Decimal (10)", value: raw.decimal },
            { label: "Hexadecimal (16)", value: raw.hexadecimal },
            { label: `Base ${customBase}`, value: raw.custom },
          ]}
          deepLink={{ action: "number.all", params: { input: values.input } }}
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
          <Action.SubmitForm title="Convert" icon={Icon.Hashtag} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("number.all", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="input"
        title="Number"
        placeholder="e.g. 255 / ff / 0b1010"
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
      <Form.Dropdown id="base" title="Source base" defaultValue="10">
        <Form.Dropdown.Item value="2" title="Binary (2)" />
        <Form.Dropdown.Item value="8" title="Octal (8)" />
        <Form.Dropdown.Item value="10" title="Decimal (10)" />
        <Form.Dropdown.Item value="16" title="Hexadecimal (16)" />
      </Form.Dropdown>
      <Form.TextField
        id="custom"
        title="Custom base"
        placeholder="2–36"
        defaultValue="36"
      />
    </Form>
  );
}
