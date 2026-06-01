import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="markdown.to_html"
      formTitle="Markdown"
      submitTitle="Preview in Hexkit"
      icon={Icon.Document}
      placeholder="# Hello\n\nSome **markdown** text."
      rationale="Side-by-side rendered preview lives in the desktop app."
    />
  );
}
