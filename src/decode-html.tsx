import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="html.decode"
      formTitle="HTML"
      submitTitle="Decode"
      icon={Icon.Code}
      placeholder="HTML-entity-encoded text"
      resultTitle="Decoded"
    />
  );
}
