(function () {
    "use strict";

    const baseUrl = new URL(
        "./",
        document.currentScript.src
    );

    window.analyzeCadencesWithHumlib = async function (kernText) {

        const output = [];
        const errors = [];

        const module = await createCadenceModule({
            noInitialRun: true,

            locateFile: function (name) {
                return new URL(name, baseUrl).href;
            },

            print: function (text) {
                output.push(text);
            },

            printErr: function (text) {
                errors.push(text);
            }
        });

        module.FS.writeFile(
            "/input.krn",
            new TextEncoder().encode(kernText)
        );

        const code = module.callMain(["/input.krn"]);

        if (code !== 0 && code !== undefined) {
            throw new Error(
                errors.join("\n") || "Humlib analysis failed"
            );
        }

        const segments = JSON.parse(output.join("\n"));

        if (!Array.isArray(segments)) {
            throw new Error("Invalid Humlib result");
        }

        return segments;
    };
})();
