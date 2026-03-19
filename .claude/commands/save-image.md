# save-image

Save an image from a URL, local path, or base64 string to the project filesystem.

## Usage

```
/save-image <destination> <source>
```

- `destination` — target path inside the project (e.g. `public/images/qron/guardian.png`)
- `source` — one of:
  - A URL (`https://...`)
  - An absolute local path (`/tmp/guardian.png`)
  - The word `base64` — you will be prompted to paste the data

## Examples

```
/save-image public/images/qron/guardian.png https://example.com/guardian.png
/save-image public/images/qron/citadel.png /tmp/citadel.png
/save-image public/images/qron/persona.png base64
```

---

## Instructions for Claude

When this skill is invoked, parse `$ARGUMENTS` as `<destination> <source>`.

Resolve `destination` relative to the project root (`/home/user/AuthiChain`).
Create any missing parent directories with `mkdir -p`.

Then handle each source type:

### URL source
```bash
curl -fsSL "<url>" -o "<absolute-destination>"
```
Verify the file was written and report its size.

### Local path source
```bash
cp "<source-path>" "<absolute-destination>"
```
Verify the copy succeeded.

### base64 source
Tell the user:
> Paste the base64-encoded image data (no header, just the raw base64 string), then press Enter.

When they provide it, run:
```bash
echo "<base64-data>" | base64 -d > "<absolute-destination>"
```

### No source / inline chat image
If no source is given, or the user says the image is "in the chat" / "attached above",
explain clearly:

> Claude cannot extract binary image data from inline chat attachments — images shared
> in conversation are visual-only context. To save the image, please:
> 1. Right-click the image → **Save image as…**
> 2. Note the saved path (e.g. `/tmp/guardian.png`)
> 3. Re-run: `/save-image <destination> /tmp/guardian.png`
>
> Alternatively, if you have a URL for the image, pass that as the source instead.

### After saving
- Confirm the destination path and file size.
- If the path is under `public/`, remind the user that Next.js will serve it at `/<relative-path-from-public>`.
- Offer to commit the new asset: `git add <destination> && git commit -m "feat: add QRON gallery image <filename>"`.
