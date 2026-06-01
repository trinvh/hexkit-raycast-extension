import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="svg.to_css"
      formTitle="SVG"
      submitTitle="Convert"
      icon={Icon.Code}
      placeholder="<svg>…</svg>"
      resultTitle="CSS"
      resultLanguage="css"
    />
  );
}
