import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="chmod.describe"
      formTitle="Permission (octal or symbolic)"
      submitTitle="Open in Hexkit"
      icon={Icon.Lock}
      placeholder="755 or rwxr-xr-x"
      rationale="The chmod calculator's breakdown view lives in the desktop app."
      fieldKind="textfield"
      trimSeed
    />
  );
}
