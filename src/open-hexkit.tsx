import { showHUD } from "@raycast/api";
import { openInHexkitApp, toastError } from "./lib/hexkit";

export default async function Command() {
  try {
    await openInHexkitApp("app.open");
    await showHUD("Opened Hexkit");
  } catch (err) {
    await toastError(err);
  }
}
