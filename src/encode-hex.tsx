import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="hex.encode"
      formTitle="Text"
      submitTitle="Encode"
      icon={Icon.Hashtag}
      placeholder="Text to hex-encode"
      resultTitle="Hex"
    />
  );
}
