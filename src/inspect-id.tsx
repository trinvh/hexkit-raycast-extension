import { Icon } from "@raycast/api";

import { MultiTransform } from "./lib/transformers";

interface Inspection {
  kind: string;
  version: string;
  variant: string;
  canonical: string;
  raw: string;
  detail: string;
}

// id.inspect uses `value` not `input` — the helper sends both, the dispatcher
// just picks the one it knows. (Override via a tiny wrapper instead of
// invasively changing the helper.)
export default function Command() {
  return (
    <MultiTransform<Inspection>
      action="id.inspect"
      formTitle="ID"
      submitTitle="Inspect"
      icon={Icon.MagnifyingGlass}
      placeholder="UUID, ULID, Nano ID…"
      resultTitle={(d) => `${d.kind} ${d.version}`.trim()}
      fieldKind="textfield"
      trimSeed
      rowsFrom={(d) => [
        { label: "Kind", value: d.kind },
        { label: "Version", value: d.version || "—" },
        { label: "Variant", value: d.variant || "—" },
        { label: "Canonical", value: d.canonical },
        { label: "Raw", value: d.raw },
        { label: "Detail", value: d.detail || "—" },
      ]}
    />
  );
}