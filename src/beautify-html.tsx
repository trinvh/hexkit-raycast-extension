import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="htmlfmt.beautify"
      formTitle="HTML"
      submitTitle="Beautify"
      icon={Icon.Code}
      placeholder="<div><span>hi</span></div>"
      resultTitle="Beautified HTML"
      resultLanguage="html"
    />
  );
}
