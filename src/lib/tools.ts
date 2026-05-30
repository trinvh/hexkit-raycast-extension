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
  { action: "json.query", title: "JSON Query (JSONPath)", kind: "json", inline: true, icon: Icon.MagnifyingGlass, keywords: ["jsonpath", "filter"] },
  { action: "yaml.convert", title: "YAML ↔ JSON", kind: "json", inline: true, icon: Icon.Switch },
  { action: "csv.convert", title: "CSV ↔ JSON", kind: "json", inline: true, icon: Icon.AppWindowList },
  { action: "sql.format", title: "Format SQL", kind: "json", inline: true, icon: Icon.Code },
  { action: "xml.format", title: "Format XML", kind: "json", inline: true, icon: Icon.Code },
  { action: "xml.query", title: "XML Query (XPath)", kind: "json", inline: true, icon: Icon.MagnifyingGlass },
  { action: "html.to_jsx", title: "HTML → JSX", kind: "json", inline: true, icon: Icon.Code },

  // Encode / decode
  { action: "base64.encode", title: "Base64 Encode", kind: "encode", inline: true, icon: Icon.Lock },
  { action: "base64.decode", title: "Base64 Decode", kind: "encode", inline: true, icon: Icon.LockUnlocked },
  { action: "url.encode", title: "URL Encode", kind: "encode", inline: true, icon: Icon.Link },
  { action: "url.decode", title: "URL Decode", kind: "encode", inline: true, icon: Icon.Link },
  { action: "html.entities", title: "HTML Entities", kind: "encode", inline: true, icon: Icon.Code },
  { action: "backslash.escape", title: "Backslash Escape", kind: "encode", inline: true, icon: Icon.Code },
  { action: "jwt.decode", title: "Decode JWT", kind: "encode", inline: true, icon: Icon.Key },
  { action: "base64.image", title: "Base64 Image", kind: "encode", inline: false, icon: Icon.Image },
  // TODO: inline view not yet implemented — falls back to the desktop app for now.
  { action: "luhn.check", title: "Luhn Checker", kind: "encode", inline: false, icon: Icon.Shield, keywords: ["credit card", "checksum", "mod10"] },
  // TODO: inline tree view not yet implemented — desktop deep-link only.
  { action: "tlv.decode", title: "TLV / EMV Decoder", kind: "encode", inline: false, icon: Icon.Code, keywords: ["ber-tlv", "emv", "chip"] },

  // Convert
  { action: "number.all", title: "Number Base Converter", kind: "convert", inline: true, icon: Icon.Hashtag, keywords: ["binary", "hex", "octal"] },
  { action: "unixtime.convert", title: "Unix Time Converter", kind: "convert", inline: true, icon: Icon.Clock },
  { action: "cron.describe", title: "Cron Parser", kind: "convert", inline: true, icon: Icon.Clock },
  { action: "case.convert", title: "Case Converter", kind: "convert", inline: true, icon: Icon.Text },
  { action: "color.convert", title: "Color Converter", kind: "convert", inline: false, icon: Icon.EyeDropper },
  { action: "curl.to_code", title: "cURL → Code", kind: "convert", inline: true, icon: Icon.Terminal },

  // Generate
  { action: "uuid.generate", title: "UUID / ULID Generator", kind: "generate", inline: true, icon: Icon.PlusCircle },
  { action: "hash.generate", title: "Hash (MD5–SHA512)", kind: "generate", inline: true, icon: Icon.Fingerprint, keywords: ["md5", "sha1", "sha256"] },
  { action: "hash.hmac", title: "HMAC", kind: "generate", inline: true, icon: Icon.Fingerprint },
  { action: "lipsum.generate", title: "Lorem Ipsum", kind: "generate", inline: true, icon: Icon.Text, keywords: ["placeholder"] },
  { action: "qr.encode", title: "QR Code", kind: "generate", inline: false, icon: Icon.BarCode },
  { action: "x509.generate", title: "X.509 Certificate", kind: "generate", inline: false, icon: Icon.Shield },
  // TODO: inline brand picker + result list not yet implemented — desktop deep-link only.
  { action: "card.generate", title: "Test Credit Card Numbers", kind: "generate", inline: false, icon: Icon.CreditCard, keywords: ["test card", "luhn", "visa", "mastercard", "amex"] },

  // Inspect / preview
  { action: "regexp.test", title: "RegExp Tester", kind: "inspect", inline: true, icon: Icon.MagnifyingGlass },
  { action: "markdown.preview", title: "Markdown Preview", kind: "inspect", inline: false, icon: Icon.Document },
  { action: "html.preview", title: "HTML Preview", kind: "inspect", inline: false, icon: Icon.AppWindow },
  { action: "x509.inspect", title: "X.509 Inspector", kind: "inspect", inline: false, icon: Icon.Shield },
  { action: "qr.decode", title: "QR Reader", kind: "inspect", inline: false, icon: Icon.BarCode },

  // Text
  { action: "diff.text", title: "Text Diff", kind: "text", inline: false, icon: Icon.Document },
  { action: "string.inspect", title: "String Inspector", kind: "text", inline: true, icon: Icon.Text },
  { action: "css.beautify", title: "CSS / SCSS / Less Beautify", kind: "text", inline: true, icon: Icon.Code },
  { action: "html.beautify", title: "HTML Beautify", kind: "text", inline: true, icon: Icon.Code },
  { action: "js.minify", title: "JS Minify", kind: "text", inline: true, icon: Icon.Code },
];

export const KIND_LABEL: Record<ToolKind, string> = {
  json: "JSON & data",
  encode: "Encode & decode",
  convert: "Convert",
  generate: "Generate",
  inspect: "Inspect & preview",
  text: "Text",
};
