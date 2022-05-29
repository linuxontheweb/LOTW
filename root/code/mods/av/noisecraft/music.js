import { assert } from './utils.js';

// Constants and note representation
//«
//MIDI clock pulses per quarter note
export const CLOCK_PPQ = 24;

//MIDI clock pulses per 16th note
export const CLOCK_PPS = CLOCK_PPQ / 4;

//Number of MIDI notes
export const NUM_NOTES = 128;

//Number of notes per octave
export const NOTES_PER_OCTAVE = 12;

//Number of cents per octave
export const CENTS_PER_OCTAVE = 1200;

//Frequency of the A4 note
export const A4_NOTE_FREQ = 440;

export const A4_NOTE_NO = 69;

//Note number of the C4 note
export const C4_NOTE_NO = 71;

//»

//Mapping from note names to pitch classes
export const NOTE_NAME_PC = {//«
    'C' : 0,
    'C#': 1,
    'D' : 2,
    'D#': 3,
    'E' : 4,
    'F' : 5,
    'F#': 6,
    'G' : 7,
    'G#': 8,
    'A' : 9,
    'A#': 10,
    'B' : 11
};//»

//Mapping from pitch classes to note names
export const PC_NOTE_NAME = {//«
    0   : 'C',
    1   : 'C#',
    2   : 'D',
    3   : 'D#',
    4   : 'E',
    5   : 'F',
    6   : 'F#',
    7   : 'G',
    8   : 'G#',
    9   : 'A',
    10  : 'A#',
    11  : 'B'
};//»

//Note«

export function Note(val){//«
/**
@class Represents note values.

Midi note numbers go from 0 to 127.

A4 is tuned to 440Hz, and corresponds to midi note 69.

F(n) = 440 * (2^(1/12))^(n - 69)
     = 440 * 2 ^ ((n-69)/12)
*/
    // If we got a note name, convert it to a note number
    if (typeof val === 'string')
        val = Note.nameToNo(val);

    assert (
        typeof val === 'number',
        'invalid note number'
    );

    if (Note.notesByNo[val] !== undefined)
        return Note.notesByNo[val];

    // Create a note object
    var note = Object.create(Note.prototype);
    note.noteNo = val;

    // Store the note object in the note table
    Note.notesByNo[val] = note;

    return note;
}//»

//Array of note numbers to note objects
Note.notesByNo = [];

Note.nameToNo = function (name){//«
/**
Get the note number for a note name
*/
    // Use a regular expression to parse the name
    var matches = name.match(/([A-G]#?)([0-9])/i);

    assert (
        matches !== null,
        'invalid note name: "' + name + '"'
    );

    var namePart = matches[1];
    var numPart = matches[2];

    var pc = NOTE_NAME_PC[namePart];

    assert (
        typeof pc === 'number',
        'invalid note name: ' + namePart
    );

    var octNo = parseInt(numPart);

    // Compute the note number
    var noteNo = (octNo + 1) * NOTES_PER_OCTAVE + pc;

    assert (
        noteNo >= 0 || noteNo < NUM_NOTES,
        'note parsing failed'
    );

    return noteNo;
}//»

Note.sortFn = function (n1, n2){//«
/**
Sorting function for note objects
*/
    return n1.noteNo - n2.noteNo;
}//»

Note.prototype.getPC = function (){//«
/**
Get the pitch class
*/
    return this.noteNo % NOTES_PER_OCTAVE;
}//»

Note.prototype.getOctNo = function (){//«
/**
Get the octave number for a note
*/
    return Math.floor(this.noteNo / NOTES_PER_OCTAVE) - 1;
}//»

Note.prototype.getName = function (){//«
/**
Get the name for a note
*/
    // Compute the octave number of the note
    var octNo = this.getOctNo();

    // Get the pitch class for this note
    var pc = this.getPC();

    var name = PC_NOTE_NAME[pc];

    // Add the octave number to the note name
    name += String(octNo);

    return name;
}//»

//The string representation of a note is its name
Note.prototype.toString = Note.prototype.getName;

Note.prototype.getFreq = function (offset){//«
/**
Get the frequency for a note
@param offset detuning offset in cents
*/
    if (offset === undefined)
        offset = 0;

    // F(n) = 440 * 2 ^ ((n-69)/12)
    var noteExp = (this.noteNo - A4_NOTE_NO) / NOTES_PER_OCTAVE;

    // b = a * 2 ^ (o / 1200)
    var offsetExp = offset / CENTS_PER_OCTAVE;

    // Compute the note frequency
    return A4_NOTE_FREQ * Math.pow(
        2,
        noteExp + offsetExp
    );
}//»

Note.prototype.offset = function (numSemis){//«
/**
Offset a note by a number of semitones
*/
    var offNo = this.noteNo + numSemis;

    assert (
        offNo >= 0 && offNo < NUM_NOTES,
        'invalid note number after offset'
    );

    return new Note(offNo);
}//»

Note.prototype.shift = function (numOcts){//«
/**
Shift a note to higher or lower octaves
*/
    return this.offset(numOcts * NOTES_PER_OCTAVE);
}//»

//»

//Interval consonance table//«
var intervCons = {
    0 :  3, // Unison
    1 : -3, // Minor second
    2 : -1, // Major second

    3 :  3, // Minor third
    4 :  3, // Major third
    5 :  1, // Perfect fourth

    6 : -1, // Tritone
    7 :  3, // Perfect fifth
    8 :  1, // Minor sixth

    9 :  2, // Major sixth
    10: -1, // Minor seventh
    11: -2  // Major seventh
};//»
export function consonance(n1, n2){//«
/**
Consonance rating function for two notes
*/
    var no1 = n1.noteNo;
    var no2 = n2.noteNo;

    var diff = Math.max(no1 - no2, no2 - no1);

    // Compute the simple interval between the two notes
    var interv = diff % 12;

    return intervCons[interv];
}//»

// Scale and chord generation//«

//Semitone intervals for different scales
var scaleIntervs = {//«
    'major': [2, 2, 1, 2, 2, 2],
    'natural minor': [2, 1, 2, 2, 1, 2],
    'harmonic minor': [2, 1, 2, 2, 1, 3],
    'major pentatonic': [2, 2, 3, 2],
    'minor pentatonic': [3, 2, 2, 3],
    'blues': [3, 2, 1, 1, 3],
    'chromatic': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
};//»

//List of scale names
export const SCALE_NAMES = Object.keys(scaleIntervs);

export function genScale(rootNote, scale, numOctaves){//«
/**
Generate the notes of a scale based on a root note
*/
    if ((rootNote instanceof Note) === false)
        rootNote = new Note(rootNote);

    if (numOctaves === undefined)
        numOctaves = 1;

    // Get the intervals for this type of chord
    var intervs = scaleIntervs[scale];

    assert (
        intervs instanceof Array,
        'invalid scale name: ' + scale
    );

    // List of generated notes
    var notes = [];

    // For each octave
    for (var octNo = 0; octNo < numOctaves; ++octNo)
    {
        var octRoot = rootNote.shift(octNo);

        // Add the root note to the scale
        notes.push(octRoot);

        // Add the scale notes
        for (var i = 0; i < intervs.length; ++i)
        {
            var prevNote = notes[notes.length-1];

            var interv = intervs[i];

            notes.push(prevNote.offset(interv));
        }
    }

    // Add the note closing the last octave
    notes.push(rootNote.shift(numOctaves));

    return notes;
}//»

//Semitone intervals for different kinds of chords
var chordIntervs = {//«

    // Major chord
    'maj':  [0, 4, 7],

    // Minor chord
    'min':  [0, 3, 7],

    // Diminished chord
    'dim':  [0, 3, 6],

    // Major 7th
    'maj7': [0, 4, 7, 11],

    // Minor 7th
    'min7': [0, 3, 7, 10],

    // Diminished 7th chord
    'dim7': [0, 3, 6, 9],

    // Dominant 7th
    '7':    [0, 4, 7, 10],

    // Suspended 4th
    'sus4': [0, 5, 7],

    // Suspended second
    'sus2': [0, 2, 7]
};//»

export function genChord(rootNote, type){//«
//Generate a list of notes for a chord
    if ((rootNote instanceof Note) === false)
        rootNote = new Note(rootNote);

    // Get the intervals for this type of chord
    var intervs = chordIntervs[type];

    assert (
        intervs instanceof Array,
        'invalid chord type: ' + type
    );

    // Get the root note number
    var rootNo = rootNote.noteNo;

    // Compute the note numbers for the notes
    var notes = intervs.map(function (i) { return new Note(rootNo + i); });

    return notes;
}//»

//»

