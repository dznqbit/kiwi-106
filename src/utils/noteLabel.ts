export const noteLabel = (note: number): string => {
    const octave = Math.floor(note / 12) - 1;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteName = noteNames[note % 12];
    return `${noteName}${octave}`;
}
