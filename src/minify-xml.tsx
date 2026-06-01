import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="xml.minify"
      formTitle="XML"
      submitTitle="Minify"
      icon={Icon.Code}
      placeholder="Pretty-printed XML"
      resultTitle="Minified XML"
      resultLanguage="xml"
    />
  );
}
