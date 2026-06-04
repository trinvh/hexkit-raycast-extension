import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="totp.generate"
      formTitle="Base32 secret"
      submitTitle="Open in Hexkit"
      icon={Icon.Clock}
      placeholder="JBSWY3DPEHPK3PXP"
      rationale="The live TOTP code, countdown and otpauth QR live in the desktop app."
      fieldKind="textfield"
      trimSeed
    />
  );
}
