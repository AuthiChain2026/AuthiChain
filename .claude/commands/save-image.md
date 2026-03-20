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
  - Omitted / `chat` — Claude will guide you through the browser dev-tools extraction method

## Examples

```
/save-image public/images/qron/guardian.png https://example.com/guardian.png
/save-image public/images/qron/citadel.png /tmp/citadel.png
/save-image public/images/qron/persona.png base64
/save-image public/images/qron/sentinel.png chat
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

When they provide it, write it to a temp file and decode:
```bash
cat > /tmp/b64_input.txt << 'ENDB64'
<paste-data-here>
ENDB64
base64 -d /tmp/b64_input.txt > "<absolute-destination>"
```

### No source / inline chat image / "file name is not valid" error
When right-click → Save fails (blob URLs, data URLs, or "file name is not valid" browser error),
use the **browser dev-tools extraction method**:

Tell the user exactly:

> The browser can't save this image directly. Here's the 30-second fix using Dev Tools:
>
> 1. **Open Dev Tools** — press `F12` (or `Cmd+Option+I` on Mac)
> 2. Go to the **Console** tab
> 3. Right-click the image in the chat → **Inspect** — this highlights the `<img>` element
> 4. In the Console, run:
>    ```js
>    copy(document.querySelector('img[src*="blob"], img[src*="data:"]')?.src || $$('img')[0]?.src)
>    ```
>    *(If there are multiple images, increment the index: `$$('img')[1]`, `$$('img')[2]`, etc.)*
> 5. That copies a `blob:` or `data:` URL to your clipboard
> 6. Paste it here and I'll handle the rest

When the user pastes a `blob:` URL, tell them:
> blob: URLs expire when the tab closes. Instead, in the Console run:
> ```js
> fetch('BLOB_URL_HERE').then(r=>r.blob()).then(b=>{const fr=new FileReader();fr.onload=e=>copy(e.target.result);fr.readAsDataURL(b)})
> ```
> Then paste the resulting `data:image/...;base64,...` string here.

When the user pastes a `data:image/...;base64,<data>` string, strip the header and decode:
```bash
echo "<base64-portion-after-comma>" | base64 -d > "<absolute-destination>"
```

### After saving
- Confirm the destination path and file size (`ls -lh <path>`).
- If the path is under `public/`, remind the user that Next.js will serve it at `/<relative-path-from-public>`.
- Offer to commit: `git add <destination> && git commit -m "feat: add QRON gallery image <filename>"`.
