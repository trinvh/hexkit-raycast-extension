import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pgp.sign"
      formTitle="Data to sign"
      submitTitle="Open in Hexkit"
      icon={Icon.Pencil}
      placeholder="The document or message to sign…"
      rationale="Signing needs an ASCII-armored private key — Hexkit's form makes that paste-and-go."
    />
  );
}
