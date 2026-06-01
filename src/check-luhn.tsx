import { Icon } from "@raycast/api";

import { MultiTransform } from "./lib/transformers";

interface LuhnReport {
  digits: string;
  valid: boolean;
  checksum_mod_10: number;
  expected_check_digit: number;
  provided_check_digit: number;
  corrected: string;
}

export default function Command() {
  return (
    <MultiTransform<LuhnReport>
      action="luhn.check"
      formTitle="Number"
      submitTitle="Check"
      icon={Icon.Shield}
      placeholder="4111 1111 1111 1111"
      resultTitle={(d) => (d.valid ? "Valid (Luhn)" : "Invalid (Luhn)")}
      fieldKind="textfield"
      trimSeed
      rowsFrom={(d) => [
        { label: "Status", value: d.valid ? "Valid" : "Invalid" },
        { label: "Digits", value: d.digits },
        { label: "Expected check", value: String(d.expected_check_digit) },
        { label: "Provided check", value: String(d.provided_check_digit) },
        { label: d.valid ? "Number" : "Corrected", value: d.corrected },
        { label: "Checksum mod 10", value: String(d.checksum_mod_10) },
      ]}
    />
  );
}