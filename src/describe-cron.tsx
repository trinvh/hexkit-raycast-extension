import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultMulti } from "./lib/result";

interface CronInfo {
  description: string;
  minutes: string;
  hours: string;
  day_of_month: string;
  months: string;
  day_of_week: string;
  next_runs: string[];
}

export default function Command() {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then((t) => setSeed(t.trim()));
  }, []);

  async function submit(values: { input: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter a cron expression (e.g. */5 * * * *).");
      return;
    }
    try {
      const raw = await runHexkit<CronInfo>("cron.parse", { input: values.input });
      if (typeof raw === "string") {
        setError(`Couldn't parse cron.parse output: ${raw.slice(0, 200)}`);
        return;
      }
      const nextRuns = raw.next_runs.length
        ? ["**Next runs**", "", ...raw.next_runs.map((r) => `- \`${r}\``)].join("\n")
        : "";
      push(
        <ResultMulti
          title={raw.description}
          rows={[
            { label: "Minutes", value: raw.minutes },
            { label: "Hours", value: raw.hours },
            { label: "Day of month", value: raw.day_of_month },
            { label: "Months", value: raw.months },
            { label: "Day of week", value: raw.day_of_week },
          ]}
          extra={nextRuns}
          deepLink={{ action: "cron.parse", params: { input: values.input } }}
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
          <Action.SubmitForm title="Describe" icon={Icon.Clock} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("cron.parse", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="input"
        title="Cron expression"
        placeholder="*/5 * * * *"
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
    </Form>
  );
}
