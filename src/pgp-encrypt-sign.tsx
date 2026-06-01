import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.encrypt_sign"
      formTitle="Plaintext"
      submitTitle="Open in Hexkit"
      icon={Icon.Lock}
      placeholder="The message to encrypt and sign…"
      rationale="Encrypt + sign needs three key blocks (recipient public, sender private, passphrase) — Hexkit's form is the right surface."
    />
  );
}
