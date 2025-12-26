import { Kiwi106SysexPatchEditBufferDumpCommand } from "../../types/Kiwi106Sysex";
import {
  ChorusMode,
  DcoRange,
  DcoWave,
  DetuneMode as DetuneMode,
  EnvelopeSource,
  KeyMode,
  KiwiPatch,
  LfoMode,
  LfoSource,
  PwmControlSource,
  VcaMode,
} from "../../types/KiwiPatch";
import { MidiCcValue, MidiMessage } from "../../types/Midi";
import { objectKeys } from "../objectKeys";
import { isKiwi106SysexMessage, pack12Bit, unpack12Bit } from "../sysexUtils";
import { trimMidiCcValue } from "../trimMidiCcValue";

const dcoRangeSysexValues: Record<DcoRange, MidiCcValue> = {
  "16": 0b00,
  "8": 0b01,
  "4": 0b10,
};

const dcoWaveSysexValues: Record<DcoWave, MidiCcValue> = {
  off: 0,
  ramp: 4,
  pulse: 8,
  "ramp-and-pulse": 12,
};

const dcoEnvelopeSysexValues: Record<EnvelopeSource, MidiCcValue> = {
  "env1": 0b0000_0000,
  "env2": 0b0000_0001,
  "env1-inverted": 0b0010_0000,
  "env2-inverted": 0b0010_0001,
};

const pwmControlSourceSysexValues: Record<PwmControlSource, MidiCcValue> = {
  "manual": 0b0000_0000,
  "lfo1": 0b0000_0100,
  "lfo2": 0b0000_1000,
  "env1": 0b0000_1100,
  "env2": 0b0001_0000,
  "env1-inverted": 0b0100_1100,
  "env2-inverted": 0b0101_0000,
};

const keyModeSysexValues: Record<KeyMode, MidiCcValue> = {
  "poly1": 0,
  "poly2": 1,
  "unison-legato": 2,
  "mono-legato": 4,
  "mono-staccato": 5,
};

const keyAssignDetuneModeSysexValues: Record<DetuneMode, MidiCcValue> = {
  "mono": 0,
  "all": 1,
};

const vcfLfoSourceSysexValues: Record<LfoSource, MidiCcValue> = {
  "lfo1": 0b0000_0000,
  "lfo2": 0b0000_0010,
  "lfo1-inverted": 0b0000_1000,
  "lfo2-inverted": 0b0000_1010,
};

const vcfEnvelopeSourceSysexValues: Record<EnvelopeSource, MidiCcValue> = {
  "env1": 0,
  "env2": 1,
  "env1-inverted": 4,
  "env2-inverted": 5,
};

type LfoWave = "sine" | "triangle" | "sawtooth" | "reverse-sawtooth" | "square" | "random";
const lfoWaveformSysexValues: Record<LfoWave, MidiCcValue> = {
  "sine": 0,
  "triangle": 1,
  "square": 2,
  "sawtooth": 3,
  "reverse-sawtooth": 4,
  "random": 5,
};

const chorusModeSysexValues: Record<ChorusMode, MidiCcValue> = {
  "off": 0,
  "chorus1": 1,
  "chorus2": 2,
};

const vcaModeSysexValues: Record<VcaMode, MidiCcValue> = {
  "env1": 0,
  "gate": 1,
  "env2": 2,
};

const vcaLfoSourceSysexValues: Record<LfoSource, MidiCcValue> = {
  "lfo1": 0,
  "lfo2": 4,
  "lfo1-inverted": 16,
  "lfo2-inverted": 20,
};

/** Build the sysex DATA for a Patch Edit Buffer Dump
 * Omits:
 * - sysex headers
 * - 2 null bytes
 */
export const buildKiwi106PatchEditBufferSysexDump = (
  kiwiPatch: KiwiPatch
): number[] => {
  const b2a = (a: MidiCcValue[], b: MidiCcValue[], i: number) => {
    for (let j = 0; j < b.length; j++) {
      a[i + j] = b[j];
    }
  };

  // Convert 7-bit MIDI CC values to 12-bit sysex values (inverse of parse's convert12bitTo7Bit)
  const convert7BitTo12Bit = (n: number) => n << 5;
  const b2c = (n: MidiCcValue) => unpack12Bit(convert7BitTo12Bit(n)).map(trimMidiCcValue)

  const ccv = trimMidiCcValue
  // THIS IS THE PATCH DATA ONLY!
  // This skips the sysex headers and the "2 null bytes"
  const patchDumpSysex: MidiCcValue[] = new Array(128).fill(0);

  const patchNameBytes = [...new Array(20)].map((_, i) => {
    const cc = kiwiPatch.patchName.charCodeAt(i);
    return Number.isNaN(cc) ? 32 : trimMidiCcValue(cc);
  });
  b2a(patchDumpSysex, patchNameBytes, 0);
  patchDumpSysex[20] = ccv(dcoRangeSysexValues[kiwiPatch.dcoRange] | dcoWaveSysexValues[kiwiPatch.dcoWave]);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoEnvelopeModAmount), 21);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoLfoModAmount), 23);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoBendAmount), 25);
  b2a(patchDumpSysex, b2c(kiwiPatch.lfoModWheelAmount), 27);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoPwmModAmount), 29);
  patchDumpSysex[31] = trimMidiCcValue(dcoEnvelopeSysexValues[kiwiPatch.dcoEnvelopeSource] | pwmControlSourceSysexValues[kiwiPatch.dcoPwmControl])
  b2a(patchDumpSysex, b2c(kiwiPatch.subLevel), 32);
  b2a(patchDumpSysex, b2c(kiwiPatch.noiseLevel), 34);
  patchDumpSysex[36] = kiwiPatch.vcfHiPassCutoff;
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfLowPassCutoff), 37);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfLowPassResonance), 39);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfLfoModAmount), 41);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfEnvelopeModAmount), 43);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfPitchFollow), 45);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfBendAmount), 47);

  return patchDumpSysex;
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

  // Sysex values come over as a 12-bit amount, but we store as 7-bit (for now)
  const convert12bitTo7Bit = (n: number) => n >> 5;

  // Consolidate repetitive operation for handling 2-byte sysex values
  const c2b = (b1: number, b2: number) =>
    trimMidiCcValue(convert12bitTo7Bit(pack12Bit(b1, b2)));

  const dcoEnvelopeModAmount = c2b(dataBytes[21], dataBytes[22]);
  const dcoLfoModAmount = c2b(dataBytes[23], dataBytes[24]);
  const dcoBendAmount = c2b(dataBytes[25], dataBytes[26]);
  const lfoModWheelAmount = c2b(dataBytes[27], dataBytes[28]);
  const dcoPwmModAmount = c2b(dataBytes[29], dataBytes[30]);

  // Byte 31 DCO Control
  // Byte ??: 0000000u
  // Byte 31: 0vwxxxyz
  // w = DCO ENV (0=Norm,1=Inverted)
  // z = DCO ENV (0=ENV1,1=ENV2)
  // y = DCOLFO(0=LFO1,1=LFO2)
  // xxx = PWM Source
  // 000=Manual
  // 001=LFO1
  // 010=LFO2
  // 011=ENV1
  // 100=ENV2
  // v = PWM ENV(0=Norm,1=Inverted)
  // u = LFO POL(0=Norm,1=Inverted)
  const dcoControlByte = dataBytes[31];
  const dcoEnvelopeMap: Record<number, EnvelopeSource> = {
    0: "env1",
    1: "env2",
    32: "env1-inverted",
    33: "env2-inverted",
  };
  const dcoEnvelopeSource: EnvelopeSource =
    dcoEnvelopeMap[dcoControlByte & 0b0010_0001];

  const dcoLfoSource: LfoSource =
    (dcoControlByte & 0b0000_0010) === 0 ? "lfo1" : "lfo2";

  const pwmControlSourceMap: Record<number, PwmControlSource | undefined> = {
    0b0000_0000: "manual",
    0b0000_0100: "lfo1",
    0b0000_1000: "lfo2",
    0b0000_1100: "env1",
    0b0001_0000: "env2",
    0b0100_1100: "env1-inverted",
    0b0101_0000: "env2-inverted",
  };

  const dcoPwmControl: PwmControlSource =
    pwmControlSourceMap[dcoControlByte & 0b0101_1100] ?? "manual";

  const keyModeMap: Record<number, KeyMode> = {
    0: "poly1",
    1: "poly2",
    2: "unison-legato",
    3: "unison-legato",
    4: "mono-legato",
    5: "mono-staccato",
  };
  const keyMode: KeyMode = keyModeMap[dataBytes[89]];
  const keyAssignDetune = c2b(dataBytes[90], dataBytes[91]);

  const keyAssignDetuneModeMap: Record<number, DetuneMode> = {
    0: "mono",
    1: "all",
  };
  const keyAssignDetuneMode = keyAssignDetuneModeMap[dataBytes[92]];

  const subLevel = c2b(dataBytes[32], dataBytes[33]);
  const noiseLevel = c2b(dataBytes[34], dataBytes[35]);
  const vcfHiPassCutoff = trimMidiCcValue(dataBytes[36] & 0b11); // HPF Level (2 bits)
  const vcfLowPassCutoff = c2b(dataBytes[37], dataBytes[38]);
  const vcfLowPassResonance = c2b(dataBytes[39], dataBytes[40]);
  const vcfLfoModAmount = c2b(dataBytes[41], dataBytes[42]);
  const vcfEnvelopeModAmount = c2b(dataBytes[43], dataBytes[44]);
  const vcfPitchFollow = c2b(dataBytes[45], dataBytes[46]);
  const vcfBendAmount = c2b(dataBytes[47], dataBytes[48]);

  // 0000wxyz
  // w = LFO(0=Norm,1=Inverted)
  // y = VCFLFO(0=LFO1,1=LFO2)
  // x = Env(0=Norm,1=Inverted)
  // z = VCFEnv(0=Env1,1=ENV2)
  const vcfControlByte = dataBytes[49];
  const vcfLfoSourceMap: Record<number, LfoSource> = {
    0b0000_0000: "lfo1",
    0b0000_0010: "lfo2",
    0b0000_1000: "lfo1-inverted",
    0b0000_1010: "lfo2-inverted",
  };
  const vcfLfoSource: LfoSource = vcfLfoSourceMap[vcfControlByte & 0b0000_1010];
  const vcfEnvelopeSourceMap: Record<number, EnvelopeSource> = {
    0: "env1",
    1: "env2",
    4: "env1-inverted",
    5: "env2-inverted",
  };
  const vcfEnvelopeSource = vcfEnvelopeSourceMap[vcfControlByte & 0b0000_0001];

  const env1Attack = c2b(dataBytes[50], dataBytes[51]);
  const env1Decay = c2b(dataBytes[52], dataBytes[53]);
  const env1Sustain = c2b(dataBytes[54], dataBytes[55]);
  const env1Release = c2b(dataBytes[56], dataBytes[57]);

  const env2Attack = c2b(dataBytes[58], dataBytes[59]);
  const env2Decay = c2b(dataBytes[60], dataBytes[61]);
  const env2Sustain = c2b(dataBytes[62], dataBytes[63]);
  const env2Release = c2b(dataBytes[64], dataBytes[65]);

  const lfoWaveformMap: Record<
    number,
    "sine" | "triangle" | "sawtooth" | "reverse-sawtooth" | "square" | "random"
  > = {
    0: "sine",
    1: "triangle",
    2: "square",
    3: "sawtooth",
    4: "reverse-sawtooth",
    5: "random",
  };
  const lfo1Wave = lfoWaveformMap[dataBytes[67] & 0b111] ?? "sine";
  const lfo1Rate = c2b(dataBytes[68], dataBytes[69]);
  const lfo1Delay = c2b(dataBytes[70], dataBytes[71]);
  const lfo1Mode: LfoMode =
    (dataBytes[77] & 0b0000_0001) === 1 ? "plus" : "normal";

  const lfo2Wave = lfoWaveformMap[dataBytes[72] & 0b111] ?? "sine";
  const lfo2Rate = c2b(dataBytes[73], dataBytes[74]);
  const lfo2Delay = c2b(dataBytes[75], dataBytes[76]);

  const chorusModeMap: Record<number, ChorusMode> = {
    0: "off",
    1: "chorus1",
    2: "chorus2",
  };
  const chorusMode = chorusModeMap[dataBytes[78]];

  const volume = c2b(dataBytes[79], dataBytes[80]);
  const vcaLfoModAmount = c2b(dataBytes[81], dataBytes[82]);

  const vcaModeMap: Record<number, VcaMode> = {
    0: "env1",
    1: "gate",
    2: "env2",
    3: "gate",
  };
  const vcaMode: VcaMode = vcaModeMap[dataBytes[83] & 0b0000_0011];

  const vcaControlByte = dataBytes[83];
  const vcaLfoSourceMap: Record<number, LfoSource> = {
    0: "lfo1",
    4: "lfo2",
    16: "lfo1-inverted",
    20: "lfo2-inverted",
  };
  const vcaLfoSource = vcaLfoSourceMap[vcaControlByte & 0b0001_0100];

  const portamentoTime = c2b(dataBytes[84], dataBytes[85]);

  const lfo2Mode: LfoMode =
    (dataBytes[103] & 0b0000_0001) === 1 ? "plus" : "normal";

  const kiwiPatch: KiwiPatch = {
    patchName,
    portamentoTime,
    volume,
    dcoRange,
    dcoWave,
    dcoPwmModAmount,
    dcoPwmControl,
    dcoLfoModAmount,
    dcoLfoSource,
    dcoEnvelopeModAmount,
    dcoEnvelopeSource,
    lfo1Wave,
    lfo1Rate,
    lfo1Delay,
    lfo2Wave,
    lfo2Rate,
    lfo2Delay,
    lfo1Mode,
    lfo2Mode,
    subLevel,
    noiseLevel,
    vcfLowPassCutoff,
    vcfLowPassResonance,
    vcfPitchFollow,
    vcfHiPassCutoff,
    vcfLfoModAmount,
    vcfLfoSource,
    vcfEnvelopeModAmount,
    vcfEnvelopeSource,
    env1Attack,
    env1Decay,
    env1Sustain,
    env1Release,
    chorusMode,
    vcaLfoModAmount,
    vcaLfoSource,
    vcaMode,
    env2Attack,
    env2Decay,
    env2Sustain,
    env2Release,
    dcoBendAmount,
    vcfBendAmount,
    lfoModWheelAmount,
    keyMode,
    keyAssignDetune,
    keyAssignDetuneMode,
  };

  return {
    command: "Patch Edit Buffer Dump",
    kiwiPatch,
    data: m.data,
    message: m,
    isValid: true,
  };
};
