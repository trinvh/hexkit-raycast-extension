import { Action, ActionPanel, Form, Icon, useNavigation, Detail } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";

const ALGORITHMS = ["md5", "sha1", "sha256", "sha384", "sha512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

interface HashResults {
  md5?: string;
  sha1?: string;
  sha256?: string;
  sha384?: string;
  sha512?: string;
}

export default function Command() {
  const { push } = useNavigation();
  // `null` while we're still reading the clipboard so the Form defers its
  // first render — Form.TextArea's `defaultValue` only honours the value
  // present on the initial mount.
  const [seed, setSeed] = useState<string | null>(null);

  useEffect(() => {
    void readSeedText().then(setSeed);
  }, []);

  async function submit(values: { input: string; algorithm: Algorithm }) {
    try {
      const raw = await runHexkit<HashResults>("hash.generate", {
        input: values.input,
      });
      const results = typeof raw === "string" ? ({} as HashResults) : raw;
      push(
        <HashResult
          input={values.input}
          algorithm={values.algorithm}
          results={results}
        />,
      );
    } catch (err) {
      await toastError(err);
    }
  }

  if (seed === null) {
    return <Form isLoading />;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Hash" onSubmit={submit} icon={Icon.Fingerprint} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("hash.generate", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title="Text"
        placeholder="Text to hash (or paste here)"
        defaultValue={seed}
      />
      <Form.Dropdown
        id="algorithm"
        title="Highlight algorithm"
        defaultValue="sha256"
      >
        {ALGORITHMS.map((a) => (
          <Form.Dropdown.Item key={a} value={a} title={a.toUpperCase()} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

function HashResult({
  input,
  algorithm,
  results,
}: {
  input: string;
  algorithm: Algorithm;
  results: HashResults;
}) {
  const featured = results[algorithm] ?? "";
  const markdown = renderMarkdown(input, algorithm, results);
  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          {featured && (
            <Action.CopyToClipboard
              title={`Copy ${algorithm.toUpperCase()}`}
              content={featured}
            />
          )}
          {ALGORITHMS.filter((a) => a !== algorithm && results[a]).map((a) => (
            <Action.CopyToClipboard
              key={a}
              title={`Copy ${a.toUpperCase()}`}
              content={results[a] ?? ""}
            />
          ))}
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("hash.generate", { input }).catch(toastError)}
          />
        </ActionPanel>
      }
    />
  );
}

function renderMarkdown(input: string, algorithm: Algorithm, results: HashResults): string {
  const featured = results[algorithm] ?? "(unavailable)";
  const others = ALGORITHMS.filter((a) => a !== algorithm)
    .map((a) => `- **${a.toUpperCase()}** — \`${results[a] ?? "(unavailable)"}\``)
    .join("\n");
  return [
    `## Hash of ${input.length} chars`,
    "",
    `### ${algorithm.toUpperCase()}`,
    "",
    "```",
    featured,
    "```",
    "",
    "### Other algorithms",
    "",
    others,
  ].join("\n");
}
