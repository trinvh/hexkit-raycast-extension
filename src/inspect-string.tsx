import { Icon } from "@raycast/api";
import { MultiTransform } from "./lib/transformers";

interface StringInfo {
  characters: number;
  bytes: number;
  words: number;
  lines: number;
  [key: string]: unknown;
}

export default function Command() {
  return (
    <MultiTransform<StringInfo>
      action="string.inspect"
      formTitle="Text"
      submitTitle="Inspect"
      icon={Icon.Text}
      placeholder="String to inspect"
      resultTitle="String stats"
      rowsFrom={(d) =>
        Object.entries(d).map(([k, v]) => ({
          label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value: String(v),
        }))
      }
    />
  );
}
