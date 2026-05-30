import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useMemo } from "react";
import { openInHexkitApp, toastError } from "./lib/hexkit";
import { KIND_LABEL, TOOL_CATALOG, type ToolEntry } from "./lib/tools";
import { readSeedText } from "./lib/seed";

export default function Command() {
  const sections = useMemo(() => groupByKind(TOOL_CATALOG), []);

  return (
    <List searchBarPlaceholder="Search Hexkit tools…">
      {sections.map(({ kind, items }) => (
        <List.Section key={kind} title={KIND_LABEL[kind]}>
          {items.map((tool) => (
            <ToolRow key={tool.action} tool={tool} />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

function ToolRow({ tool }: { tool: ToolEntry }) {
  return (
    <List.Item
      title={tool.title}
      subtitle={tool.action}
      keywords={tool.keywords}
      icon={tool.icon ?? Icon.Hammer}
      accessories={[
        tool.inline
          ? { tag: { value: "Inline", color: "#ef6c45" } }
          : { tag: "Desktop" },
      ]}
      actions={
        <ActionPanel>
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            onAction={() => openInHexkitApp(tool.action).catch(toastError)}
          />
          <Action
            title="Open with Selection or Clipboard"
            icon={Icon.Clipboard}
            shortcut={{ modifiers: ["cmd"], key: "v" }}
            onAction={async () => {
              try {
                const seed = await readSeedText();
                await openInHexkitApp(
                  tool.action,
                  seed ? { input: seed } : {},
                );
              } catch (err) {
                await toastError(err);
              }
            }}
          />
          <Action.CopyToClipboard
            title="Copy Action ID"
            content={tool.action}
            shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
          />
          <Action.CopyToClipboard
            title="Copy Deep Link"
            content={`hexkit://${tool.action}`}
            shortcut={{ modifiers: ["cmd", "shift"], key: "l" }}
          />
        </ActionPanel>
      }
    />
  );
}

function groupByKind(catalog: ToolEntry[]) {
  const order: ToolEntry["kind"][] = [
    "json",
    "encode",
    "convert",
    "generate",
    "inspect",
    "text",
  ];
  return order.map((kind) => ({
    kind,
    items: catalog.filter((t) => t.kind === kind),
  }));
}
