import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="toml.to_json"
      formTitle="TOML"
      submitTitle="Open in Hexkit"
      icon={Icon.Code}
      placeholder={'name = "hexkit"'}
      rationale="The TOML ↔ JSON / YAML direction picker lives in the desktop app."
    />
  );
}
