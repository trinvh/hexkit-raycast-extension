import { Clipboard, showHUD } from "@raycast/api";
import { runHexkit, toastError } from "./lib/hexkit";

interface GenerateResult {
  values?: string[];
}

export default async function Command() {
  try {
    const raw = await runHexkit<GenerateResult>("uuid.generate", {
      kind: "uuid_v4",
      count: 1,
    });

    const value =
      typeof raw === "string"
        ? raw.trim()
        : (raw?.values?.[0] ?? "");

    if (!value) {
      await toastError(new Error("Hexkit returned no UUID"));
      return;
    }

    await Clipboard.copy(value);
    await showHUD(`✓ Copied ${value}`);
  } catch (err) {
    await toastError(err);
  }
}
