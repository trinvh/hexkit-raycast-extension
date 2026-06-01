import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultText } from "./lib/result";

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then(setSeed);
  }, []);

  async function submit(values: { input: string; xpath: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Paste XML to query.");
      return;
    }
    if (!values.xpath.trim()) {
      setError("Enter an XPath expression.");
      return;
    }
    try {
      const out = await runHexkit<string>("xml.query", values);
      push(
        <ResultText
          title="XPath result"
          language="xml"
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "xml.query", params: { input: values.input } }}
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
            onAction={() => openInHexkitApp("xml.query", { input: seed }).catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="XML" placeholder="<root>…</root>" defaultValue={seed} error={error} onChange={() => error && setError(undefined)} />
      <Form.TextField id="xpath" title="XPath" placeholder="//user/@id" defaultValue="/" />
    </Form>
  );
}
