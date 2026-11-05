const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('work/cadence-analysis.js', 'utf8');
const kern = fs.readFileSync('bc001-full.krn', 'utf8');

const context = { window: {} };

vm.createContext(context);
vm.runInContext(code, context);

const voices = context.window.parseKernSpines(kern);

for (const voice of voices) {
    for (const note of voice) {
        if (note.measure === 23 || note.measure === 28) {
            console.log(note);
        }
    }
}
