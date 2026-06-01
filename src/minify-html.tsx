import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="htmlfmt.minify"
      formTitle="HTML"
      submitTitle="Minify"
      icon={Icon.Code}
      placeholder="Pretty-printed HTML"
      resultTitle="Minified HTML"
      resultLanguage="html"
    />
  );
}
