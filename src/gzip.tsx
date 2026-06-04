import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="gzip.compress"
      formTitle="Text"
      submitTitle="Open in Hexkit"
      icon={Icon.Box}
      placeholder="text to gzip"
      rationale="Gzip compress/decompress (text ↔ Base64) lives in the desktop app."
    />
  );
}
