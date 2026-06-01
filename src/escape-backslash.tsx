import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="escape.escape"
      formTitle="Text"
      submitTitle="Escape"
      icon={Icon.Code}
      placeholder='e.g. "tab\there"'
      resultTitle="Escaped"
    />
  );
}
