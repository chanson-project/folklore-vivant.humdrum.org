#!/usr/bin/env python3
"""
Build a melodic pitch + scale-degree index from chanson **kern encoding files.

Downloads the encoding repository as a single zip (one network request),
extracts the primary melodic line from each **kern file, and writes
assets/melodic-index.json with entries of the form:

    { "p": "A C C F G ...", "d": "3 5 5 1 2 ...", "key": "F" }

"p" = space-separated pitch-class names (for pitch-name search)
"d" = space-separated scale degrees relative to the work's key (for degree search)
"key" = tonic + mode, e.g. "F", "dm" (minor uses lowercase + 'm')

Scale degrees use 1–7 for diatonic tones; chromatic alterations are
prefixed with # or b (e.g. "#4", "b7").

Usage (run from project root):
    python3 bin/build-melodic-index.py

Requires _includes/metadata/works.json to exist (run 'make download' first).
"""

import io
import json
import re
import sys
import urllib.request
import zipfile
from pathlib import Path

REPO_ZIP   = "https://github.com/chanson-project/chanson-encoding/archive/refs/heads/main.zip"
WORKS_JSON = Path("_includes/metadata/works.json")
OUTPUT     = Path("assets/melodic-index.json")

# 2-char work-ID prefix → subdirectory in the encoding repo
DIR_MAP = {"BC": "bc", "EG": "eg", "MB": "mb"}

# Semitone distance from tonic → scale-degree label, for major and minor keys.
# Diatonic degrees are 1–7; chromatic alterations carry # or b prefix.
MAJOR_DEGREES = {
    0: '1', 1: '#1', 2: '2', 3: 'b3', 4: '3', 5: '4',
    6: '#4', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7',
}
MINOR_DEGREES = {
    0: '1', 1: '#1', 2: '2', 3: '3', 4: '#3', 5: '4',
    6: '#4', 7: '5', 8: '6', 9: '#6', 10: '7', 11: '#7',
}

PITCH_SEMITONES = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
}

SEMITONE_TO_KEY_NAME = {
    0: 'C', 1: 'C#', 2: 'D', 3: 'Eb', 4: 'E', 5: 'F',
    6: 'F#', 7: 'G', 8: 'Ab', 9: 'A', 10: 'Bb', 11: 'B',
}


def extract_key(kern_text):
    """Return (tonic_semitone, is_minor) from the first key interpretation found.

    Kern key records look like *F: (F major) or *d: (d minor).
    The letter is lowercase for minor, uppercase for major.
    Accidentals use kern notation: # for sharp, - for flat.
    Returns (0, False) = C major if no key record is found.
    """
    letter_semitones = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    for line in kern_text.split('\n'):
        line = line.rstrip('\r')
        if not line.startswith('*') or line.startswith('**') or line.startswith('*-'):
            continue
        token = line.split('\t')[0]
        m = re.match(r'^\*([A-Ga-g])([#-]?):$', token)
        if m:
            letter, acc = m.group(1), m.group(2)
            is_minor = letter.islower()
            tonic = letter_semitones[letter.upper()]
            if acc == '#':
                tonic = (tonic + 1) % 12
            elif acc == '-':
                tonic = (tonic - 1) % 12
            return tonic, is_minor
    return 0, False  # default: C major


def pitch_to_degree(pitch_class, tonic_semitone, is_minor):
    """Convert a pitch-class string (e.g. 'F#', 'Bb') to a scale-degree string."""
    semitone = PITCH_SEMITONES.get(pitch_class)
    if semitone is None:
        return None
    interval = (semitone - tonic_semitone) % 12
    degree_map = MINOR_DEGREES if is_minor else MAJOR_DEGREES
    return degree_map.get(interval)


def extract_pitches(kern_text):
    """Return list of pitch-class strings from the first **kern spine."""
    in_kern = False
    pitches = []

    for line in kern_text.split('\n'):
        line = line.rstrip('\r')
        if not line:
            continue
        if line.startswith('**'):
            in_kern = line.split('\t')[0] == '**kern'
            continue
        if line.startswith('*-'):
            break
        if line[0] in ('!', '*', '='):
            continue
        if not in_kern:
            continue

        token = line.split('\t')[0].strip()
        if not token or token == '.':
            continue
        if '_' in token and not re.search(r'[A-Ga-g]', token.replace('_', '')):
            continue

        m = re.search(r'([A-Ga-g]+)([#\-]*)', token)
        if not m:
            continue

        letter      = m.group(1)[0].upper()
        accidentals = m.group(2)
        if '#' in accidentals:
            pitches.append(letter + '#')
        elif '-' in accidentals:
            pitches.append(letter + 'b')
        else:
            pitches.append(letter)

    return pitches


def main():
    if not WORKS_JSON.exists():
        sys.exit(f"ERROR: {WORKS_JSON} not found — run 'make download' first.")

    works = json.loads(WORKS_JSON.read_text(encoding='utf-8'))

    path_to_id = {}

    for work in works:
        work_id   = (work.get("!!!id") or "").strip()
        filename  = (work.get("!!!file-name") or "").strip()
        prefix    = work_id[:2].upper()
        directory = DIR_MAP.get(prefix)

        if work_id and filename and directory:
            filename = re.sub(
                r'^[A-Za-z]+',
                lambda m: m.group(0).lower(),
                filename
            )
            filename = filename.replace("'", "")

            path_to_id[f"{directory}/kern/{filename}"] = work_id

    print(f"Fetching encoding repository ({REPO_ZIP}) …")
    with urllib.request.urlopen(REPO_ZIP) as resp:
        raw = resp.read()
    print(f"Downloaded {len(raw) / 1024:.0f} KB.")

    zf       = zipfile.ZipFile(io.BytesIO(raw))
    zip_root = "chanson-encoding-main/"
    index    = {}
    missing  = []

    for rel_path, work_id in sorted(path_to_id.items()):
        zip_path = zip_root + rel_path
        try:
            kern_bytes = zf.read(zip_path)
        except KeyError:
            missing.append(zip_path)
            continue

        kern_text = kern_bytes.decode('utf-8')
        pitches   = extract_pitches(kern_text)
        if not pitches:
            print(f"  {work_id}: WARNING — no pitches extracted", file=sys.stderr)
            continue

        tonic, is_minor = extract_key(kern_text)
        degrees = [pitch_to_degree(p, tonic, is_minor) for p in pitches]
        degrees = [d for d in degrees if d is not None]

        key_name = SEMITONE_TO_KEY_NAME[tonic] + ('m' if is_minor else '')
        index[work_id] = {
            'p':   ' '.join(pitches),
            'd':   ' '.join(degrees),
            'key': key_name,
        }
        print(f"  {work_id} ({key_name}): {len(pitches)} notes")

    if missing:
        print(f"\nWARNING: {len(missing)} file(s) not found in zip:", file=sys.stderr)
        for p in missing:
            print(f"  {p}", file=sys.stderr)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(index, ensure_ascii=False), encoding='utf-8')
    print(f"\nIndexed {len(index)} works → {OUTPUT}")


if __name__ == "__main__":
    main()
