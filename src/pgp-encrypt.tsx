import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.encrypt"
      formTitle="Plaintext"
      submitTitle="Open in Hexkit"
      icon={Icon.Lock}
      placeholder="The message to encrypt…"
      rationale="PGP encryption needs an ASCII-armored public key block — Hexkit's two-pane form handles that better than a Raycast inline."
    />
  );
}
