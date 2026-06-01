import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { ResultText } from "./lib/result";

interface FormValues {
  pattern: string;
  text: string;
  flags: string;
  replacement: string;
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
      const out = await runHexkit<string>("regexp.replace", values);
      push(
        <ResultText
          title="Replacement result"
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "regexp.replace", params: { input: values.text } }}
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
          <Action.SubmitForm title="Replace" icon={Icon.MagnifyingGlass} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("regexp.replace").catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="pattern" title="Pattern" placeholder="(\\w+)@(\\w+)" error={error} onChange={() => error && setError(undefined)} />
      <Form.TextField id="flags" title="Flags" defaultValue="g" />
      <Form.TextArea id="text" title="Text" placeholder="Input" />
      <Form.TextField id="replacement" title="Replacement" placeholder="$2/$1" />
    </Form>
  );
}
