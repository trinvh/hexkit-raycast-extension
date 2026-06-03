import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

// Visual/networked tool: the request builder, the actual send, and the response
// viewer all live in the desktop app. From Raycast we paste a curl command and
// deep-link into the HTTP Client with it imported (action `httpreq.from_curl`
// routes to the http-client tool and seeds the input).
export default function Command() {
  return (
    <DeepLinkOnly
      action="httpreq.from_curl"
      formTitle="cURL command"
      submitTitle="Open in Hexkit"
      icon={Icon.Globe}
      placeholder="curl -X POST https://api.example.com -d '{...}'"
      rationale="Editing headers/body, sending the request, and inspecting the response live in the desktop app — this opens it with your curl imported."
    />
  );
}
