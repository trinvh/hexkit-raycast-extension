import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="php.to_json"
      formTitle="PHP serialized"
      submitTitle="Convert"
      icon={Icon.Code}
      placeholder='a:1:{s:4:"name";s:6:"hexkit";}'
      resultTitle="JSON"
      resultLanguage="json"
    />
  );
}
