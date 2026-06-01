import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="escape.unescape"
      formTitle="Escaped text"
      submitTitle="Unescape"
      icon={Icon.Code}
      placeholder="Backslash-escaped text"
      resultTitle="Unescaped"
    />
  );
}
