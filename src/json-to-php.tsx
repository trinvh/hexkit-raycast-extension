import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="php.from_json"
      formTitle="JSON"
      submitTitle="Convert"
      icon={Icon.Code}
      placeholder='{"name":"hexkit"}'
      resultTitle="PHP serialized"
    />
  );
}
