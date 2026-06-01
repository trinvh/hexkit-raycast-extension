import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.decrypt"
      formTitle="Ciphertext (PGP message)"
      submitTitle="Open in Hexkit"
      icon={Icon.Lock}
      placeholder="-----BEGIN PGP MESSAGE-----"
      rationale="Decrypting a PGP message needs your private key (and optional passphrase) — Hexkit's form is the right surface."
    />
  );
}
