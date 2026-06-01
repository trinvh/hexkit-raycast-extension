import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="qr.generate"
      formTitle="Payload"
      submitTitle="Generate in Hexkit"
      icon={Icon.BarCode}
      placeholder="https://hexkit.app"
      rationale="Hexkit renders the QR as SVG — opens the desktop app with this payload prefilled."
      fieldKind="textfield"
      trimSeed
    />
  );
}
