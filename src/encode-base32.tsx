import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="base32.encode"
      formTitle="Text"
      submitTitle="Open in Hexkit"
      icon={Icon.Text}
      placeholder="hello"
      rationale="Base32 encode/decode with a mode toggle lives in the desktop app."
    />
  );
}
