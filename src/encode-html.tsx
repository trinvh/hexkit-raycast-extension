import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="html.encode"
      formTitle="Text"
      submitTitle="Encode"
      icon={Icon.Code}
      placeholder="Text to encode as HTML entities"
      resultTitle="HTML Entities"
    />
  );
}
