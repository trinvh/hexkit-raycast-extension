import { Icon } from "@raycast/api";
import { TextTransform } from "./lib/transformers";

export default function Command() {
  return (
    <TextTransform
      action="sql.format"
      formTitle="SQL"
      submitTitle="Format"
      icon={Icon.Code}
      placeholder="SELECT * FROM users WHERE active = true;"
      resultTitle="Formatted SQL"
      resultLanguage="sql"
    />
  );
}
