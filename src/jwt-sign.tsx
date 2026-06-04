import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="jwt.sign"
      formTitle="Payload (JSON)"
      submitTitle="Open in Hexkit"
      icon={Icon.Key}
      placeholder={'{"sub":"123","name":"Alice"}'}
      rationale="Signing needs a secret and algorithm picker, which live in the desktop app."
    />
  );
}
