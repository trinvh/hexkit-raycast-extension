import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="markdown.to_html"
      formTitle="Markdown"
      submitTitle="Render"
      icon={Icon.Document}
      placeholder="# Hello"
      resultTitle="HTML"
      resultLanguage="html"
    />
  );
}
