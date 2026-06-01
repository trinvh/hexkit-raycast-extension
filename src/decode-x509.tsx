import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="x509.decode"
      formTitle="Certificate (PEM)"
      submitTitle="Open in Hexkit"
      icon={Icon.Shield}
      placeholder="-----BEGIN CERTIFICATE-----…"
      rationale="X.509 has nested issuer / subject / extensions that render better in the desktop tool."
    />
  );
}
