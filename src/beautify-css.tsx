import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="css.beautify"
      formTitle="CSS / SCSS / Less"
      submitTitle="Beautify"
      icon={Icon.Code}
      placeholder=".a{color:red;}"
      resultTitle="Beautified CSS"
      resultLanguage="css"
    />
  );
}
