import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.decrypt_verify"
      formTitle="Inline-signed ciphertext"
      submitTitle="Open in Hexkit"
      icon={Icon.Lock}
      placeholder="-----BEGIN PGP MESSAGE-----"
      rationale="Decrypt + verify needs the recipient's private key and the sender's public key — Hexkit's form handles both, plus the verification badge."
    />
  );
}
