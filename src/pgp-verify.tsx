import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.verify"
      formTitle="Signed data"
      submitTitle="Open in Hexkit"
      icon={Icon.CheckCircle}
      placeholder="The exact data that was signed…"
      rationale="Verifying a detached signature needs both the signature block and the signer's public key — Hexkit's three-input form handles both."
    />
  );
}
