import { Action, ActionPanel, Form, Icon, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";
import { readSeedText } from "./lib/seed";
import { ResultMulti } from "./lib/result";

interface ColorOut {
  hex: string;
  hex8: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  hsb: string;
  hwb: string;
  cmyk: string;
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
      setError("Enter a color (#hex, rgb(), hsl(), name…).");
      return;
    }
    try {
      const raw = await runHexkit<ColorOut>("color.convert", { input: values.input });
      if (typeof raw === "string") {
        setError(`Couldn't parse color.convert output: ${raw.slice(0, 200)}`);
        return;
      }
      push(
        <ResultMulti
          title="Color"
          rows={[
            { label: "HEX", value: raw.hex },
            { label: "HEX + alpha", value: raw.hex8 },
            { label: "RGB", value: raw.rgb },
            { label: "RGBA", value: raw.rgba },
            { label: "HSL", value: raw.hsl },
            { label: "HSLA", value: raw.hsla },
            { label: "HSB", value: raw.hsb },
            { label: "HWB", value: raw.hwb },
            { label: "CMYK", value: raw.cmyk },
          ]}
          deepLink={{ action: "color.convert", params: { input: values.input } }}
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
          <Action.SubmitForm
            title="Convert"
            icon={Icon.EyeDropper}
            onSubmit={submit}
          />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp("color.convert", { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="input"
        title="Color"
        placeholder="#ef6c45 / rgb(239, 108, 69) / coral / hsl(13, 84%, 60%)"
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
    </Form>
  );
}
