import {
  Action,
  ActionPanel,
  Form,
  Icon,
  useNavigation,
  Image,
} from "@raycast/api";
import { useEffect, useState, type ReactElement } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./hexkit";
import { readSeedText } from "./seed";
import { ResultText, ResultMulti, type ResultRow } from "./result";

interface BaseProps {
  action: string;
  formTitle: string;
  submitTitle: string;
  icon: Image.ImageLike;
  placeholder: string;
  /** If true, `String#trim()` the clipboard seed before using it. */
  trimSeed?: boolean;
}

/**
 * Single-input, single-text-output transform. Wraps the Form/readSeed/submit
 * dance so individual command files stay ~20 lines.
 */
export function TextTransform({
  action,
  formTitle,
  submitTitle,
  icon,
  placeholder,
  resultTitle,
  resultLanguage,
  trimSeed = false,
}: BaseProps & {
  resultTitle: string;
  resultLanguage?: string;
}): ReactElement {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then((t) => setSeed(trimSeed ? t.trim() : t));
  }, [trimSeed]);

  async function submit(values: { input: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter some text first.");
      return;
    }
    try {
      const out = await runHexkit<string>(action, { input: values.input });
      push(
        <ResultText
          title={resultTitle}
          language={resultLanguage}
          output={typeof out === "string" ? out : String(out)}
          deepLink={{ action, params: { input: values.input } }}
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
          <Action.SubmitForm title={submitTitle} icon={icon} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp(action, { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="input"
        title={formTitle}
        placeholder={placeholder}
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
    </Form>
  );
}

/**
 * Single-input → multi-row labelled output. The `rowsFrom` callback turns the
 * dispatcher's JSON response into the rows the result Detail renders.
 */
export function MultiTransform<T>({
  action,
  formTitle,
  submitTitle,
  icon,
  placeholder,
  resultTitle,
  rowsFrom,
  trimSeed = false,
  fieldKind = "textarea",
}: BaseProps & {
  resultTitle: string | ((data: T) => string);
  rowsFrom: (data: T) => ResultRow[];
  fieldKind?: "textarea" | "textfield";
}): ReactElement {
  const { push } = useNavigation();
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    void readSeedText().then((t) => setSeed(trimSeed ? t.trim() : t));
  }, [trimSeed]);

  async function submit(values: { input: string }) {
    setError(undefined);
    if (!values.input.trim()) {
      setError("Enter some text first.");
      return;
    }
    try {
      const raw = await runHexkit<T>(action, { input: values.input });
      if (typeof raw === "string") {
        setError(`Couldn't parse ${action} output: ${raw.slice(0, 200)}`);
        return;
      }
      push(
        <ResultMulti
          title={typeof resultTitle === "function" ? resultTitle(raw) : resultTitle}
          rows={rowsFrom(raw)}
          deepLink={{ action, params: { input: values.input } }}
        />,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  if (seed === null) return <Form isLoading />;

  const Field = fieldKind === "textfield" ? Form.TextField : Form.TextArea;

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={submitTitle} icon={icon} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() =>
              openInHexkitApp(action, { input: seed }).catch(toastError)
            }
          />
        </ActionPanel>
      }
    >
      <Field
        id="input"
        title={formTitle}
        placeholder={placeholder}
        defaultValue={seed}
        error={error}
        onChange={() => error && setError(undefined)}
      />
    </Form>
  );
}

/**
 * For tools whose UI doesn't fit Raycast (color picker, QR rendering, trees,
 * diff visualisations…). Provides a Form so the user can edit / paste input,
 * but the submit action just deep-links into Hexkit with all form values
 * forwarded as query parameters.
 */
export function DeepLinkOnly({
  action,
  formTitle,
  submitTitle,
  icon,
  placeholder,
  rationale,
  fieldKind = "textarea",
  trimSeed = false,
  paramKey = "input",
}: BaseProps & {
  rationale?: string;
  fieldKind?: "textarea" | "textfield";
  /** Deep-link query parameter name — defaults to `input`. Override for
   * actions whose primary field has a different name (e.g. `user_id` for
   * `pgp.keygen`). */
  paramKey?: string;
}): ReactElement {
  const [seed, setSeed] = useState<string | null>(null);

  useEffect(() => {
    void readSeedText().then((t) => setSeed(trimSeed ? t.trim() : t));
  }, [trimSeed]);

  async function submit(values: { input: string }) {
    try {
      await openInHexkitApp(action, { [paramKey]: values.input });
    } catch (err) {
      await toastError(err);
    }
  }

  if (seed === null) return <Form isLoading />;

  const Field = fieldKind === "textfield" ? Form.TextField : Form.TextArea;

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title={submitTitle} icon={icon} onSubmit={submit} />
        </ActionPanel>
      }
    >
      <Field
        id="input"
        title={formTitle}
        placeholder={placeholder}
        defaultValue={seed}
      />
      {rationale && <Form.Description text={rationale} />}
    </Form>
  );
}
