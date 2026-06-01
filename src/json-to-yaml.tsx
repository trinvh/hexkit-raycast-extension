import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="yaml.from_json"
      formTitle="JSON"
      submitTitle="Convert"
      icon={Icon.Switch}
      placeholder='{"name":"hexkit"}'
      resultTitle="YAML"
      resultLanguage="yaml"
    />
  );
}
