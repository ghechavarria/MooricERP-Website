"""Write a typed TS content module from docx_to_blocks.py JSON.

Usage: blocks_to_ts.py IN.json OUT.ts EXPORT_NAME SOURCE_NAME
The company line and title become fields, the plain lines right after the title
become `meta` (subtitle, effective date), and paper-form lines (blank signature
lines) are dropped.
"""

import json
import re
import sys

FORM_LINE = re.compile(r"_{5,}")


def main(src, out, name, source):
    blocks = json.load(open(src, encoding="utf-8"))
    company = title = ""
    meta, body = [], []
    i = 0
    if blocks and blocks[0]["kind"] == "strong":
        company = blocks[0]["text"]
        i = 1
    if i < len(blocks) and blocks[i]["kind"] == "title":
        title = blocks[i]["text"]
        i += 1
    while i < len(blocks) and blocks[i]["kind"] == "p":
        meta.append(blocks[i]["text"])
        i += 1
    for b in blocks[i:]:
        if b["kind"] in ("p", "strong") and FORM_LINE.search(b["text"]):
            continue
        body.append(b)
    doc = {"company": company, "title": title, "meta": meta, "blocks": body}
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(f"// Generated from {source}. Edit the Word document, then regenerate; see docs/legal-pages.md.\n")
        f.write('import type { LegalDoc } from "./types";\n\n')
        f.write(f"export const {name}: LegalDoc = ")
        f.write(json.dumps(doc, ensure_ascii=False, indent=2))
        f.write(";\n")


if __name__ == "__main__":
    main(*sys.argv[1:5])
