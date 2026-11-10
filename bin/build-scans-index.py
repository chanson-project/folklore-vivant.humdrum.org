#!/usr/bin/env python3
"""
Generate _includes/metadata/scans.json — a mapping from work ID to the
GitHub raw URL of the corresponding source scan PDF.

PDFs live alongside the kern files in the chanson-encoding repo:
  bc100/pdf/BC001_o-canada_pp4-5.pdf
  eg104/pdf/eg001_adam-et-eve_p161-167.pdf
  mb157/pdf/MB001_je-me-suis-habille_p13-18.pdf

The work ID is extracted from the PDF filename prefix (e.g. "BC001", "EG001").
"""

import json
import re
import sys
import urllib.request
import urllib.error

REPO    = "chanson-project/chanson-encoding"
BRANCH  = "refs/heads/main"
RAW     = f"https://raw.githubusercontent.com/{REPO}/{BRANCH}"
API     = f"https://api.github.com/repos/{REPO}/contents"

COLLECTIONS = [
    ("bc", "BC"),
    ("eg", "EG"),
    ("mb", "MB"),
    ("vq", "VQ"),
]

OUT = "_includes/metadata/scans.json"


def api_list(path):
    url = f"{API}/{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "1520s-build-script/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        print(f"  Warning: {url} returned {e.code}", file=sys.stderr)
        return []


def extract_id(filename, prefix):
    """
    Extract the normalised work ID from a PDF filename.
    'BC001_o-canada_pp4-5.pdf'  → 'BC001'
    'eg001_adam-et-eve.pdf'     → 'EG001'
    """
    m = re.match(r'^([A-Za-z]+)(\d+)', filename)
    if not m:
        return None
    return m.group(1).upper() + m.group(2)


def main():
    lookup = {}

    for (collection, prefix) in COLLECTIONS:
        print(f"Fetching {collection}/pdf …", file=sys.stderr)
        items = api_list(f"{collection}/pdf")
        count = 0
        for item in items:
            name = item.get("name", "")
            if not name.lower().endswith(".pdf"):
                continue
            wid = extract_id(name, prefix)
            if wid is None:
                continue
            url = f"{RAW}/{collection}/pdf/{name}"
            lookup[wid] = url
            count += 1
        print(f"  {count} PDFs indexed for {prefix}", file=sys.stderr)

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(lookup, f, indent="\t", ensure_ascii=False)
        f.write("\n")

    print(f"Written {len(lookup)} entries to {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
