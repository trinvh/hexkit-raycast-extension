import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="htmlmd.convert"
      formTitle="HTML"
      submitTitle="Open in Hexkit"
      icon={Icon.Text}
      placeholder="<h1>Hello</h1>"
      rationale="HTML → Markdown conversion lives in the desktop app."
    />
  );
}
