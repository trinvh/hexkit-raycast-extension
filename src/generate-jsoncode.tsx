import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="jsoncode.generate"
      formTitle="JSON sample"
      submitTitle="Generate types in Hexkit"
      icon={Icon.Code}
      placeholder='{"id":1,"name":"Alice"}'
      rationale="Target language + type style picker live in the desktop app."
    />
  );
}
