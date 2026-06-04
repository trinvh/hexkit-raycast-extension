import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="cidr.parse"
      formTitle="CIDR block"
      submitTitle="Open in Hexkit"
      icon={Icon.Network}
      placeholder="192.168.1.0/24"
      rationale="The CIDR / subnet breakdown view lives in the desktop app."
      fieldKind="textfield"
      trimSeed
    />
  );
}
