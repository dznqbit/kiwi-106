import { describe, it, expect } from 'vitest';
import { noteLabel } from './noteLabel';

describe('noteLabel', () => {
    it('should return the correct note label for a given MIDI note number', () => {
        expect(noteLabel(0)).toBe('C-1');
        expect(noteLabel(12)).toBe('C0');
        expect(noteLabel(23)).toBe('B0');
        expect(noteLabel(24)).toBe('C1');
        expect(noteLabel(60)).toBe('C4');
    });
});
