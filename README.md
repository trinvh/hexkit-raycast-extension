# Hexkit for Raycast

Run the [Hexkit](https://github.com/trinvh/hexkit) developer toolbox from
Raycast. Text-in / text-out tools (JSON, JWT, hashing, encoding) render
inline; visual tools (color picker, QR, certificate viewer, diff) deep-link
to the Hexkit desktop app via the `hexkit://` URL scheme.

> Free for personal use today. Future versions may require a paid Pro
> license — see the `licenseKey` preference.

## Requirements

- macOS with Raycast installed
- The Hexkit desktop app (for `hexkit://` deep links)
- The `hexkit` CLI on your `PATH` (for inline commands). It ships in the
  same repository — `cargo install --path crates/hexkit-cli` or copy the
  built binary somewhere on `PATH`.

If Raycast can't find `hexkit`, set the **Hexkit CLI path** preference to
the full absolute path (e.g. `/opt/homebrew/bin/hexkit`).

## Commands

| Command            | Mode    | What it does                                                         |
| ------------------ | ------- | -------------------------------------------------------------------- |
| **Search Tools**   | view    | Browse every Hexkit tool. Open in the desktop app, optionally seeded with your selection or clipboard. |
| **Format JSON**    | view    | Format and (optionally) sort JSON from selection/clipboard.          |
| **Decode JWT**     | view    | Decode header, payload, signature and algorithm of a JWT.            |
| **Hash Text**      | view    | Compute MD5 / SHA-1 / SHA-256 / SHA-384 / SHA-512 hashes of text.    |
| **Generate UUID**  | no-view | Generate a UUID v4 and copy it to the clipboard.                     |
| **Open Hexkit**    | no-view | Open the Hexkit desktop app.                                         |

All commands fall back to **Open in Hexkit** (⌘O) if the inline action
can't render the result — for example a tool that's marked as visual-only
or whose output isn't representable as plain text.

## Testing locally

Raycast extensions don't run standalone — they get registered with the
Raycast macOS app and live-reload from your source tree. The one-time
setup, end-to-end:

1. **Install the Raycast app** — <https://www.raycast.com/> (free).
2. **Install the `hexkit` CLI** (for inline commands). Either click
   *Install Command Line Tools…* in the Hexkit desktop app, or
   `cargo install --git https://github.com/trinvh/hexkit hexkit-cli`.
3. **Install this extension's dependencies**:
   ```bash
   make install
   ```
4. **Start the dev session**:
   ```bash
   make dev
   ```
   This runs `ray develop`. The first time you run it, Raycast registers
   the extension under *Extensions → Hexkit (development)*. Leave it
   running — every save reloads the extension instantly.
5. **Use a command**: open Raycast (⌘ + Space), search for **Search
   Tools**, **Format JSON**, **Decode JWT**, **Hash Text**, **Generate
   UUID** or **Open Hexkit**.

### What to verify

| Surface | What to check |
| --- | --- |
| **Preferences** | Open *Extensions → Hexkit → Configure Extension* and confirm the `hexkitCliPath` preference resolves. Leave it as `hexkit` if the binary is on your shell `PATH`, or paste the absolute path otherwise. |
| **Inline commands** | Copy some JSON / a JWT / a string, run the matching command. The output should render directly in Raycast. If it can't find the CLI, the error message tells you which path it tried. |
| **Deep-link fallback** | Run **Search Tools**, pick e.g. *Color Converter* (or any `inline: false` entry from `src/lib/tools.ts`), hit return. The Hexkit desktop app should open with the right tool focused. |
| **Selection seeding** | In another app, select text → trigger Raycast → run a Hexkit command. `getSelectedText()` is the primary input; clipboard is the fallback. |

### Without the desktop app

Inline commands work as long as the CLI is installed; the desktop app is
only needed for the deep-link fallback. To exercise visual tools without
it, you can still run `hexkit <action> …` in your terminal and pipe the
result back into Raycast — the CLI is the authoritative integration
point.

### Make targets

```bash
make help        # list every target
make install     # install dependencies (npm by default; override with PM=pnpm)
make dev         # `ray develop` — live-reload Raycast session
make build       # `ray build` — compile every command entry point
make lint        # `ray lint`
make lint-fix    # `ray lint --fix`
make typecheck   # strict `tsc --noEmit`
make icon        # regenerate assets/extension-icon.png
make clean       # remove dist, node_modules, raycast-env.d.ts, .raycast
```

Default package manager is `npm` to match Raycast's documentation. Use
`make dev PM=pnpm` (or `yarn`) if you'd rather.

The extension icon is generated programmatically (placeholder Hexkit hex
mark on the brand canvas). Drop a real PNG at
`assets/extension-icon.png` any time to override it, or run `make icon`
to regenerate the default.

## How the integration works

The extension talks to the same dispatcher as the desktop app and the
`hexkit` CLI:

1. **Inline tools** — `src/lib/hexkit.ts` shells out to `hexkit <action>
   '<json-params>'`. String results render as code blocks; structured
   results render as JSON.
2. **Visual tools** — fall back to `hexkit://<action>?input=<seed>` via
   the system `open` command, which the desktop app handles as a deep
   link.

Every action id lives in `src/lib/tools.ts`. Flip a tool's `inline`
flag to `false` to force the deep-link path, or to `true` once a Raycast
view exists for it.

## Publishing notes

Before submitting to the Raycast Store:

- Replace `"author": "trinvh"` in `package.json` with a real Raycast handle
  (the Store linter validates it against `https://www.raycast.com/api/v1/users/<handle>`).
- Add a `"license"` field — the Store requires `"MIT"`. Hexkit itself stays
  under PolyForm NC; only the Raycast manifest needs to declare an MIT
  surface for Store eligibility, or skip the Store entirely and distribute
  via the `hexkit.app` site.

## License

Part of the Hexkit project. Source-available under the
[PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0).
Free for personal use.
