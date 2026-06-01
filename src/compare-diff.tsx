import { Action, ActionPanel, Form, Icon } from "@raycast/api";
import { useState } from "react";
import { openInHexkitApp, toastError } from "./lib/hexkit";

export default function Command() {
  const [error, setError] = useState<string | undefined>();

  async function submit(values: { old: string; new: string; format: string }) {
    setError(undefined);
    if (!values.old || !values.new) {
      setError("Provide both sides of the diff.");
      return;
    }
    try {
      // Side-by-side diff doesn't fit Raycast; route to the desktop.
      await openInHexkitApp("diff.compare", {
        input: values.old,
        old: values.old,
        new: values.new,
        format: values.format,
      });
    } catch (err) {
      await toastError(err);
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Diff in Hexkit" icon={Icon.AppWindow} onSubmit={submit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="old" title="Old" placeholder="Original text" error={error} onChange={() => error && setError(undefined)} />
      <Form.TextArea id="new" title="New" placeholder="Modified text" />
      <Form.Dropdown id="format" title="Format" defaultValue="text">
        <Form.Dropdown.Item value="text" title="Plain text" />
        <Form.Dropdown.Item value="json" title="JSON (normalised)" />
        <Form.Dropdown.Item value="xml" title="XML (normalised)" />
      </Form.Dropdown>
      <Form.Description text="Side-by-side diff renders best in the Hexkit desktop app — this command deep-links into it." />
    </Form>
  );
}
