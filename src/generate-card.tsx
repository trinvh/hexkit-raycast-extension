import { Action, ActionPanel, Form, Icon, useNavigation, Detail } from "@raycast/api";
import { useState } from "react";
import { runHexkit, openInHexkitApp, toastError } from "./lib/hexkit";

const BRANDS = [
  { value: "visa", title: "Visa" },
  { value: "mastercard", title: "Mastercard" },
  { value: "amex", title: "American Express" },
  { value: "discover", title: "Discover" },
  { value: "jcb", title: "JCB" },
  { value: "diners", title: "Diners Club" },
  { value: "union_pay", title: "UnionPay" },
];

interface Card {
  number: string;
  formatted: string;
  brand: string;
}

interface FormValues {
  brand: string;
  count: string;
}

export default function Command() {
  const { push } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function submit(values: FormValues) {
    setError(undefined);
    const count = Math.max(1, Math.min(50, Number.parseInt(values.count, 10) || 5));
    try {
      const raw = await runHexkit<Card[]>("card.generate", { brand: values.brand, count });
      const cards = Array.isArray(raw) ? raw : [];
      push(<ResultDetail brand={values.brand} cards={cards} />);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Generate" icon={Icon.CreditCard} onSubmit={submit} />
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("card.generate").catch(toastError)}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="brand" title="Brand" defaultValue="visa" error={error}>
        {BRANDS.map((b) => (
          <Form.Dropdown.Item key={b.value} value={b.value} title={b.title} />
        ))}
      </Form.Dropdown>
      <Form.TextField id="count" title="Count" placeholder="1–50" defaultValue="5" />
      <Form.Description text="⚠️ Test numbers only — Luhn-valid but not real cards. Do not attempt real payments." />
    </Form>
  );
}

function ResultDetail({ brand: _brand, cards }: { brand: string; cards: Card[] }) {
  const md = cards.length
    ? cards.map((c, i) => `${i + 1}. \`${c.formatted}\` _(${c.brand})_`).join("\n")
    : "_(no cards)_";
  return (
    <Detail
      markdown={`## Generated cards\n\n${md}\n\n_Test numbers only — Luhn-valid but not real cards._`}
      actions={
        <ActionPanel>
          {cards[0] && <Action.CopyToClipboard title="Copy First Number" content={cards[0].number} />}
          {cards.length > 1 && (
            <Action.CopyToClipboard title="Copy All Numbers" content={cards.map((c) => c.number).join("\n")} />
          )}
          <Action
            title="Open in Hexkit"
            icon={Icon.AppWindow}
            shortcut={{ modifiers: ["cmd"], key: "o" }}
            onAction={() => openInHexkitApp("card.generate").catch(toastError)}
          />
        </ActionPanel>
      }
    />
  );
}
