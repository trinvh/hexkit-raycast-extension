import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="xml.beautify"
      formTitle="XML"
      submitTitle="Beautify"
      icon={Icon.Code}
      placeholder="<root><a/></root>"
      resultTitle="Beautified XML"
      resultLanguage="xml"
    />
  );
}
