// Cadence analysis for Humdrum **kern files.
// Detects authentic and Phrygian melodic cadences.
// Supports both monophonic (single **kern spine) and polyphonic scores.
// Exposes: parseKernSpines, detectCadences, markCadences

(function () {

const _CA_PITCH_NAMES = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];

// Convert a kern note token to an absolute MIDI number.
// Returns null if the token is not a pitched note.
function _tokenToMidi(token, keySignature = {}) {
    if (!token || token === '.') return null;

    const m = token.match(/([A-Ga-g]+)([#\-n]*)/);
    if (!m) return null;

    const letters = m[1];
    const rawAcc = m[2];
    const letter = letters[0].toUpperCase();
    const isLower = letters[0] === letters[0].toLowerCase();

    const BASE_PC = {
        C: 0, D: 2, E: 4, F: 5,
        G: 7, A: 9, B: 11
    };

    const octave = isLower
        ? 4 + letters.length - 1
        : 3 - (letters.length - 1);

    let accidental = keySignature[letter] || 0;

    // Explicit accidentals override the key signature.
    if (rawAcc.length > 0) {
        accidental = 0;

        for (const ch of rawAcc) {
            if (ch === '#') accidental++;
            if (ch === '-') accidental--;
        }
    }

    return BASE_PC[letter] + accidental + (octave + 1) * 12;
}

// Return duration of a kern token in quarter notes.
function _tokenDuration(token) {
	if (!token || token === '.') return 0;
	const m = token.match(/^(\d+)(\.+)?/);
	if (!m) return 0;

	const num  = parseInt(m[1]);
	const dots = m[2] ? m[2].length : 0;
	let base = num === 0 ? 8 : 4 / num;   // 0 = breve (8 QN)

	let total = base;
	let add   = base / 2;
	for (let i = 0; i < dots; i++) { total += add; add /= 2; }
	return total;
}

// ── Public: parse all **kern spines ─────────────────────────────────────────

function parseKernSpines(kernText) {
	const lines = kernText.split('\n');

	// Identify which tab-columns are **kern spines
	let kernCols = [];
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].startsWith('**')) {
			const fields = lines[i].split('\t');
			for (let j = 0; j < fields.length; j++) {
				if (fields[j] === '**kern') kernCols.push(j);
			}
			break;
		}
	}
	if (kernCols.length === 0) return [];

	const voices = kernCols.map(() => []);
	const qpos   = kernCols.map(() => 0);
	let   measure = 0;
	let keySignature = {};

	for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
		const line = lines[lineIdx];
		if (!line) continue;

		const ch = line[0];
		if (ch === '!') continue;          // comment
		if (line.startsWith('**')) continue;
		if (line.startsWith('*-')) break;  // spine terminator
		if (ch === '*') {
    const keyMatch = line.match(/\*k\[([^\]]*)\]/);

    if (keyMatch) {
        keySignature = {};

        const accidentals =
            keyMatch[1].match(/[A-Ga-g][#-]/g) || [];

        for (const accidental of accidentals) {
            const letter = accidental[0].toUpperCase();

            keySignature[letter] =
                accidental[1] === '#' ? 1 : -1;
        }
    }

    continue;
}

		if (ch === '=') {
			const bm = line.match(/^=(\d+)/);
			if (bm) measure = parseInt(bm[1]);
			continue;
		}

		const fields = line.split('\t');

		for (let vi = 0; vi < kernCols.length; vi++) {
			const col   = kernCols[vi];
			const token = (col < fields.length) ? fields[col] : '.';

			if (token === '.' || token[0] === '_') continue;

			const dur = _tokenDuration(token);

			if (/^\d+\.*r/.test(token)) {
			if (token.includes('}') && voices[vi].length > 0) {
		voices[vi][voices[vi].length - 1].phraseEnd = true;
	}
			if (dur > 0) qpos[vi] += dur;
			continue;
	}
			if (token[0] === 'q' || token[0] === 'Q') continue;

			const midi = _tokenToMidi(token, keySignature);
			if (midi === null) {
				if (dur > 0) qpos[vi] += dur;
				continue;
			}

			voices[vi].push({
		lineIdx,
		spineIdx: col,
		midi,
		durationQN: dur,
		qpos: qpos[vi],
		measure,
		phraseEnd: token.includes('}')
});
			if (dur > 0) qpos[vi] += dur;
		}
	}

	return voices;
}

// ── Public: detect cadences ──────────────────────────────────────────────────

function detectCadences(voices, key) {
	if (!voices || voices.length === 0) return [];
	const tonic = (key && key.tonic !== undefined) ? key.tonic : 0;
	const cadences = [];

	if (voices.length === 1) {
		// ── Monophonic: look for stepwise arrivals on the tonic ────────────
		const notes = voices[0];
		const hasPhraseMarkers = notes.some(note => note.phraseEnd);

		for (let i = 1; i < notes.length; i++) {
		const curr = notes[i];
		const prev = notes[i - 1];

    if (hasPhraseMarkers && !curr.phraseEnd) continue;

			if (curr.durationQN < 1) continue;  // too short

			// Must arrive on the tonic pitch class
			const currPC  = ((curr.midi % 12) + 12) % 12;
			const currDeg = (currPC - tonic + 12) % 12;
			if (currDeg !== 0) continue;

			// Approach interval (raw semitones, must be a step — no large leaps)
			const raw = curr.midi - prev.midi;
			if (Math.abs(raw) > 2) continue;

			let type = null;
			if (raw === -2)      type = 'authentic';  // M2 down: supertonic → tonic
			else if (raw === 1)  type = 'authentic';  // m2 up:   leading tone → tonic
			else if (raw === -1) type = 'phrygian';   // m2 down: Phrygian supertonic → tonic

			if (!type) continue;

			cadences.push({
				type,
				pitchCenter: _CA_PITCH_NAMES[currPC],
				measure: curr.measure,
				qpos:    curr.qpos,
				approachLines: [{ lineIdx: prev.lineIdx, spineIdx: prev.spineIdx }],
				arrivalLines:  [{ lineIdx: curr.lineIdx, spineIdx: curr.spineIdx }],
			});
		}
	} else {
		// ── Polyphonic: look for complementary clausula patterns ────────────
		for (let vA = 0; vA < voices.length; vA++) {
			for (let vB = vA + 1; vB < voices.length; vB++) {
				const notesA = voices[vA];
				const notesB = voices[vB];

				for (let iA = 1; iA < notesA.length; iA++) {
					const currA = notesA[iA];
					const prevA = notesA[iA - 1];
					if (currA.durationQN < 2) continue;

					const rawA = currA.midi - prevA.midi;
					if (Math.abs(rawA) > 3) continue;

					for (let iB = 1; iB < notesB.length; iB++) {
						const currB = notesB[iB];
						if (Math.abs(currA.qpos - currB.qpos) > 0.5) continue;
						if (currB.durationQN < 2) continue;

						const prevB = notesB[iB - 1];
						const rawB  = currB.midi - prevB.midi;
						if (Math.abs(rawB) > 3) continue;

						// Arrival pitch interval must be unison, octave, or fifth/fourth
						const arrDiff = Math.abs(currA.midi - currB.midi) % 12;
						if (arrDiff !== 0 && arrDiff !== 7 && arrDiff !== 5) continue;

						let type = null;

						// Clausula vera: one voice +1 (leading tone), other -2 (supertonic)
						if ((rawA === 1 && rawB === -2) || (rawA === -2 && rawB === 1)) {
							type = 'authentic';
						}
						// Phrygian: lower voice -1 (semitone down), upper voice ascends by step
						else if (rawA === -1 && (rawB === 1 || rawB === 2) && currA.midi < currB.midi) {
							type = 'phrygian';
						}
						else if (rawB === -1 && (rawA === 1 || rawA === 2) && currB.midi < currA.midi) {
							type = 'phrygian';
						}

						if (!type) continue;

						const arrPC = ((Math.min(currA.midi, currB.midi) % 12) + 12) % 12;

						cadences.push({
							type,
							pitchCenter: _CA_PITCH_NAMES[arrPC],
							measure: currA.measure,
							qpos:    currA.qpos,
							approachLines: [
								{ lineIdx: prevA.lineIdx, spineIdx: prevA.spineIdx },
								{ lineIdx: prevB.lineIdx, spineIdx: prevB.spineIdx },
							],
							arrivalLines: [
								{ lineIdx: currA.lineIdx, spineIdx: currA.spineIdx },
								{ lineIdx: currB.lineIdx, spineIdx: currB.spineIdx },
							],
						});
					}
				}
			}
		}
	}

	// Deduplicate: if multiple cadences land in the same measure within 2 beats, keep one
	cadences.sort((a, b) => a.qpos - b.qpos);
	const deduped = [];
	for (const cad of cadences) {
		const last = deduped[deduped.length - 1];
		if (last && last.measure === cad.measure && Math.abs(cad.qpos - last.qpos) < 2) {
			if (cad.arrivalLines.length > last.arrivalLines.length) {
				deduped[deduped.length - 1] = cad;
			}
			continue;
		}
		deduped.push(cad);
	}

	return deduped;
}

// ── Public: mark cadential notes in kern text ────────────────────────────────

function markCadences(kernText) {
	const key    = typeof _kernKey === 'function' ? _kernKey(kernText) : { tonic: 0, isMinor: false };
	const voices = parseKernSpines(kernText);

	if (voices.length === 0) return { markedKern: kernText, cadences: [] };

	const cadences = detectCadences(voices, key);
	if (cadences.length === 0) return { markedKern: kernText, cadences: [] };

	// Build injection map: lineIdx → [{spineIdx, sigil}]
	const marks = new Map();
	function addMark(lineIdx, spineIdx, sigil) {
		if (!marks.has(lineIdx)) marks.set(lineIdx, []);
		marks.get(lineIdx).push({ spineIdx, sigil });
	}
	for (const cad of cadences) {
		for (const e of cad.arrivalLines)  addMark(e.lineIdx, e.spineIdx, 'V');
		for (const e of cad.approachLines) addMark(e.lineIdx, e.spineIdx, 'Z');
	}

	const lines    = kernText.split('\n');
	const newLines = lines.map((line, i) => {
		if (!marks.has(i)) return line;
		const fields = line.split('\t');
		for (const { spineIdx, sigil } of marks.get(i)) {
			if (spineIdx < fields.length) fields[spineIdx] += sigil;
		}
		return fields.join('\t');
	});

	newLines.push('!!!RDF**kern: V = cadence arrival color=#1a6e3c');
	newLines.push('!!!RDF**kern: Z = cadence approach color=#c25a00');

	return { markedKern: newLines.join('\n'), cadences };
}

//////////////////////////////
//
// extractMelodicSegments -- Extract the last three notes
// from each explicitly marked melodic phrase.
//

function extractMelodicSegments(kernText) {
    const lines = kernText.split(/\r?\n/);
    const voices = parseKernSpines(kernText);
    if (!voices.length) return [];

    const melody = voices[0];
    const segments = [];

    // Map parsed notes to their original lines.
    const noteByLine = new Map(
        melody.map(note => [note.lineIdx, note])
    );

    const spineIdx = melody.length ? melody[0].spineIdx : 0;

    let current = [];
    let inside = false;

    function finishSegment() {
        if (!inside || current.length === 0) {
            current = [];
            inside = false;
            return;
        }

        const lastThree = current.slice(-3);
        const finalNote = current[current.length - 1];

        segments.push({
            segment: segments.length + 1,
            measure: finalNote.measure,
            lastThreeMidi: lastThree.map(note => note.midi),
            finalMidi: finalNote.midi
        });

        current = [];
        inside = false;
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (!line || /^[!*=]/.test(line)) continue;

        const fields = line.split('\t');
        const token = fields[spineIdx] || '';

        if (token.includes('{')) {
            if (inside) finishSegment();
            current = [];
            inside = true;
        }

        if (!inside) continue;

        const note = noteByLine.get(i);
        if (note) current.push(note);

        // Works for both notes ending with } and rests like 2r}.
        if (token.includes('}')) {
            finishSegment();
        }
    }

    return segments;
}

// Expose to global scope
window.parseKernSpines = parseKernSpines;
window.detectCadences  = detectCadences;
window.markCadences    = markCadences;
window.extractMelodicSegments = extractMelodicSegments;

})();
