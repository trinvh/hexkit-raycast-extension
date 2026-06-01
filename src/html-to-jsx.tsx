import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="jsx.from_html"
      formTitle="HTML"
      submitTitle="Convert"
      icon={Icon.Code}
      placeholder='<div class="card">Hello</div>'
      resultTitle="JSX"
      resultLanguage="jsx"
    />
  );
}
