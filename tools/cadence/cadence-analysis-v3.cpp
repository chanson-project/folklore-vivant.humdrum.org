#include "humlib.h"
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <cctype>

using namespace std;
using namespace hum;

struct Note {
    string pitch;
    string degree;
    int midi;
    int base40;
    string measure;
};

string pitchName(string pitch) {
    while (!pitch.empty() &&
           isdigit(static_cast<unsigned char>(pitch.back()))) {
        pitch.pop_back();
    }
    return pitch;
}

string degreeName(const string& degree) {

    if (degree.empty() || degree == ".")
        return "?";

    string number;
    string accidental;

    for (char c : degree) {
        if (isdigit(static_cast<unsigned char>(c)))
            number += c;
        else if (c == '+')
            accidental += "#";
        else if (c == '-')
            accidental += "b";
        else
            return "?";
    }

    if (number.empty())
        return "?";

    return accidental + number;
}

string classifyCadence(const vector<Note>& notes) {

    if (notes.size() < 2)
        return "None";

    const Note& previous = notes[notes.size() - 2];
    const Note& finalNote = notes.back();

    if (finalNote.degree != "1")
        return "None";

    int movement = finalNote.midi - previous.midi;

    if (previous.degree == "3" && movement < 0)
        return "3-1 Falling third";

    if (previous.degree == "2" && movement < 0)
        return "2-1 Falling step";

    if (previous.degree == "5" && movement < 0)
        return "5-1 Falling fifth";

    if (previous.degree == "7" && movement > 0)
        return "7-1 Rising step";

    if (previous.degree == "6" && movement > 0)
        return "6-1 Rising third";

    if (previous.degree == "4" && movement > 0)
        return "4-1 Rising fourth";

    return "None";
}


string jsonString(const string& value) {
    string result = "\"";
    const char* hex = "0123456789abcdef";

    for (unsigned char c : value) {
        if (c == '"' || c == '\\') {
            result += '\\';
            result += c;
        } else if (c < 32) {
            result += "\\u00";
            result += hex[c >> 4];
            result += hex[c & 15];
        } else {
            result += c;
        }
    }

    return result + "\"";
}

int main(int argc, char** argv) {

    if (argc < 2) {
        cerr << "Usage: ./cadence-analysis-v2 file.krn\n";
        return 1;
    }

    HumdrumFile score;

    if (!score.read(argv[1])) {
        cerr << "Cannot read file\n";
        return 1;
    }

    // Craig's Humlib scale-degree analysis.
    Tool_deg tool;
    stringstream output;

    if (!tool.run(score, output)) {
        cerr << "Degree analysis failed\n";
        return 1;
    }

    HumdrumFile analyzed;

    if (!analyzed.readString(output.str())) {
        cerr << "Cannot read analyzed data\n";
        return 1;
    }

    vector<Note> phrase;

    string measure = "=0";
    string key = "Unknown";
    string activeLineType = "Unknown";
    string segmentLineType = "Unknown";

    int segment = 0;
    bool active = false;


    cout << "[";

    auto finishSegment = [&]() {

        if (!active || phrase.empty()) {
            phrase.clear();
            active = false;
            return;
        }

        if (segment > 0) cout << ",";
        segment++;

        size_t start = phrase.size() > 3
            ? phrase.size() - 3 : 0;

        const Note& finalNote = phrase.back();

        string measureLabel = finalNote.measure;

        if (!measureLabel.empty() &&
            measureLabel[0] == '=') {
            measureLabel.erase(0, 1);
        }

        cout << "\n  {";
        cout << "\"segment\":" << segment;
        cout << ",\"key\":" << jsonString(key);
        cout << ",\"measure\":" << jsonString(measureLabel);
        cout << ",\"lineType\":" << jsonString(segmentLineType);

        cout << ",\"lastThreePitches\":[";

        for (size_t k = start; k < phrase.size(); k++) {
            if (k > start) cout << ",";
            cout << jsonString(phrase[k].pitch);
        }

        cout << "]";

        cout << ",\"lastThreeDegrees\":[";

        for (size_t k = start; k < phrase.size(); k++) {
            if (k > start) cout << ",";
            cout << jsonString(phrase[k].degree);
        }

        cout << "]";

        cout << ",\"lastThreeMidi\":[";

        for (size_t k = start; k < phrase.size(); k++) {
            if (k > start) cout << ",";
            cout << phrase[k].midi;
        }

        cout << "]";

        cout << ",\"finalPitch\":"
             << jsonString(finalNote.pitch);

        cout << ",\"finalDegree\":"
             << jsonString(finalNote.degree);

        cout << ",\"finalMidi\":"
             << finalNote.midi;

        cout << ",\"cadenceType\":"
             << jsonString(classifyCadence(phrase));

        cout << "}";

        phrase.clear();
        active = false;
    };

    for (int i = 0; i < analyzed.getLineCount(); i++) {

        if (analyzed[i].isBarline()) {
            measure = *analyzed.token(i, 0);
            continue;
        }

        if (analyzed[i].isInterpretation()) {

            for (int j = 0;
                 j < analyzed[i].getFieldCount(); j++) {

                HTp token = analyzed.token(i, j);
                string text = *token;

                if (text.find("*pline:") == 0)
                    activeLineType = "pline";

                if (text.find("*rline:") == 0)
                    activeLineType = "rline";

                if (token->isKern() &&
                    text.size() >= 3 &&
                    text.back() == ':' &&
                    string("ABCDEFGabcdefg")
                        .find(text[1]) != string::npos) {

                    bool minor = islower(
                        static_cast<unsigned char>(text[1])
                    );

                    key = text.substr(1, text.size() - 2);
                    key[0] = toupper(
                        static_cast<unsigned char>(key[0])
                    );

                    for (char& c : key)
                        if (c == '-') c = 'b';

                    key += minor ? " minor" : " major";
                }
            }

            continue;
        }

        if (!analyzed[i].isData())
            continue;

        HTp note = nullptr;
        HTp degree = nullptr;

        for (int j = 0;
             j < analyzed[i].getFieldCount(); j++) {

            HTp token = analyzed.token(i, j);

            if (token->isKern() && !note)
                note = token;

            if (token->isDataType("**deg") && !degree)
                degree = token;
        }

        if (!note || note->isNull())
            continue;

        string kern = *note;

        // Preserve existing phrase-start behavior.
        if (kern.find('{') != string::npos) {

            if (active)
                finishSegment();

            phrase.clear();
            active = true;
            segmentLineType = activeLineType;
        }

        // Only collect independent note attacks.
        if (active &&
            !note->isRest() &&
            Convert::isKernNoteAttack(kern)) {

            phrase.push_back({
                pitchName(Convert::kernToSciPitch(kern)),
                degree ? degreeName(*degree) : "?",
                Convert::kernToMidiNoteNumber(kern),
                Convert::kernToBase40(kern),
                measure
            });
        }

        // Phrase may end on a rest or a tied note.
        if (active &&
            kern.find('}') != string::npos) {

            finishSegment();
        }
    }

    if (active)
        cerr << "Warning: Unclosed phrase detected\n";

    cout << "\n]\n";

    return 0;
}
