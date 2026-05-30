import { Clipboard, getSelectedText } from "@raycast/api";

/**
 * Read seed text the user most likely wants to act on: their current Raycast
 * text selection first, falling back to the clipboard. Returns an empty string
 * if neither is available.
 */
export async function readSeedText(): Promise<string> {
  try {
    const selected = await getSelectedText();
    if (selected && selected.trim().length > 0) return selected;
  } catch {
    // No selection available — fall through to clipboard.
  }
  try {
    const clip = await Clipboard.readText();
    return clip ?? "";
  } catch {
    return "";
  }
}
