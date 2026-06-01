import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="curl.to_code"
      formTitle="cURL command"
      submitTitle="Convert in Hexkit"
      icon={Icon.Terminal}
      placeholder="curl -X POST https://api.example.com -d '{...}'"
      rationale="Target language picker + syntax-highlighted output live in the desktop app."
    />
  );
}
