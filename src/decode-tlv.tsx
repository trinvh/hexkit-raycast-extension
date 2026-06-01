import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="tlv.decode"
      formTitle="TLV hex"
      submitTitle="Open in Hexkit"
      icon={Icon.Code}
      placeholder="6F34840E315041592E5359532E4444463031…"
      rationale="BER-TLV is a nested tree — Hexkit's collapsible tree view renders it best."
    />
  );
}
