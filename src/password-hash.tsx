import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="pwhash.hash"
      formTitle="Password"
      submitTitle="Open in Hexkit"
      icon={Icon.Key}
      placeholder="password to hash"
      rationale="bcrypt/Argon2 hashing + verify (with algorithm and cost options) lives in the desktop app."
    />
  );
}
