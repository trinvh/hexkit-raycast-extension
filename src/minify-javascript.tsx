import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="js.minify"
      formTitle="JavaScript"
      submitTitle="Minify"
      icon={Icon.Code}
      placeholder="const x = 1; console.log(x);"
      resultTitle="Minified JavaScript"
      resultLanguage="javascript"
    />
  );
}
