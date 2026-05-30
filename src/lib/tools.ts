import { Icon } from "@raycast/api";

export type ToolKind =
  | "json"
  | "encode"
  | "convert"
  | "generate"
  | "inspect"
  | "text";

/**
 * Each tool maps to a `devtools_core` action id and tells the Raycast UI
 * whether it can render inline (text-in / text-out) or whether it needs the
 * desktop app for a richer view.
 *
 * IMPORTANT: action ids must match the runAction calls in `src/tools/**` of
 * the main repo, which is the source of truth. Drifting tools.ts will silently
 * deep-link the user to the wrong app and the CLI calls will return
 * "unknown action: …".
 */
export interface ToolEntry {
  /** Action id understood by the `hexkit` CLI and `hexkit://` deep links. */
  action: string;
  title: string;
  kind: ToolKind;
  /** When true, the tool can run inline in Raycast. */
  inline: boolean;
  /** Optional Raycast icon for the list row. */
  icon?: Icon;
  /** Optional keywords to improve search match. */
  keywords?: string[];
}

export const TOOL_CATALOG: ToolEntry[] = [
  // JSON & data
  { action: "json.format", title: "Format JSON", kind: "json", inline: true, icon: Icon.Code, keywords: ["pretty", "sort"] },
  { action: "json.minify", title: "Minify JSON", kind: "json", inline: true, icon: Icon.Code },
  { action: "json.query", title: "JSON Query (JSONPath)", kind: "json", inline: true, icon: Icon.MagnifyingGlass, keywords: ["jsonpath", "filter"] },
  { action: "yaml.to_json", title: "YAML → JSON", kind: "json", inline: true, icon: Icon.Switch },
  { action: "yaml.from_json", title: "JSON → YAML", kind: "json", inline: true, icon: Icon.Switch },
  { action: "csv.to_json", title: "CSV → JSON", kind: "json", inline: true, icon: Icon.AppWindowList },
  { action: "csv.from_json", title: "JSON → CSV", kind: "json", inline: true, icon: Icon.AppWindowList },
  { action: "php.to_json", title: "PHP serialized → JSON", kind: "json", inline: true, icon: Icon.Code },
  { action: "php.from_json", title: "JSON → PHP serialized", kind: "json", inline: true, icon: Icon.Code },
  { action: "sql.format", title: "Format SQL", kind: "json", inline: true, icon: Icon.Code },
  { action: "xml.beautify", title: "Beautify XML", kind: "json", inline: true, icon: Icon.Code },
  { action: "xml.minify", title: "Minify XML", kind: "json", inline: true, icon: Icon.Code },
  { action: "xml.query", title: "XML Query (XPath)", kind: "json", inline: true, icon: Icon.MagnifyingGlass },
  { action: "jsx.from_html", title: "HTML → JSX", kind: "json", inline: true, icon: Icon.Code },
  { action: "svg.to_css", title: "SVG → CSS", kind: "json", inline: true, icon: Icon.Code },

  // Encode / decode
  { action: "base64.encode", title: "Base64 Encode", kind: "encode", inline: true, icon: Icon.Lock },
  { action: "base64.decode", title: "Base64 Decode", kind: "encode", inline: true, icon: Icon.LockUnlocked },
  { action: "url.encode", title: "URL Encode", kind: "encode", inline: true, icon: Icon.Link },
  { action: "url.decode", title: "URL Decode", kind: "encode", inline: true, icon: Icon.Link },
  { action: "url.parse", title: "URL Parser", kind: "encode", inline: true, icon: Icon.Link },
  { action: "hex.encode", title: "Hex Encode", kind: "encode", inline: true, icon: Icon.Hashtag },
  { action: "hex.decode", title: "Hex Decode", kind: "encode", inline: true, icon: Icon.Hashtag },
  { action: "html.encode", title: "HTML Entity Encode", kind: "encode", inline: true, icon: Icon.Code },
  { action: "html.decode", title: "HTML Entity Decode", kind: "encode", inline: true, icon: Icon.Code },
  { action: "escape.escape", title: "Backslash Escape", kind: "encode", inline: true, icon: Icon.Code },
  { action: "escape.unescape", title: "Backslash Unescape", kind: "encode", inline: true, icon: Icon.Code },
  { action: "jwt.decode", title: "Decode JWT", kind: "encode", inline: true, icon: Icon.Key },
  { action: "jwt.verify", title: "Verify JWT", kind: "encode", inline: true, icon: Icon.Key },
  // TODO: inline view not yet implemented — falls back to the desktop app for now.
  { action: "luhn.check", title: "Luhn Checker", kind: "encode", inline: false, icon: Icon.Shield, keywords: ["credit card", "checksum", "mod10"] },
  // TODO: inline tree view not yet implemented — desktop deep-link only.
  { action: "tlv.decode", title: "TLV / EMV Decoder", kind: "encode", inline: false, icon: Icon.Code, keywords: ["ber-tlv", "emv", "chip"] },
  { action: "x509.decode", title: "X.509 Certificate Decoder", kind: "encode", inline: true, icon: Icon.Shield },

  // Convert
  { action: "number.all", title: "Number Base Converter", kind: "convert", inline: true, icon: Icon.Hashtag, keywords: ["binary", "hex", "octal"] },
  { action: "time.convert", title: "Unix Time Converter", kind: "convert", inline: true, icon: Icon.Clock },
  { action: "cron.parse", title: "Cron Parser", kind: "convert", inline: true, icon: Icon.Clock },
  { action: "case.convert", title: "Case Converter", kind: "convert", inline: true, icon: Icon.Text },
  { action: "color.convert", title: "Color Converter", kind: "convert", inline: true, icon: Icon.EyeDropper, keywords: ["hex", "rgb", "hsl"] },
  { action: "curl.to_code", title: "cURL → Code", kind: "convert", inline: true, icon: Icon.Terminal },
  { action: "jsoncode.generate", title: "JSON → Code (types)", kind: "convert", inline: true, icon: Icon.Code },

  // Generate
  { action: "id.generate", title: "UUID / ULID / Nano ID", kind: "generate", inline: true, icon: Icon.PlusCircle, keywords: ["uuid", "ulid", "nano id"] },
  { action: "id.inspect", title: "ID Inspector", kind: "generate", inline: true, icon: Icon.MagnifyingGlass },
  { action: "hash.generate", title: "Hash (MD5–SHA512)", kind: "generate", inline: true, icon: Icon.Fingerprint, keywords: ["md5", "sha1", "sha256"] },
  { action: "hash.hmac", title: "HMAC", kind: "generate", inline: true, icon: Icon.Fingerprint },
  { action: "random.generate", title: "Random String", kind: "generate", inline: true, icon: Icon.Shuffle },
  { action: "lorem.generate", title: "Lorem Ipsum", kind: "generate", inline: true, icon: Icon.Text, keywords: ["placeholder"] },
  // TODO: inline QR rendering not yet implemented — desktop deep-link only.
  { action: "qr.generate", title: "QR Code", kind: "generate", inline: false, icon: Icon.BarCode },
  // TODO: inline brand picker + result list not yet implemented — desktop deep-link only.
  { action: "card.generate", title: "Test Credit Card Numbers", kind: "generate", inline: false, icon: Icon.CreditCard, keywords: ["test card", "luhn", "visa", "mastercard", "amex"] },

  // Inspect / preview
  { action: "regexp.test", title: "RegExp Tester", kind: "inspect", inline: true, icon: Icon.MagnifyingGlass },
  { action: "regexp.replace", title: "RegExp Replace", kind: "inspect", inline: true, icon: Icon.MagnifyingGlass },
  { action: "markdown.to_html", title: "Markdown → HTML", kind: "inspect", inline: true, icon: Icon.Document },
  // TODO: inline QR image read not yet implemented — desktop deep-link only.
  { action: "qr.read", title: "QR Reader", kind: "inspect", inline: false, icon: Icon.BarCode },

  // Text
  // TODO: inline side-by-side diff view not yet implemented — desktop deep-link only.
  { action: "diff.compare", title: "Text Diff", kind: "text", inline: false, icon: Icon.Document },
  { action: "lines.process", title: "Line Sort / Dedupe", kind: "text", inline: true, icon: Icon.AppWindowList },
  { action: "string.inspect", title: "String Inspector", kind: "text", inline: true, icon: Icon.Text },
  { action: "css.beautify", title: "Beautify CSS / SCSS / Less", kind: "text", inline: true, icon: Icon.Code },
  { action: "css.minify", title: "Minify CSS", kind: "text", inline: true, icon: Icon.Code },
  { action: "htmlfmt.beautify", title: "Beautify HTML", kind: "text", inline: true, icon: Icon.Code },
  { action: "htmlfmt.minify", title: "Minify HTML", kind: "text", inline: true, icon: Icon.Code },
  { action: "js.minify", title: "Minify JavaScript", kind: "text", inline: true, icon: Icon.Code },
];

export const KIND_LABEL: Record<ToolKind, string> = {
  json: "JSON & data",
  encode: "Encode & decode",
  convert: "Convert",
  generate: "Generate",
  inspect: "Inspect & preview",
  text: "Text",
};
