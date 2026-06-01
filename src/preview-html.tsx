import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="htmlfmt.beautify"
      formTitle="HTML"
      submitTitle="Preview in Hexkit"
      icon={Icon.AppWindow}
      placeholder="<div>Hello</div>"
      rationale="Hexkit renders the HTML inside a sandboxed iframe alongside the source."
    />
  );
}
