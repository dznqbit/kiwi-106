import { MidiCcValue } from "./Midi";

export interface KiwiPatch {
  portamentoTime: MidiCcValue;
  volume: MidiCcValue;
}