import { Icon } from "@raycast/api";

import { MultiTransform } from "./lib/transformers";

interface ParsedUrl {
  scheme: string;
  username: string;
  password: string;
  host: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
  query_params: { key: string; value: string }[];
}

export default function Command() {
  return (
    <MultiTransform<ParsedUrl>
      action="url.parse"
      formTitle="URL"
      submitTitle="Parse"
      icon={Icon.Link}
      placeholder="https://user:pw@example.com:8443/path?a=1#frag"
      resultTitle="URL components"
      fieldKind="textfield"
      trimSeed
      rowsFrom={(d) => {
        const rows = [
          { label: "Scheme", value: d.scheme },
          { label: "Host", value: d.host },
          { label: "Port", value: d.port },
          { label: "Path", value: d.path },
          { label: "Query", value: d.query },
          { label: "Fragment", value: d.fragment },
        ];
        if (d.username) rows.splice(1, 0, { label: "Username", value: d.username });
        if (d.password) rows.splice(2, 0, { label: "Password", value: d.password });
        for (const p of d.query_params) {
          rows.push({ label: `? ${p.key}`, value: p.value });
        }
        return rows;
      }}
    />
  );
}