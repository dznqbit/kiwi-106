import _ from "lodash";
import { Message } from "webmidi";
import { Kiwi106SysexPatchEditBufferDumpCommand } from "../types/Kiwi106Sysex";
import { KiwiPatch } from "../types/KiwiPatch";
import { MidiCcValue } from "../types/Midi";

export const isSysexDeviceEnquiryReply = (message: Message) => {
  if (!message.isSystemMessage) {
    return false;
  }

  return message.data[3] === 0x06 && message.data[4] === 0x02;
};

// Kiwitechnics
// Kiwitechnics manufacturer ID, per https://midi.org/sysexidtable
export const kiwiTechnicsSysexId = [0x00, 0x21, 0x16];
export const kiwi106Identifier = [0x60, 0x03];

export const isKiwiTechnicsSysexMessage = (message: Message) => {
  const manufacturerId = message.data.slice(1, 4);
  return _.isEqual(manufacturerId, kiwiTechnicsSysexId);
};

export const isKiwi106SysexMessage = (message: Message) => {
  return (
    isKiwiTechnicsSysexMessage(message) &&
    _.isEqual(message.data.slice(4, 6), kiwi106Identifier)
  );
};

export const isKiwi106GlobalDumpSysexMessage = (message: Message) => {
  return isKiwi106SysexMessage(message) && message.data[7] === 0x02;
};

export const isKiwi106BufferDumpSysexMessage = (message: Message) => {
  return isKiwi106SysexMessage(message) && message.data[7] == 0x04;
};

export const isKiwi106RequestPatchNameSysexMessage = (message: Message) => {
  return isKiwi106SysexMessage(message) && message.data[7] === 0x0b;
};

export const isKiwi106UpdatePatchNameSysexMessage = (message: Message) => {
  return isKiwi106SysexMessage(message) && message.data[7] === 0x0c;
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

export const parseKiwi106PatchEditBufferDumpCommand = (
  m: Message,
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
    const value = (hi << 7) | lo;
    // Convert 12-bit (0-4095) to MIDI CC range (0-127)
    return Math.round((value / 4095) * 127) as MidiCcValue;
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

  // Create KiwiPatch object mapping SysEx data to patch parameters
  const kiwiPatch: KiwiPatch = {
    patchName,
    portamentoTime: combine12BitToMidi(94, 95),
    volume: combine12BitToMidi(89, 90), // VCA Level

    dcoRange: byteToMidi(30), // DCO Wave/Range contains range bits
    dcoWave: byteToMidi(30), // DCO Wave/Range contains wave bits
    dcoPwmModAmount: combine12BitToMidi(39, 40),
    dcoPwmControl: byteToMidi(41), // DCO Control
    dcoLfoModAmount: combine12BitToMidi(33, 34),
    dcoLfoSource: byteToMidi(87), // LFO1 Control
    dcoEnvelopeModAmount: combine12BitToMidi(31, 32),
    dcoEnvelopeSource: byteToMidi(76), // Env Control

    lfoMode: byteToMidi(87), // LFO1 Control
    lfo1Wave: byteToMidi(77),
    lfo1Rate: combine12BitToMidi(78, 79),
    lfo1Delay: combine12BitToMidi(80, 81),
    lfo2Wave: byteToMidi(82),
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
    dataBytes: data.slice(8), // Skip header, start from first data byte
    isValid: data[0] === 0xf0 && data[data.length - 1] === 0xf7,
    kiwiPatch,
  };
};
