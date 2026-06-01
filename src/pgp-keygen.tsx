import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.keygen"
      formTitle="User ID"
      submitTitle="Open in Hexkit"
      icon={Icon.Key}
      placeholder="Alice <alice@example.com>"
      fieldKind="textfield"
      paramKey="user_id"
      rationale="Generate an Ed25519 + Curve25519 keypair in Hexkit, with optional passphrase and copy-to-clipboard for both blocks."
    />
  );
}
