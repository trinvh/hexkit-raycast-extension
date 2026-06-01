import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="hex.decode"
      formTitle="Hex"
      submitTitle="Decode"
      icon={Icon.Hashtag}
      placeholder="48656c6c6f"
      resultTitle="Decoded"
      trimSeed
    />
  );
}
