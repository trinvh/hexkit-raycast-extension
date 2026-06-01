import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="qr.read"
      formTitle="QR (base64 image)"
      submitTitle="Open in Hexkit"
      icon={Icon.BarCode}
      placeholder="Hexkit reads QR images you drag in — opens the desktop tool."
      rationale="QR decoding needs an image input that the desktop picker handles. Submit jumps straight to that tool."
    />
  );
}
