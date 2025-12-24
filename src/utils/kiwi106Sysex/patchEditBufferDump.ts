import { Kiwi106SysexPatchEditBufferDumpCommand } from "../../types/Kiwi106Sysex";
import {
  ChorusMode,
  KiwiPatch,
  LfoMode,
  LfoSource,
  PwmControlSource,
  VcaMode,
} from "../../types/KiwiPatch";
import { MidiMessage } from "../../types/Midi";
import { dcoRangeSysexValues, dcoWaveSysexValues } from "../kiwiMidi";
import { objectKeys } from "../objectKeys";
import { isKiwi106SysexMessage, pack12Bit } from "../sysexUtils";
import { trimMidiCcValue } from "../trimMidiCcValue";

/** Build the sysex DATA for a Patch Edit Buffer Dump
 * Omits:
 * - sysex headers
 * - 2 null bytes
 */
export const buildKiwi106PatchEditBufferSysexDump = (
  _kiwiPatch: KiwiPatch
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
  m: MidiMessage
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
      (k) => dcoRangeSysexValues[k] == dcoRangeBytes
    ) ?? "4";
  const dcoWaveBytes = dataBytes[20] & 0b1100;
  const dcoWave =
    objectKeys(dcoWaveSysexValues).find(
      (k) => dcoWaveSysexValues[k] == dcoWaveBytes
    ) ?? "off";

  // These values come over as a 12-bit amount, but we store as 7-bit
  const dcoEnvelopeModAmount = trimMidiCcValue(
    pack12Bit(dataBytes[21], dataBytes[22]) >> 5
  );
  const dcoLfoModAmount = trimMidiCcValue(
    pack12Bit(dataBytes[23], dataBytes[24]) >> 5
  );
  const dcoBendAmount = trimMidiCcValue(
    pack12Bit(dataBytes[25], dataBytes[26]) >> 5
  );
  const lfoModWheelAmount = trimMidiCcValue(
    pack12Bit(dataBytes[27], dataBytes[28]) >> 5
  );
  const dcoPwmModAmount = trimMidiCcValue(
    pack12Bit(dataBytes[29], dataBytes[30]) >> 5
  );

  // Byte 31 DCO Control
  // Byte ??: 0000000u
  // Byte 31: 0vwxxxyz
  // z = DCOENV(0=ENV1,1=ENV2)
  // y = DCOLFO(0=LFO1,1=LFO2)
  // xxx = PWM Source
  // 000=Manual
  // 001=LFO1
  // 010=LFO2
  // 011=ENV1
  // 100=ENV2
  // w = DCO ENV(0=Norm,1=Inverted)
  // v = PWM ENV(0=Norm,1=Inverted)
  // u = LFO POL(0=Norm,1=Inverted)
  const dcoControlByte = dataBytes[31];
  console.log("DCO Control Byte", dcoControlByte.toString(2));
  // const dcoEnvelope = dcoControlByte & 0b0010_0000;
  // const dcoEnvelopeSource = dcoControlByte & 0b0000_0001;

  const pwmEnvelope = dcoControlByte & 0b0100_0000;
  const pwmSource = dcoControlByte & 0b0001_1100;
  const pwmControlSourceMap: Record<number, PwmControlSource | undefined> = {
    0b0000: "manual",
    0b0001: "lfo1",
    0b0010: "lfo2",
    0b0011: "env1",
    0b0100: "env2",
    0b1011: "env1-inverted",
    0b1100: "env2-inverted",
  };

  const dcoPwmControl: PwmControlSource =
    pwmControlSourceMap[(pwmEnvelope >> 3) & (pwmSource >> 2)] ?? "manual";

  // docs suggest that there's an extra byte (???) that controls LFO Polarity control...
  // but we're going to ignore that for now.
  const dcoLfoSource: LfoSource =
    (dcoControlByte & 0b0000_0010) === 0 ? "lfo1" : "lfo2";

  const lfo1Mode: LfoMode =
    (dataBytes[77] & 0b0000_0001) === 1 ? "plus" : "normal";
  const chorusModeMap: Record<number, ChorusMode> = {
    0: "off",
    1: "chorus1",
    2: "chorus2",
  };
  const chorusMode = chorusModeMap[dataBytes[78]];

  const lfo2Mode: LfoMode =
    (dataBytes[103] & 0b0000_0001) === 1 ? "plus" : "normal";

  const vcaModeMap: Record<number, VcaMode> = {
    0: "env1",
    1: "gate",
    2: "env2",
    3: "gate"
  };
  const vcaMode: VcaMode = vcaModeMap[dataBytes[83] & 0b0000_0011];

  // Helper to combine hi/lo bytes into 12-bit value and convert to MidiCcValue
  // const portamentoTime = combine12BitToMidi(94, 95);

  const kiwiPatch: KiwiPatch = {
    patchName,
    portamentoTime: 0,
    volume: 0,
    dcoRange,
    dcoWave,
    dcoPwmModAmount,
    dcoPwmControl,
    dcoLfoModAmount,
    dcoLfoSource,
    dcoEnvelopeModAmount,
    dcoEnvelopeSource: "env1",
    lfo1Wave: "sine",
    lfo1Rate: 0,
    lfo1Delay: 0,
    lfo2Wave: "sine",
    lfo2Rate: 0,
    lfo2Delay: 0,
    lfo1Mode,
    lfo2Mode,
    subLevel: 0,
    noiseLevel: 0,
    vcfLowPassCutoff: 0,
    vcfLowPassResonance: 0,
    vcfPitchFollow: 0,
    vcfHiPassCutoff: 0,
    vcfLfoModAmount: 0,
    vcfLfoSource: "lfo1",
    vcfEnvelopeModAmount: 0,
    vcfEnvelopeSource: "env1",
    env1Attack: 0,
    env1Decay: 0,
    env1Sustain: 0,
    env1Release: 0,
    chorusMode,
    vcaLfoModAmount: 0,
    vcaLfoSource: "lfo1",
    vcaMode,
    env2Attack: 0,
    env2Decay: 0,
    env2Sustain: 0,
    env2Release: 0,
    dcoBendAmount,
    vcfBendAmount: 0,
    lfoModWheelAmount,
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
