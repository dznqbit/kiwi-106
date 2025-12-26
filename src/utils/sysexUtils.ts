import _ from "lodash";
import {
  kiwi106SysexCommandBytes,
  Kiwi106SysexCommandName,
} from "../types/Kiwi106Sysex";
import { MidiMessage } from "../types/Midi";

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

/** Pack two bytes into a 12 bit value according to Kiwi106 docs:
 * Hi & Lo are combined to make single 12 bit command.
 * 000xxxxx + 0yyyyyyy = 0000xxxx xyyyyyyy
 */
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
