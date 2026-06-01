import { Action, ActionPanel, Detail, Icon } from "@raycast/api";
import { openInHexkitApp, toastError } from "./hexkit";

export interface ResultRow {
  label: string;
  value: string;
}

interface DeepLinkRef {
  action: string;
  /**
   * Every field to prefill on the desktop. Convention: include `input` for
   * the primary value plus any other Form field the user touched, so an
   * Open-in-Hexkit re-creates the same UI state in the desktop tool.
   */
  params: Record<string, unknown>;
}

/** Detail with a single fenced block + Copy + Open in Hexkit. */
export function ResultText({
  title,
  language,
  output,
  deepLink,
}: {
  title: string;
  language?: string;
  output: string;
  deepLink: DeepLinkRef;
}) {
  const fence = language ?? "";
  return (
    <Detail
      markdown={`## ${title}\n\n\`\`\`${fence}\n${output}\n\`\`\``}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy" content={output} />
          <OpenInHexkitAction action={deepLink.action} params={deepLink.params} />
        </ActionPanel>
      }
    />
  );
}

/** Detail with a list of labelled values, each independently copyable. */
export function ResultMulti({
  title,
  rows,
  deepLink,
  extra,
}: {
  title: string;
  rows: ResultRow[];
  deepLink: DeepLinkRef;
  /** Optional markdown appended after the row blocks (e.g. cron next-runs). */
  extra?: string;
}) {
  const blocks = rows.flatMap((r) => [
    `**${r.label}**`,
    "",
    "```",
    r.value,
    "```",
    "",
  ]);
  const markdown = [`## ${title}`, "", ...blocks, extra ?? ""].join("\n");
  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          {rows.map((r) => (
            <Action.CopyToClipboard
              key={r.label}
              title={`Copy ${r.label}`}
              content={r.value}
            />
          ))}
          <OpenInHexkitAction action={deepLink.action} params={deepLink.params} />
        </ActionPanel>
      }
    />
  );
}

/** Standard ⌘O action used at the bottom of every result Detail. */
export function OpenInHexkitAction({
  action,
  params,
}: {
  action: string;
  params: Record<string, unknown>;
}) {
  return (
    <Action
      title="Open in Hexkit"
      icon={Icon.AppWindow}
      shortcut={{ modifiers: ["cmd"], key: "o" }}
      onAction={async () => {
        try {
          await openInHexkitApp(action, params);
        } catch (err) {
          await toastError(err);
        }
      }}
    />
  );
}
