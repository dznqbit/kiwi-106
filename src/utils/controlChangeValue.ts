import { KiwiPatch } from "../types/KiwiPatch";
import { MidiCcValue } from "../types/Midi";
import { objectKeys } from "./objectKeys";

export const controlChangeValue = <V extends KiwiPatch[keyof KiwiPatch]>(
  ccData: MidiCcValue,
  ccValues: Record<V, MidiCcValue[]>
): V | undefined => {
  return objectKeys(ccValues).find((k) => {
    const [loBound, hiBound] = ccValues[k];
    if (ccData >= loBound && ccData <= hiBound) {
      return true;
    }
  });
};
