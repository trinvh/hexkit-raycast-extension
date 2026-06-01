import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="yaml.to_json"
      formTitle="YAML"
      submitTitle="Convert"
      icon={Icon.Switch}
      placeholder="name: hexkit\nversion: 1"
      resultTitle="JSON"
      resultLanguage="json"
    />
  );
}
