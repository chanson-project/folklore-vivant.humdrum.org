const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('work/cadence-analysis.js', 'utf8');
const kern = fs.readFileSync('mb004b-full.krn', 'utf8');

const context = {
    window: {},
    _kernKey: (kernText) => {
    const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const match = kernText.match(/^\*([A-Ga-g])([#-]?):/m);
    if (!match) return { tonic: 0, isMinor: false };

    let tonic = base[match[1].toUpperCase()];
    if (match[2] === '#') tonic = (tonic + 1) % 12;
    if (match[2] === '-') tonic = (tonic + 11) % 12;

    return { tonic, isMinor: match[1] === match[1].toLowerCase() };
}
};

vm.createContext(context);
vm.runInContext(code, context);

const result = context.window.markCadences(kern);

console.log('Detected cadences:');

for (const cad of result.cadences) {
    console.log(
        `Measure ${cad.measure}: ${cad.type} -> ${cad.pitchCenter}`
    );
}
