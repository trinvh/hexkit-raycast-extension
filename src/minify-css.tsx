import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="css.minify"
      formTitle="CSS"
      submitTitle="Minify"
      icon={Icon.Code}
      placeholder="Pretty-printed CSS"
      resultTitle="Minified CSS"
      resultLanguage="css"
    />
  );
}
