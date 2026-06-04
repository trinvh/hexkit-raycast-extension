import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="aes.encrypt"
      formTitle="Text"
      submitTitle="Open in Hexkit"
      icon={Icon.Lock}
      placeholder="text to encrypt"
      rationale="AES-256-GCM encrypt/decrypt needs a password entered in the desktop app."
    />
  );
}
