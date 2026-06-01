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
    void readSeedText().then((t) => setSeed(t.trim()));
  }, []);

  async function submit(values: { input: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter a URL or percent-encoded string to decode.");
      return;
    }
    try {
      const out = await runHexkit<string>("url.decode", { input: values.input });
      push(
        <ResultText
          title="Decoded"
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action: "url.decode", params: { input: values.input } }}
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
          <Action.SubmitForm title="Decode" icon={Icon.Link} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("url.decode", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title="Percent-encoded text"
        placeholder="https://example.com/?q=hello%20world"
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
    </Form>
  );
}
