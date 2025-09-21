import _ from "lodash";
import {
  kiwi106SysexCommandBytes,
  Kiwi106SysexCommandName,
  Kiwi106SysexPatchEditBufferDumpCommand,
} from "../types/Kiwi106Sysex";
import { KiwiPatch } from "../types/KiwiPatch";
import { MidiCcValue, MidiMessage } from "../types/Midi";
import { dcoRangeSysexValues } from "./kiwiMidi";
import { objectKeys } from "./objectKeys";
import { trimMidiCcValue } from "./trimMidiCcValue";

/** Packs a bunch of booleans into a single number */
export const packBits = (...args: boolean[]) => {
  return args.reduce(
    (result, bit, index) => result | (Number(bit) << (args.length - 1 - index)),
    0,
  );
};

/** Unpacks bits from a number into an array of booleans */
export const unpackBits = (value: number, bitCount: number): boolean[] => {
  return Array.from(
    { length: bitCount },
    (_, i) => !!(value & (1 << (bitCount - 1 - i))),
  );
};

/** Unpack a 12 bit value to two bytes, according to Kiwi106 docs */
export const unpack12Bit: (n: number) => [number, number] = (n) => {
  // Hi & Lo are combined to make single 12 bit command.
  // 0000xxxxxyyyyyyy = 000xxxxx + 0yyyyyyy
  const hi = (n >> 7) & 0x1f; // Extract upper 5 bits (xxxxx)
  const lo = n & 0x7f; // Extract lower 7 bits (yyyyyyy)
  return [hi, lo];
};

/** Unpack a byte value to two bytes, according to Kiwi106 docs */
export const unpack8Bit: (n: number) => [number, number] = (n) => {
  const hi = (n >> 4) & 0x1f; // Extract upper 4 bits (xxxx)
  const lo = n & 0xf; // Extract lower 4 bits (yyyy)
  return [hi, lo];
};

/** Pack two bytes into a 12 bit value according to Kiwi106 docs */
export const pack12Bit = (highByte: number, lowByte: number): number => {
  const hi = highByte & 0x1f; // 5 bits
  const lo = lowByte & 0x7f; // 7 bits
  const value = (hi << 7) | lo;

  return value;
};

/** Pack two bytes into an 8 bit value according to Kiwi106 docs */
export const pack8Bit = (highByte: number, lowByte: number): number => {
  const hi = highByte & 0xf;
  const lo = lowByte & 0xf;
  const value = (hi << 4) | lo;

  return value;
};

/* Reverse Record; given a Record value, find the key */
export const findKeyByValue = <T extends string>(
  lookup: Record<T, number>,
  value: number,
): T => {
  const entry = Object.entries(lookup).find(([_, v]) => v === value);
  if (!entry) {
    throw new Error(
      `Could not find key for "${value}" in ${JSON.stringify(lookup)}`,
    );
  }

  return entry[0] as T;
};

export const isSysexDeviceEnquiryReply = (message: MidiMessage) => {
  if (!message.isSystemMessage) {
    return false;
  }

  return message.data[3] === 0x06 && message.data[4] === 0x02;
};

// Kiwitechnics
// Kiwitechnics manufacturer ID, per https://midi.org/sysexidtable
export const kiwiTechnicsSysexId = [0x00, 0x21, 0x16];
export const kiwi106Identifier = [0x60, 0x03];

export const isKiwiTechnicsSysexMessage = (message: MidiMessage) => {
  const manufacturerId = message.data.slice(1, 4);
  return _.isEqual(manufacturerId, kiwiTechnicsSysexId);
};

export const isAnyKiwi106SysexMessage = (message: MidiMessage) => {
  return (
    isKiwiTechnicsSysexMessage(message) &&
    _.isEqual(message.data.slice(4, 6), kiwi106Identifier)
  );
};

export const isKiwi106SysexMessage = (
  message: MidiMessage,
  command: Kiwi106SysexCommandName,
) => {
  return (
    isAnyKiwi106SysexMessage(message) &&
    message.data[7] === kiwi106SysexCommandBytes[command]
  );
};

export const isKiwi106GlobalDumpSysexMessage = (message: MidiMessage) => {
  return isKiwi106SysexMessage(message, "Global Dump");
};

export const isKiwi106GlobalDumpReceivedSysexMessage = (
  message: MidiMessage,
) => {
  return isKiwi106SysexMessage(message, "Global Dump Received");
};

export const isKiwi106BufferDumpSysexMessage = (message: MidiMessage) => {
  return isKiwi106SysexMessage(message, "Patch Edit Buffer Dump");
};

export const isKiwi106RequestPatchNameSysexMessage = (message: MidiMessage) => {
  return isKiwi106SysexMessage(message, "Request Patch Name");
};

export const isKiwi106UpdatePatchNameSysexMessage = (message: MidiMessage) => {
  return isKiwi106SysexMessage(message, "Patch Name");
};

export const kiwi106PatchEditBufferFields = {
  "SysEx Header": [0],
  "Manufacturer ID": [1, 3],
  "Kiwi ID": [4],
  "Kiwi-106 ID": [5],
  "Device ID": [6],
  "Command ID": [7],
  "Null Head": [8, 9],
  "Patch Name": [10, 29],
  "DCO Wave/Range": [30],
  "DCO Env Amount": [31, 32],
  "DCO LFO Amount": [33, 34],
  "DCO Bend Mod Amount": [35, 36],
  "DCO Bend LFO Mod Amount": [37, 38],
  "DCO PWM Amount": [39, 40],
  "DCO Control": [41],
  "Sub Level": [42, 43],
  "Noise Level": [44, 45],
  "HPF Level": [46],
  "VCF Cutoff": [47, 48],
  "VCF Resonance": [49, 50],
  "VCF LFO Amount": [51, 52],
  "VCF ENV Amount": [53, 54],
  "VCF Key Amount": [55, 56],
  "VCF Bend Mod Amount": [57, 58],
  "VCF Control": [59],
  "Env 1 Attack": [60, 61],
  "Env 1 Decay": [62, 63],
  "Env 1 Sustain": [64, 65],
  "Env 1 Release": [66, 67],
  "Env 2 Attack": [68, 69],
  "Env 2 Decay": [70, 71],
  "Env 2 Sustain": [72, 73],
  "Env 2 Release": [74, 75],
  "Env Control": [76],
  "LFO 1 Wave": [77],
  "LFO 1 Rate": [78, 79],
  "LFO 1 Delay": [80, 81],
  "LFO 2 Wave": [82],
  "LFO 2 Rate": [83, 84],
  "LFO 2 Delay": [85, 86],
  "LFO1 Control": [87],
  "Chorus Control": [88],
  "VCA Level": [89, 90],
  "VCA LFO Mod Amount": [91, 92],
  "VCA Control": [93],
  "Portamento Rate": [94, 95],
  "Portamento Control": [96],
  "Load Sequence": [97],
  "Load Pattern": [98],
  "Voice Mode": [99],
  "Voice Detune Amount": [100, 101],
  "Detune Control": [102],
  "Arp Control": [103],
  "AT Control": [104],
  "MW Control": [105],
  "Midi Control": [106],
  "Patch Clock Tempo": [107, 108],
  "Arp Clock Divide": [109],
  "Sequence Control": [110],
  "Sequence Transpose": [111],
  "Dynamics Control": [112],
  "LFO2 Control": [113],
  "Sequence Clock Divide": [114],
  "Null Tail": [115, 137],
  "SysEx Footer": [138],
} as const;

// This is the patch data sysex ONLY!
// This skips the sysex headers and the "2 null bytes"
const simplePatchDumpSysex: number[] = [
  // "yahoo"
  121, 97, 104, 111, 111,

  0x73, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
  0x20, 0x20, 0x0c, 0x00, 0x00, 0x01, 0x00, 0x1f, 0x68, 0x00, 0x00, 0x1a, 0x22,
  0x00, 0x00, 0x00, 0x02, 0x30, 0x00, 0x12, 0x34, 0x00, 0x00, 0x03, 0x6c, 0x00,
  0x00, 0x01, 0x70, 0x00, 0x20, 0x00, 0x00, 0x00, 0x0c, 0x54, 0x1f, 0x63, 0x00,
  0x00, 0x00, 0x14, 0x03, 0x44, 0x13, 0x6f, 0x00, 0x00, 0x00, 0x02, 0x14, 0x2c,
  0x17, 0x3c, 0x00, 0x0d, 0x41, 0x11, 0x44, 0x00, 0x00, 0x1c, 0x24, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
];

/* THIS HAS NEVER WORKED, AND IS DEPRECATED IN FAVOR OF utils/kiwi106Sysex/patchEditBufferDump.ts */
export const kiwiPatchToSysexBytes = (kiwiPatch: KiwiPatch): number[] => {
  // const dataBytes = new Array(128).fill(0);
  const dataBytes = [...simplePatchDumpSysex];

  // // Helper to convert MidiCcValue to 12-bit hi/lo bytes
  // const midiTo12Bit = (value: MidiCcValue): [number, number] => {
  //   // Convert MIDI CC range (0-127) to 12-bit (0-4095)
  //   const expanded = Math.round((value / 127) * 4095);
  //   const hi = (expanded >> 7) & 0x1f; // 5 bits
  //   const lo = expanded & 0x7f; // 7 bits
  //   return [hi, lo];
  // };

  // // Helper to convert single byte MidiCcValue
  // const midiByte = (value: MidiCcValue): number => {
  //   return value & 0x7f;
  // };

  // const convertLfoWave = (ccValue: MidiCcValue): number => {
  //   // Convert CC ranges back to sysex bits
  //   // CC ranges: sine: 0-15, triangle: 16-31, sawtooth: 32-63,
  //   // reverse-sawtooth: 64-95, square: 96-111, random: 112-127
  //   if (ccValue <= 15) return 0; // Sine
  //   if (ccValue <= 31) return 1; // Triangle
  //   if (ccValue <= 63) return 3; // Sawtooth
  //   if (ccValue <= 95) return 4; // Reverse Sawtooth
  //   if (ccValue <= 111) return 2; // Square
  //   return 5; // Random
  // };

  // Patch Name (bytes 0-19) - 20 bytes
  const patchNameBytes = [...kiwiPatch.patchName].map((s) => s.charCodeAt(0));
  for (let i = 0; i < 20; i++) {
    dataBytes[i] = patchNameBytes[i] || 0;
  }

  // DCO Wave/Range (byte 20)
  dataBytes[20] = dcoRangeSysexValues[kiwiPatch.dcoRange];

  // THIS IS COMPLETE FUCKING BUSTED! DONT USE IT YET!
  // // DCO Env Amount (bytes 23-24)
  // const [dcoEnvHi, dcoEnvLo] = midiTo12Bit(kiwiPatch.dcoEnvelopeModAmount);
  // dataBytes[23] = dcoEnvHi;
  // dataBytes[24] = dcoEnvLo;

  // // DCO LFO Amount (bytes 25-26)
  // const [dcoLfoHi, dcoLfoLo] = midiTo12Bit(kiwiPatch.dcoLfoModAmount);
  // dataBytes[25] = dcoLfoHi;
  // dataBytes[26] = dcoLfoLo;

  // // DCO Bend Mod Amount (bytes 27-28)
  // const [dcoBendHi, dcoBendLo] = midiTo12Bit(kiwiPatch.dcoBendAmount);
  // dataBytes[27] = dcoBendHi;
  // dataBytes[28] = dcoBendLo;

  // // DCO Bend LFO Mod Amount (bytes 29-30) - not in KiwiPatch, using 0
  // dataBytes[29] = 0;
  // dataBytes[30] = 0;

  // // DCO PWM Amount (bytes 31-32)
  // const [dcoPwmHi, dcoPwmLo] = midiTo12Bit(kiwiPatch.dcoPwmModAmount);
  // dataBytes[31] = dcoPwmHi;
  // dataBytes[32] = dcoPwmLo;

  // // DCO Control (byte 33)
  // dataBytes[33] = midiByte(kiwiPatch.dcoPwmControl);

  // // Sub Level (bytes 34-35)
  // const [subHi, subLo] = midiTo12Bit(kiwiPatch.subLevel);
  // dataBytes[34] = subHi;
  // dataBytes[35] = subLo;

  // // Noise Level (bytes 36-37)
  // const [noiseHi, noiseLo] = midiTo12Bit(kiwiPatch.noiseLevel);
  // dataBytes[36] = noiseHi;
  // dataBytes[37] = noiseLo;

  // // HPF Level (byte 38)
  // dataBytes[38] = midiByte(kiwiPatch.vcfHiPassCutoff);

  // // VCF Cutoff (bytes 39-40)
  // const [vcfCutoffHi, vcfCutoffLo] = midiTo12Bit(kiwiPatch.vcfLowPassCutoff);
  // dataBytes[39] = vcfCutoffHi;
  // dataBytes[40] = vcfCutoffLo;

  // // VCF Resonance (bytes 41-42)
  // const [vcfResHi, vcfResLo] = midiTo12Bit(kiwiPatch.vcfLowPassResonance);
  // dataBytes[41] = vcfResHi;
  // dataBytes[42] = vcfResLo;

  // // VCF LFO Amount (bytes 43-44)
  // const [vcfLfoHi, vcfLfoLo] = midiTo12Bit(kiwiPatch.vcfLfoModAmount);
  // dataBytes[43] = vcfLfoHi;
  // dataBytes[44] = vcfLfoLo;

  // // VCF ENV Amount (bytes 45-46)
  // const [vcfEnvHi, vcfEnvLo] = midiTo12Bit(kiwiPatch.vcfEnvelopeModAmount);
  // dataBytes[45] = vcfEnvHi;
  // dataBytes[46] = vcfEnvLo;

  // // VCF Key Amount (bytes 47-48)
  // const [vcfKeyHi, vcfKeyLo] = midiTo12Bit(kiwiPatch.vcfPitchFollow);
  // dataBytes[47] = vcfKeyHi;
  // dataBytes[48] = vcfKeyLo;

  // // VCF Bend Mod Amount (bytes 49-50)
  // const [vcfBendHi, vcfBendLo] = midiTo12Bit(kiwiPatch.vcfBendAmount);
  // dataBytes[49] = vcfBendHi;
  // dataBytes[50] = vcfBendLo;

  // // VCF Control (byte 51)
  // dataBytes[51] = midiByte(kiwiPatch.vcfEnvelopeSource);

  // // Env 1 Attack (bytes 52-53)
  // const [env1AHi, env1ALo] = midiTo12Bit(kiwiPatch.env1Attack);
  // dataBytes[52] = env1AHi;
  // dataBytes[53] = env1ALo;

  // // Env 1 Decay (bytes 54-55)
  // const [env1DHi, env1DLo] = midiTo12Bit(kiwiPatch.env1Decay);
  // dataBytes[54] = env1DHi;
  // dataBytes[55] = env1DLo;

  // // Env 1 Sustain (bytes 56-57)
  // const [env1SHi, env1SLo] = midiTo12Bit(kiwiPatch.env1Sustain);
  // dataBytes[56] = env1SHi;
  // dataBytes[57] = env1SLo;

  // // Env 1 Release (bytes 58-59)
  // const [env1RHi, env1RLo] = midiTo12Bit(kiwiPatch.env1Release);
  // dataBytes[58] = env1RHi;
  // dataBytes[59] = env1RLo;

  // // Env 2 Attack (bytes 60-61)
  // const [env2AHi, env2ALo] = midiTo12Bit(kiwiPatch.env2Attack);
  // dataBytes[60] = env2AHi;
  // dataBytes[61] = env2ALo;

  // // Env 2 Decay (bytes 62-63)
  // const [env2DHi, env2DLo] = midiTo12Bit(kiwiPatch.env2Decay);
  // dataBytes[62] = env2DHi;
  // dataBytes[63] = env2DLo;

  // // Env 2 Sustain (bytes 64-65)
  // const [env2SHi, env2SLo] = midiTo12Bit(kiwiPatch.env2Sustain);
  // dataBytes[64] = env2SHi;
  // dataBytes[65] = env2SLo;

  // // Env 2 Release (bytes 66-67)
  // const [env2RHi, env2RLo] = midiTo12Bit(kiwiPatch.env2Release);
  // dataBytes[66] = env2RHi;
  // dataBytes[67] = env2RLo;

  // // Env Control (byte 68)
  // dataBytes[68] = midiByte(kiwiPatch.dcoEnvelopeSource);

  // // LFO 1 Wave (byte 69)
  // dataBytes[69] = convertLfoWave(kiwiPatch.lfo1Wave);

  // // LFO 1 Rate (bytes 70-71)
  // const [lfo1RateHi, lfo1RateLo] = midiTo12Bit(kiwiPatch.lfo1Rate);
  // dataBytes[70] = lfo1RateHi;
  // dataBytes[71] = lfo1RateLo;

  // // LFO 1 Delay (bytes 72-73)
  // const [lfo1DelayHi, lfo1DelayLo] = midiTo12Bit(kiwiPatch.lfo1Delay);
  // dataBytes[72] = lfo1DelayHi;
  // dataBytes[73] = lfo1DelayLo;

  // // LFO 2 Wave (byte 74)
  // dataBytes[74] = convertLfoWave(kiwiPatch.lfo2Wave);

  // // LFO 2 Rate (bytes 75-76)
  // const [lfo2RateHi, lfo2RateLo] = midiTo12Bit(kiwiPatch.lfo2Rate);
  // dataBytes[75] = lfo2RateHi;
  // dataBytes[76] = lfo2RateLo;

  // // LFO 2 Delay (bytes 77-78)
  // const [lfo2DelayHi, lfo2DelayLo] = midiTo12Bit(kiwiPatch.lfo2Delay);
  // dataBytes[77] = lfo2DelayHi;
  // dataBytes[78] = lfo2DelayLo;

  // // LFO1 Control (byte 79)
  // dataBytes[79] = midiByte(kiwiPatch.lfo1Mode);

  // // Chorus Control (byte 80)
  // dataBytes[80] = midiByte(kiwiPatch.chorusMode);

  // // VCA Level (bytes 81-82)
  // const [vcaHi, vcaLo] = midiTo12Bit(kiwiPatch.volume);
  // dataBytes[81] = vcaHi;
  // dataBytes[82] = vcaLo;

  // // VCA LFO Mod Amount (bytes 83-84)
  // const [vcaLfoHi, vcaLfoLo] = midiTo12Bit(kiwiPatch.vcaLfoModAmount);
  // dataBytes[83] = vcaLfoHi;
  // dataBytes[84] = vcaLfoLo;

  // // VCA Control (byte 85)
  // dataBytes[85] = midiByte(kiwiPatch.vcaMode);

  // // Portamento Rate (bytes 86-87)
  // const [portHi, portLo] = midiTo12Bit(kiwiPatch.portamentoTime);
  // dataBytes[86] = portHi;
  // dataBytes[87] = portLo;

  // // Portamento Control (byte 88) - not in KiwiPatch, using 0
  // dataBytes[88] = 0;

  // // Load Sequence (byte 89) - not in KiwiPatch, using 0
  // dataBytes[89] = 0;

  // // Load Pattern (byte 90) - not in KiwiPatch, using 0
  // dataBytes[90] = 0;

  // // Voice Mode (byte 91)
  // dataBytes[91] = midiByte(kiwiPatch.keyMode);

  // // Voice Detune Amount (bytes 92-93)
  // const [detuneHi, detuneLo] = midiTo12Bit(kiwiPatch.keyAssignDetune);
  // dataBytes[92] = detuneHi;
  // dataBytes[93] = detuneLo;

  // // Detune Control (byte 94)
  // dataBytes[94] = midiByte(kiwiPatch.keyAssignDetuneMode);

  // // Remaining bytes (95-129) are mostly controls and null tail - using 0
  // for (let i = 95; i < 130; i++) {
  //   dataBytes[i] = 0;
  // }

  // // Set some specific control bytes that might be important
  // dataBytes[97] = midiByte(kiwiPatch.lfoModWheelAmount); // MW Control
  // dataBytes[105] = midiByte(kiwiPatch.lfo2Mode); // LFO2 Control

  return dataBytes;
};

/* THIS IS DEPRECATED IN FAVOR OF utils/kiwi106Sysex/patchEditBufferDump.ts */
export const parseKiwi106PatchEditBufferDumpCommand = (
  m: MidiMessage,
): Kiwi106SysexPatchEditBufferDumpCommand => {
  // Ensure it's a Kiwi 106 Patch Edit Buffer Dump Command
  if (!isKiwi106BufferDumpSysexMessage(m)) {
    throw new Error("Message is not a Kiwi-106 Patch Edit Buffer Dump Command");
  }

  const data = [...m.data];

  // Helper to combine hi/lo bytes into 12-bit value and convert to MidiCcValue
  const combine12BitToMidi = (hiIdx: number, loIdx: number): MidiCcValue => {
    const hi = data[hiIdx] & 0x1f; // 5 bits
    const lo = data[loIdx] & 0x7f; // 7 bits
    const twelveBit = pack12Bit(hi, lo);
    return trimMidiCcValue(twelveBit / 4096);
  };

  // Helper to convert single byte to MidiCcValue
  const byteToMidi = (idx: number): MidiCcValue => {
    return data[idx] as MidiCcValue;
  };

  // Extract patch name (20 ASCII bytes)
  const patchNameBytes = data.slice(10, 30);
  const patchName = String.fromCharCode(...patchNameBytes)
    .replace(/\0/g, "")
    .trim();

  // DCO Wave/Range contains range bits
  const dcoRangeBytes = byteToMidi(30) & 0b11;
  const dcoRange =
    objectKeys(dcoRangeSysexValues).find(
      (k) => dcoRangeSysexValues[k] == dcoRangeBytes,
    ) ?? "4";

  const parseLfoWave = (n: number) => {
    // Sysex bits
    // 000=Sine
    // 001=Triangle
    // 010=Square
    // 011=Saw
    // 100=Reverse Saw
    // 101=Random

    // CC bits yy
    // 'sine': [0, 15],
    // 'triangle': [16, 31],
    // 'sawtooth': [32, 63],
    // 'reverse-sawtooth': [64, 95],
    // 'square': [96, 111],
    // 'random': [112, 127],

    // Map sysex bits to CC bits
    switch (
      n & 0x07 // Extract lower 3 bits
    ) {
      case 0:
        return 0; // Sine -> mid-range of 0-15
      case 1:
        return 16; // Triangle -> mid-range of 16-31
      case 3:
        return 32; // Saw -> mid-range of 32-47
      case 4:
        return 64; // Reverse Saw -> mid-range of 48-63
      case 2:
        return 96; // Square -> mid-range of 64-79
      case 5:
        return 112; // Random -> mid-range of 80-127
    }

    return 0;
  };

  // Create KiwiPatch object mapping SysEx data to patch parameters
  const kiwiPatch: KiwiPatch = {
    patchName,
    portamentoTime: combine12BitToMidi(94, 95),
    volume: combine12BitToMidi(89, 90), // VCA Level

    dcoRange,
    dcoWave: byteToMidi(30), // DCO Wave/Range contains wave bits
    dcoPwmModAmount: combine12BitToMidi(39, 40),
    dcoPwmControl: byteToMidi(41), // DCO Control
    dcoLfoModAmount: combine12BitToMidi(33, 34),
    dcoLfoSource: byteToMidi(87), // LFO1 Control
    dcoEnvelopeModAmount: combine12BitToMidi(31, 32),
    dcoEnvelopeSource: byteToMidi(76), // Env Control

    lfoMode: byteToMidi(87), // LFO1 Control
    lfo1Wave: parseLfoWave(byteToMidi(77)),
    lfo1Rate: combine12BitToMidi(78, 79),
    lfo1Delay: combine12BitToMidi(80, 81),
    lfo2Wave: parseLfoWave(byteToMidi(82)),
    lfo2Rate: combine12BitToMidi(83, 84),
    lfo2Delay: combine12BitToMidi(85, 86),
    lfo1Mode: byteToMidi(87), // LFO1 Control
    lfo2Mode: byteToMidi(113), // LFO2 Control

    subLevel: combine12BitToMidi(42, 43),
    noiseLevel: combine12BitToMidi(44, 45),

    vcfLowPassCutoff: combine12BitToMidi(47, 48),
    vcfLowPassResonance: combine12BitToMidi(49, 50),
    vcfPitchFollow: combine12BitToMidi(55, 56), // VCF Key Amount
    vcfHiPassCutoff: byteToMidi(46), // HPF Level
    vcfLfoModAmount: combine12BitToMidi(51, 52),
    vcfLfoSource: byteToMidi(87), // LFO1 Control
    vcfEnvelopeModAmount: combine12BitToMidi(53, 54),
    vcfEnvelopeSource: byteToMidi(59), // VCF Control

    env1Attack: combine12BitToMidi(60, 61),
    env1Decay: combine12BitToMidi(62, 63),
    env1Sustain: combine12BitToMidi(64, 65),
    env1Release: combine12BitToMidi(66, 67),

    chorusMode: byteToMidi(88), // Chorus Control
    vcaLfoModAmount: combine12BitToMidi(91, 92),
    vcaLfoSource: byteToMidi(87), // LFO1 Control
    vcaMode: byteToMidi(93), // VCA Control

    env2Attack: combine12BitToMidi(68, 69),
    env2Decay: combine12BitToMidi(70, 71),
    env2Sustain: combine12BitToMidi(72, 73),
    env2Release: combine12BitToMidi(74, 75),

    dcoBendAmount: combine12BitToMidi(35, 36), // DCO Bend Mod Amount
    vcfBendAmount: combine12BitToMidi(57, 58), // VCF Bend Mod Amount
    lfoModWheelAmount: byteToMidi(105), // MW Control

    keyMode: byteToMidi(99), // Voice Mode
    keyAssignDetune: combine12BitToMidi(100, 101), // Voice Detune Amount
    keyAssignDetuneMode: byteToMidi(102), // Detune Control
  };

  return {
    message: m,
    command: "Patch Edit Buffer Dump",
    data: data.slice(8), // Skip header, start from first data byte
    isValid: data[0] === 0xf0 && data[data.length - 1] === 0xf7,
    kiwiPatch,
  };
};
