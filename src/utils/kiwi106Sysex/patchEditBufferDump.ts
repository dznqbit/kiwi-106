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
  LfoWaveform,
  PortamentoMode,
  PwmControlSource,
  VcaMode,
} from "../../types/KiwiPatch";
import { MidiCcValue, MidiMessage } from "../../types/Midi";
import { isKiwi106SysexMessage, pack12Bit, unpack12Bit } from "../sysexUtils";
import { trimMidiCcValue } from "../trimMidiCcValue";

const ccv = trimMidiCcValue;

// Sysex values come over as a 12-bit amount, but we store as 7-bit (for now)
const convert12bitTo7Bit = (n: number) => n >> 5;

// Consolidate repetitive operation for handling 2-byte sysex values
const c2b = (b1: number, b2: number) =>
  ccv(convert12bitTo7Bit(pack12Bit(b1, b2)));

const invertRecord = <K extends string | number, V extends string | number>(
  record: Record<K, V>,
): Record<V, K> => {
  const inverted = {} as Record<V, K>;
  for (const key in record) {
    inverted[record[key]] = key;
  }
  return inverted;
};

const dcoRangeSysexValues: Record<DcoRange, MidiCcValue> = {
  "16": 0b00,
  "8": 0b01,
  "4": 0b10,
};

const sysexToDcoRange = invertRecord(dcoRangeSysexValues);

const dcoWaveSysexValues: Record<DcoWave, MidiCcValue> = {
  off: 0,
  ramp: 4,
  pulse: 8,
  "ramp-and-pulse": 12,
};

const sysexToDcoWave = invertRecord(dcoWaveSysexValues);

const dcoEnvelopeSysexValues: Record<EnvelopeSource, MidiCcValue> = {
  env1: 0b0000_0000,
  env2: 0b0000_0001,
  "env1-inverted": 0b0010_0000,
  "env2-inverted": 0b0010_0001,
};

const sysexToDcoEnvelope = invertRecord(dcoEnvelopeSysexValues);

const dcoLfoSourceSysexValues: Record<LfoSource, MidiCcValue> = {
  lfo1: 0b0000_0000,
  lfo2: 0b0000_0010,
  // Docs suggest there are 2 bytes available for DCO control
  // but byte structure doesn't really suggest that
  // In practice we & this with 0b10 so the inverted values should never happen
  "lfo1-inverted": 0b0000_0001,
  "lfo2-inverted": 0b0000_0011,
};

const sysexToDcoLfoSource = invertRecord(dcoLfoSourceSysexValues);

const pwmControlSourceSysexValues: Record<PwmControlSource, MidiCcValue> = {
  manual: 0b0000_0000,
  lfo1: 0b0000_0100,
  lfo2: 0b0000_1000,
  env1: 0b0000_1100,
  env2: 0b0001_0000,
  "env1-inverted": 0b0100_1100,
  "env2-inverted": 0b0101_0000,
};

const sysexToPwmControlSource = invertRecord(pwmControlSourceSysexValues);

const keyModeSysexValues: Record<KeyMode, MidiCcValue> = {
  poly1: 0,
  poly2: 1,
  "unison-legato": 2,
  "unison-staccato": 3,
  "mono-legato": 4,
  "mono-staccato": 5,
};

const sysexToKeyMode = invertRecord(keyModeSysexValues);
const vcfLfoSourceSysexValues: Record<LfoSource, MidiCcValue> = {
  lfo1: 0b0000_0000,
  lfo2: 0b0000_0010,
  "lfo1-inverted": 0b0000_1000,
  "lfo2-inverted": 0b0000_1010,
};

const sysexToVcfLfoSource = invertRecord(vcfLfoSourceSysexValues);

const vcfEnvelopeSourceSysexValues: Record<EnvelopeSource, MidiCcValue> = {
  env1: 0,
  env2: 1,
  "env1-inverted": 4,
  "env2-inverted": 5,
};

const sysexToVcfEnvelopeSource = invertRecord(vcfEnvelopeSourceSysexValues);

const lfoWaveformSysexValues: Record<LfoWaveform, MidiCcValue> = {
  sine: 0,
  triangle: 1,
  square: 2,
  sawtooth: 3,
  "reverse-sawtooth": 4,
  random: 5,
};
const sysexToLfoWaveform = invertRecord(lfoWaveformSysexValues);

const lfoModeSysexValues: Record<LfoMode, MidiCcValue> = {
  normal: 0,
  plus: 1,
};

const sysexToLfoMode = invertRecord(lfoModeSysexValues);

const chorusModeSysexValues: Record<ChorusMode, MidiCcValue> = {
  off: 0,
  chorus1: 1,
  chorus2: 2,
};

const sysexToChorusMode = invertRecord(chorusModeSysexValues);

const vcaModeSysexValues: Record<VcaMode, MidiCcValue> = {
  env1: 0,
  gate: 1,
  env2: 2,
};

const sysexToVcaMode = invertRecord(vcaModeSysexValues);

const vcaLfoSourceSysexValues: Record<LfoSource, MidiCcValue> = {
  lfo1: 0,
  lfo2: 4,
  "lfo1-inverted": 16,
  "lfo2-inverted": 20,
};
const sysexToVcaLfoSource = invertRecord(vcaLfoSourceSysexValues);

const portamentoModeSysexValues: Record<PortamentoMode, MidiCcValue> = {
  off: 0,
  on: 1,
};

const sysexToPortamentoMode = invertRecord(portamentoModeSysexValues);

const detuneModeSysexValues: Record<DetuneMode, MidiCcValue> = {
  mono: 0,
  all: 1,
};

const sysexToDetuneMode = invertRecord(detuneModeSysexValues);

/** Build the sysex DATA for a Patch Edit Buffer Dump
 * Omits:
 * - sysex headers
 * - 2 null bytes
 */
export const buildKiwi106PatchEditBufferSysexDump = (
  kiwiPatch: KiwiPatch,
): number[] => {
  const b2a = (a: MidiCcValue[], b: MidiCcValue[], i: number) => {
    for (let j = 0; j < b.length; j++) {
      a[i + j] = b[j];
    }
  };

  // Convert 7-bit MIDI CC values to 12-bit sysex values (inverse of parse's convert12bitTo7Bit)
  const convert7BitTo12Bit = (n: number) => n << 5;
  const b2c = (n: MidiCcValue) => unpack12Bit(convert7BitTo12Bit(n)).map(ccv);

  // THIS IS THE PATCH DATA ONLY!
  // This skips the sysex headers and the "2 null bytes"
  const patchDumpSysex: MidiCcValue[] = new Array(128).fill(0);

  const patchNameBytes = [...new Array(20)].map((_, i) => {
    const cc = kiwiPatch.patchName.charCodeAt(i);
    return Number.isNaN(cc) ? 32 : ccv(cc);
  });
  b2a(patchDumpSysex, patchNameBytes, 0);
  patchDumpSysex[20] = ccv(
    dcoRangeSysexValues[kiwiPatch.dcoRange] |
      dcoWaveSysexValues[kiwiPatch.dcoWave],
  );
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoEnvelopeModAmount), 21);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoLfoModAmount), 23);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoBendAmount), 25);
  b2a(patchDumpSysex, b2c(kiwiPatch.lfoModWheelAmount), 27);
  b2a(patchDumpSysex, b2c(kiwiPatch.dcoPwmModAmount), 29);
  patchDumpSysex[31] = ccv(
    dcoEnvelopeSysexValues[kiwiPatch.dcoEnvelopeSource] |
      pwmControlSourceSysexValues[kiwiPatch.dcoPwmControl] |
      dcoLfoSourceSysexValues[kiwiPatch.dcoLfoSource],
  );
  b2a(patchDumpSysex, b2c(kiwiPatch.subLevel), 32);
  b2a(patchDumpSysex, b2c(kiwiPatch.noiseLevel), 34);
  patchDumpSysex[36] = kiwiPatch.vcfHiPassCutoff;
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfLowPassCutoff), 37);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfLowPassResonance), 39);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfLfoModAmount), 41);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfEnvelopeModAmount), 43);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfPitchFollow), 45);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcfBendAmount), 47);
  // VCF Control - combines vcfLfoSource and vcfEnvelopeSource
  const vcfEnvBit = kiwiPatch.vcfEnvelopeSource.includes("env2") ? 1 : 0;
  patchDumpSysex[49] = ccv(
    vcfLfoSourceSysexValues[kiwiPatch.vcfLfoSource] | vcfEnvBit,
  );
  b2a(patchDumpSysex, b2c(kiwiPatch.env1Attack), 50);
  b2a(patchDumpSysex, b2c(kiwiPatch.env1Decay), 52);
  b2a(patchDumpSysex, b2c(kiwiPatch.env1Sustain), 54);
  b2a(patchDumpSysex, b2c(kiwiPatch.env1Release), 56);
  b2a(patchDumpSysex, b2c(kiwiPatch.env2Attack), 58);
  b2a(patchDumpSysex, b2c(kiwiPatch.env2Decay), 60);
  b2a(patchDumpSysex, b2c(kiwiPatch.env2Sustain), 62);
  b2a(patchDumpSysex, b2c(kiwiPatch.env2Release), 64);
  patchDumpSysex[67] = ccv(lfoWaveformSysexValues[kiwiPatch.lfo1Wave]);
  b2a(patchDumpSysex, b2c(kiwiPatch.lfo1Rate), 68);
  b2a(patchDumpSysex, b2c(kiwiPatch.lfo1Delay), 70);
  patchDumpSysex[72] = ccv(lfoWaveformSysexValues[kiwiPatch.lfo2Wave]);
  b2a(patchDumpSysex, b2c(kiwiPatch.lfo2Rate), 73);
  b2a(patchDumpSysex, b2c(kiwiPatch.lfo2Delay), 75);
  // Byte 77 LFO control
  // Partially implemented - we only allow free running for now
  patchDumpSysex[77] = lfoModeSysexValues[kiwiPatch.lfo1Mode];
  patchDumpSysex[78] = chorusModeSysexValues[kiwiPatch.chorusMode];
  b2a(patchDumpSysex, b2c(kiwiPatch.volume), 79);
  b2a(patchDumpSysex, b2c(kiwiPatch.vcaLfoModAmount), 81);
  // VCA Control combines vcaLfoSource and vcaMode
  patchDumpSysex[83] = ccv(
    vcaLfoSourceSysexValues[kiwiPatch.vcaLfoSource] |
      vcaModeSysexValues[kiwiPatch.vcaMode],
  );
  b2a(patchDumpSysex, b2c(kiwiPatch.portamentoTime), 84);
  patchDumpSysex[86] = portamentoModeSysexValues[kiwiPatch.portamentoMode];
  patchDumpSysex[89] = keyModeSysexValues[kiwiPatch.keyMode];
  b2a(patchDumpSysex, b2c(kiwiPatch.keyAssignDetune), 90);
  patchDumpSysex[92] = detuneModeSysexValues[kiwiPatch.keyAssignDetuneMode];
  patchDumpSysex[103] = lfoModeSysexValues[kiwiPatch.lfo2Mode];
  return patchDumpSysex;
};

/** Parse a complete Midi Message into a kiwi106 Patch Edit Buffer Dump */
export const parseKiwi106PatchEditBufferSysexDump = (
  m: MidiMessage,
): Kiwi106SysexPatchEditBufferDumpCommand => {
  if (!isKiwi106SysexMessage(m, "Patch Edit Buffer Dump")) {
    throw new Error("Message is not a Kiwi-106 Patch Edit Buffer Dump Command");
  }

  // Slice out the sysex header + 2 null bytes and now we can use the same indices from buildKiwi106PatchEditBufferSysexDump
  const dataBytes = m.data.slice(10).map(ccv);

  // Extract patch name (20 ASCII bytes)
  const patchNameBytes = dataBytes.slice(0, 20);
  const patchName = String.fromCharCode(...patchNameBytes)
    .replace(/\0/g, "")
    .trim();

  const dcoRange = sysexToDcoRange[ccv(dataBytes[20] & 0b11)];
  const dcoWave = sysexToDcoWave[ccv(dataBytes[20] & 0b1100)];
  const dcoEnvelopeModAmount = c2b(dataBytes[21], dataBytes[22]);
  const dcoLfoModAmount = c2b(dataBytes[23], dataBytes[24]);
  const dcoBendAmount = c2b(dataBytes[25], dataBytes[26]);
  const lfoModWheelAmount = c2b(dataBytes[27], dataBytes[28]);
  const dcoPwmModAmount = c2b(dataBytes[29], dataBytes[30]);

  const dcoControlByte = dataBytes[31];
  const dcoEnvelopeSource =
    sysexToDcoEnvelope[ccv(dcoControlByte & 0b0010_0001)];
  const dcoLfoSource = sysexToDcoLfoSource[ccv(dcoControlByte & 0b0000_0010)];
  const dcoPwmControl =
    sysexToPwmControlSource[ccv(dcoControlByte & 0b0101_1100)];
  const keyMode = sysexToKeyMode[dataBytes[89]];
  const keyAssignDetune = c2b(dataBytes[90], dataBytes[91]);
  const keyAssignDetuneMode = sysexToDetuneMode[dataBytes[92]];

  const subLevel = c2b(dataBytes[32], dataBytes[33]);
  const noiseLevel = c2b(dataBytes[34], dataBytes[35]);
  const vcfHiPassCutoff = ccv(dataBytes[36] & 0b11);
  const vcfLowPassCutoff = c2b(dataBytes[37], dataBytes[38]);
  const vcfLowPassResonance = c2b(dataBytes[39], dataBytes[40]);
  const vcfLfoModAmount = c2b(dataBytes[41], dataBytes[42]);
  const vcfEnvelopeModAmount = c2b(dataBytes[43], dataBytes[44]);
  const vcfPitchFollow = c2b(dataBytes[45], dataBytes[46]);
  const vcfBendAmount = c2b(dataBytes[47], dataBytes[48]);
  const vcfControlByte = dataBytes[49];
  const vcfLfoSource = sysexToVcfLfoSource[ccv(vcfControlByte & 0b0000_1010)];
  const vcfEnvelopeSource =
    sysexToVcfEnvelopeSource[ccv(vcfControlByte & 0b0000_0001)];

  const env1Attack = c2b(dataBytes[50], dataBytes[51]);
  const env1Decay = c2b(dataBytes[52], dataBytes[53]);
  const env1Sustain = c2b(dataBytes[54], dataBytes[55]);
  const env1Release = c2b(dataBytes[56], dataBytes[57]);

  const env2Attack = c2b(dataBytes[58], dataBytes[59]);
  const env2Decay = c2b(dataBytes[60], dataBytes[61]);
  const env2Sustain = c2b(dataBytes[62], dataBytes[63]);
  const env2Release = c2b(dataBytes[64], dataBytes[65]);

  const lfo1Wave = sysexToLfoWaveform[ccv(dataBytes[67] & 0b111)];
  const lfo1Rate = c2b(dataBytes[68], dataBytes[69]);
  const lfo1Delay = c2b(dataBytes[70], dataBytes[71]);
  const lfo1Mode = sysexToLfoMode[ccv(dataBytes[77] & 0b0000_0001)];

  const lfo2Wave = sysexToLfoWaveform[ccv(dataBytes[72] & 0b111)];
  const lfo2Rate = c2b(dataBytes[73], dataBytes[74]);
  const lfo2Delay = c2b(dataBytes[75], dataBytes[76]);

  const chorusMode = sysexToChorusMode[ccv(dataBytes[78])];

  const volume = c2b(dataBytes[79], dataBytes[80]);
  const vcaLfoModAmount = c2b(dataBytes[81], dataBytes[82]);
  const vcaMode = sysexToVcaMode[ccv(dataBytes[83] & 0b0000_0011)];

  const vcaControlByte = dataBytes[83];
  const vcaLfoSource = sysexToVcaLfoSource[ccv(vcaControlByte & 0b0001_0100)];

  const portamentoTime = c2b(dataBytes[84], dataBytes[85]);
  const portamentoMode = sysexToPortamentoMode[dataBytes[86]];

  const lfo2Mode: LfoMode = sysexToLfoMode[ccv(dataBytes[103] & 0b0000_0001)];

  const kiwiPatch: KiwiPatch = {
    patchName,
    portamentoTime,
    portamentoMode,
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
