// Local convenience types

import { IntRange } from "./IntRange";

export type MidiMessageType = "noteon" | "noteoff" | "controlchange" | "programchange" | "pitchbend";
export type MidiCcValue = IntRange<0, 127>