import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="csv.to_json"
      formTitle="CSV"
      submitTitle="Convert"
      icon={Icon.AppWindowList}
      placeholder="id,name\n1,Alice"
      resultTitle="JSON"
      resultLanguage="json"
    />
  );
}
