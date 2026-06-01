import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="json.minify"
      formTitle="JSON"
      submitTitle="Minify"
      icon={Icon.Code}
      placeholder="Pretty-printed JSON"
      resultTitle="Minified JSON"
      resultLanguage="json"
    />
  );
}
