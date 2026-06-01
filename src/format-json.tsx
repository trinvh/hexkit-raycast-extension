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

type Indent = "  " | "    " | "\t";

interface FormValues {
  input: string;
  indent: Indent;
  sort: boolean;
}

export default function Command() {
  const { push } = useNavigation();
  // Seed is null while we read the clipboard / selection. Once it's a string
  // (possibly empty) we render the Form with that text as the initial value.
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then(setSeed);
  }, []);

  async function handleSubmit(values: FormValues) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter some JSON to format.");
      return;
    }
    try {
      const result = await runHexkit<string>("json.format", {
        input: values.input,
        indent: values.indent,
        sort: values.sort,
      });
      const output =
        typeof result === "string"
          ? result
          : JSON.stringify(result, null, values.indent);
      push(
        <ResultDetail
          input={values.input}
          output={output}
          indent={values.indent}
          sort={values.sort}
        />,
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
            title="Format JSON"
            icon={Icon.Code}
            onSubmit={handleSubmit}
          />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={async () => {
              try {
                await openInHexkitApp("json.format", { input: seed });
              } catch (err) {
                await toastError(err);
              }
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title="JSON"
        placeholder="Paste or edit JSON here…"
        defaultValue={seed}
        error={error}
        onChange={() => {
          if (error) setError(undefined);
        }}
      />
      <Form.Checkbox id="sort" label="Sort keys" defaultValue={false} />
      <Form.Dropdown id="indent" title="Indent" defaultValue="  ">
        <Form.Dropdown.Item value="  " title="2 spaces" />
        <Form.Dropdown.Item value="    " title="4 spaces" />
        <Form.Dropdown.Item value="\t" title="Tab" />
      </Form.Dropdown>
    </Form>
  );
}

function ResultDetail({
  input,
  output,
  indent,
  sort,
}: {
  input: string;
  output: string;
  indent: Indent;
  sort: boolean;
}) {
  const indentLabel = indent === "\t" ? "tab" : `${indent.length} spaces`;
  const markdown = [
    `_Indent: ${indentLabel}${sort ? " · sorted" : ""}_`,
    "",
    "```json",
    output,
    "```",
  ].join("\n");
  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy Formatted JSON" content={output} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={async () => {
              try {
                await openInHexkitApp("json.format", { input });
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
