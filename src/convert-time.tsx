import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultMulti } from "./lib/result";

interface TimeInfo {
  epoch_seconds: string;
  epoch_millis: string;
  iso8601: string;
  utc: string;
  local: string;
  day_of_week: string;
  relative: string;
  day_of_year: string;
  week_of_year: string;
  is_leap_year: boolean;
  rfc2822: string;
}

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then((t) => setSeed(t.trim()));
  }, []);

  async function submit(values: { input: string; unit: string }) {
    setError(undefined);
    const input = values.input.trim() || "now";
    try {
      const raw = await runHexkit<TimeInfo>("time.convert", {
        input,
        unit: values.unit,
      });
      if (typeof raw === "string") {
        setError(`Couldn't parse time.convert output: ${raw.slice(0, 200)}`);
        return;
      }
      push(
        <ResultMulti
          title="Unix Time"
          rows={[
            { label: "Epoch (seconds)", value: raw.epoch_seconds },
            { label: "Epoch (millis)", value: raw.epoch_millis },
            { label: "ISO 8601", value: raw.iso8601 },
            { label: "RFC 2822", value: raw.rfc2822 },
            { label: "UTC", value: raw.utc },
            { label: "Local", value: raw.local },
            { label: "Day of week", value: raw.day_of_week },
            { label: "Day of year", value: raw.day_of_year },
            { label: "Week of year", value: raw.week_of_year },
            { label: "Leap year", value: String(raw.is_leap_year) },
            { label: "Relative", value: raw.relative },
          ]}
          deepLink={{ action: "time.convert", params: { input, unit: values.unit } }}
        />,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (seed === null) return <Form isLoading />;

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Convert" icon={Icon.Clock} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("time.convert", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="input"
        title="Timestamp or date"
        placeholder="e.g. 1700000000 / now / 2026-05-30T12:00:00Z"
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
      <Form.Dropdown id="unit" title="Numeric unit" defaultValue="auto">
        <Form.Dropdown.Item value="auto" title="Auto-detect" />
        <Form.Dropdown.Item value="s" title="Seconds" />
        <Form.Dropdown.Item value="ms" title="Milliseconds" />
        <Form.Dropdown.Item value="us" title="Microseconds" />
        <Form.Dropdown.Item value="ns" title="Nanoseconds" />
      </Form.Dropdown>
    </Form>
  );
}
