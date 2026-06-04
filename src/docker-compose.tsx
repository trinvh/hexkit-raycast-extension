import { Icon } from "@raycast/api";
import { DeepLinkOnly } from "./lib/transformers";

export default function Command() {
  return (
    <DeepLinkOnly
      action="dockerc.to_compose"
      formTitle="docker run command"
      submitTitle="Open in Hexkit"
      icon={Icon.Box}
      placeholder="docker run -d --name web -p 8080:80 nginx:latest"
      rationale="The docker run → docker-compose converter lives in the desktop app."
    />
  );
}
