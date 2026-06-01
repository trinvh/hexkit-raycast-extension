import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="csv.from_json"
      formTitle="JSON"
      submitTitle="Convert"
      icon={Icon.AppWindowList}
      placeholder='[{"id":1,"name":"Alice"}]'
      resultTitle="CSV"
    />
  );
}
