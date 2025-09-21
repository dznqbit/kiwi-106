import { Kiwi106SysexPatchEditBufferDumpCommand } from "../../types/Kiwi106Sysex";
import { KiwiPatch } from "../../types/KiwiPatch";
import { MidiMessage } from "../../types/Midi";
import { dcoRangeSysexValues } from "../kiwiMidi";
import { objectKeys } from "../objectKeys";
import { isKiwi106SysexMessage } from "../sysexUtils";

/** Build the sysex DATA for a Patch Edit Buffer Dump
 * Omits:
 * - sysex headers
 * - 2 null bytes
 */
export const buildKiwi106PatchEditBufferSysexDump = (
  _kiwiPatch: KiwiPatch,
): number[] => {
  // This is the patch data sysex ONLY!
  // This skips the sysex headers and the "2 null bytes"
  const simplePatchDumpSysex: number[] = [
    // "yahoo"
    121, 97, 104, 111, 111,

    0x73, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
    0x20, 0x20, 0x20, 0x0c, 0x00, 0x00, 0x01, 0x00, 0x1f, 0x68, 0x00, 0x00,
    0x1a, 0x22, 0x00, 0x00, 0x00, 0x02, 0x30, 0x00, 0x12, 0x34, 0x00, 0x00,
    0x03, 0x6c, 0x00, 0x00, 0x01, 0x70, 0x00, 0x20, 0x00, 0x00, 0x00, 0x0c,
    0x54, 0x1f, 0x63, 0x00, 0x00, 0x00, 0x14, 0x03, 0x44, 0x13, 0x6f, 0x00,
    0x00, 0x00, 0x02, 0x14, 0x2c, 0x17, 0x3c, 0x00, 0x0d, 0x41, 0x11, 0x44,
    0x00, 0x00, 0x1c, 0x24, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00,
  ];

  return simplePatchDumpSysex;
};

/** Parse a complete Midi Message into a kiwi106 Patch Edit Buffer Dump */
export const parseKiwi106PatchEditBufferSysexDump = (
  m: MidiMessage,
): Kiwi106SysexPatchEditBufferDumpCommand => {
  if (!isKiwi106SysexMessage(m, "Patch Edit Buffer Dump")) {
    throw new Error("Message is not a Kiwi-106 Patch Edit Buffer Dump Command");
  }

  // Slice out the sysex header + 2 null bytes and now we can use the same indices from buildKiwi106PatchEditBufferSysexDump
  const dataBytes = m.data.slice(10);

  // Extract patch name (20 ASCII bytes)
  const patchNameBytes = dataBytes.slice(0, 20);
  const patchName = String.fromCharCode(...patchNameBytes)
    .replace(/\0/g, "")
    .trim();

  // DCO Wave/Range 0000zyxx
  // xx = DCO Range 00=16' 01=8' 10=4'
  // y = Saw On/Off
  // z = Pulse On/Off
  const dcoRangeBytes = dataBytes[20] & 0b11;
  const dcoRange =
    objectKeys(dcoRangeSysexValues).find(
      (k) => dcoRangeSysexValues[k] == dcoRangeBytes,
    ) ?? "4";

  // const dcoSawEnabled = dataBytes[20] & 0b100;
  // const dcoWaveEnabled = dataBytes[20] & 0b1000;

  // Helper to combine hi/lo bytes into 12-bit value and convert to MidiCcValue
  // const portamentoTime = combine12BitToMidi(94, 95);

  const kiwiPatch: KiwiPatch = {
    patchName,
    portamentoTime: 0,
    volume: 0,
    dcoRange,
    dcoWave: 0,
    dcoPwmModAmount: 0,
    dcoPwmControl: 0,
    dcoLfoModAmount: 0,
    dcoLfoSource: 0,
    dcoEnvelopeModAmount: 0,
    dcoEnvelopeSource: 0,
    lfoMode: 0,
    lfo1Wave: 0,
    lfo1Rate: 0,
    lfo1Delay: 0,
    lfo2Wave: 0,
    lfo2Rate: 0,
    lfo2Delay: 0,
    lfo1Mode: 0,
    lfo2Mode: 0,
    subLevel: 0,
    noiseLevel: 0,
    vcfLowPassCutoff: 0,
    vcfLowPassResonance: 0,
    vcfPitchFollow: 0,
    vcfHiPassCutoff: 0,
    vcfLfoModAmount: 0,
    vcfLfoSource: 0,
    vcfEnvelopeModAmount: 0,
    vcfEnvelopeSource: 0,
    env1Attack: 0,
    env1Decay: 0,
    env1Sustain: 0,
    env1Release: 0,
    chorusMode: 0,
    vcaLfoModAmount: 0,
    vcaLfoSource: 0,
    vcaMode: 0,
    env2Attack: 0,
    env2Decay: 0,
    env2Sustain: 0,
    env2Release: 0,
    dcoBendAmount: 0,
    vcfBendAmount: 0,
    lfoModWheelAmount: 0,
    keyMode: 0,
    keyAssignDetune: 0,
    keyAssignDetuneMode: 0,
  };

  return {
    command: "Patch Edit Buffer Dump",
    kiwiPatch,
    data: m.data,
    message: m,
    isValid: true,
  };
};
