"""Turn a .docx into a JSON list of blocks for a website page.

Block kinds: title, h2, h3, p, strong (a fully bold paragraph), list (items), table
(header row + rows). Consecutive numbered paragraphs become one list.
"""

import json
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


NUM_FMT = {}


def load_numbering(z):
    """numId -> level-0 format ('bullet' or 'decimal')."""
    try:
        root = ET.fromstring(z.read("word/numbering.xml"))
    except KeyError:
        return
    abstract = {}
    for a in root.findall(W + "abstractNum"):
        lvl = a.find(W + "lvl")
        fmt = lvl.find(W + "numFmt") if lvl is not None else None
        abstract[a.get(W + "abstractNumId")] = fmt.get(W + "val") if fmt is not None else "bullet"
    for n in root.findall(W + "num"):
        NUM_FMT[n.get(W + "numId")] = abstract.get(n.find(W + "abstractNumId").get(W + "val"), "bullet")


def para(p):
    ppr = p.find(W + "pPr")
    style, num = "", False
    if ppr is not None:
        s = ppr.find(W + "pStyle")
        style = s.get(W + "val", "") if s is not None else ""
        np_ = ppr.find(W + "numPr")
        if np_ is not None:
            nid = np_.find(W + "numId")
            num = NUM_FMT.get(nid.get(W + "val") if nid is not None else "", "bullet")
    parts, bold_all = [], True
    for r in p.iter(W + "r"):
        t = "".join(x.text or "" for x in r.iter(W + "t"))
        if not t:
            continue
        rpr = r.find(W + "rPr")
        if t.strip() and (rpr is None or rpr.find(W + "b") is None):
            bold_all = False
        parts.append(t)
    return style, num, bold_all, "".join(parts).strip()


def cell_text(tc):
    return " ".join(t for t in (para(p)[3] for p in tc.iter(W + "p")) if t)


def main(path, out):
    with zipfile.ZipFile(path) as z:
        load_numbering(z)
        body = ET.fromstring(z.read("word/document.xml")).find(W + "body")
    blocks = []
    for el in body:
        if el.tag == W + "tbl":
            rows = [[cell_text(tc) for tc in tr.findall(W + "tc")] for tr in el.findall(W + "tr")]
            blocks.append({"kind": "table", "head": rows[0], "rows": rows[1:]})
            continue
        if el.tag != W + "p":
            continue
        style, num, bold, text = para(el)
        if not text:
            continue
        if num:
            ordered = num == "decimal"
            if blocks and blocks[-1]["kind"] == "list" and blocks[-1]["ordered"] == ordered:
                blocks[-1]["items"].append(text)
            else:
                blocks.append({"kind": "list", "ordered": ordered, "items": [text]})
        elif style == "Title":
            blocks.append({"kind": "title", "text": text})
        elif style == "Heading1":
            blocks.append({"kind": "h2", "text": text})
        elif style == "Heading2":
            blocks.append({"kind": "h3", "text": text})
        elif bold:
            blocks.append({"kind": "strong", "text": text})
        else:
            blocks.append({"kind": "p", "text": text})
    with open(out, "w", encoding="utf-8") as f:
        json.dump(blocks, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
