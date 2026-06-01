import {
  Action,
  ActionPanel,
  Detail,
  Form,
  Icon,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";

type Kind = "uuid_v4" | "uuid_v7" | "ulid" | "nano_id";

const KIND_LABEL: Record<Kind, string> = {
  uuid_v4: "UUID v4 (random)",
  uuid_v7: "UUID v7 (time-ordered)",
  ulid: "ULID",
  nano_id: "Nano ID",
};

interface FormValues {
  kind: Kind;
  count: string; // Form values arrive as strings; we parse to int.
  lowercased: boolean;
}

export default function Command() {
  const { push } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(values: FormValues) {
    setError(undefined);
    const count = Math.max(1, Math.min(50, Number.parseInt(values.count, 10) || 1));
    try {
      const raw = await runHexkit<string[]>("id.generate", {
        kind: values.kind,
        count,
        lowercased: values.lowercased,
      });
      const values_out = Array.isArray(raw) ? raw : [String(raw)];
      push(<ResultDetail kind={values.kind} values={values_out} />);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Generate"
            icon={Icon.PlusCircle}
            onSubmit={handleSubmit}
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
    >
      <Form.Dropdown id="kind" title="Kind" defaultValue="uuid_v4" error={error}>
        {(Object.keys(KIND_LABEL) as Kind[]).map((kind) => (
          <Form.Dropdown.Item key={kind} value={kind} title={KIND_LABEL[kind]} />
        ))}
      </Form.Dropdown>
      <Form.TextField
        id="count"
        title="Count"
        placeholder="1–50"
        defaultValue="5"
      />
      <Form.Checkbox
        id="lowercased"
        label="Lowercase output (UUIDs only)"
        defaultValue={false}
      />
    </Form>
  );
}

function ResultDetail({ kind, values }: { kind: Kind; values: string[] }) {
  const list = values.map((v) => `- \`${v}\``).join("\n");
  return (
    <Detail
      markdown={[`## ${KIND_LABEL[kind]}`, "", list].join("\n")}
      actions={
        <ActionPanel>
          {values[0] && (
            <Action.CopyToClipboard title="Copy First ID" content={values[0]} />
          )}
          {values.length > 1 && (
            <Action.CopyToClipboard
              title="Copy All"
              content={values.join("\n")}
            />
          )}
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
