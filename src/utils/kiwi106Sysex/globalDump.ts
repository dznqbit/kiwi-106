import { Message } from "webmidi";
import { Kiwi106SysexGlobalDumpCommand } from "../../types/Kiwi106Sysex";
import {
  Kiwi106MessageMode,
  Kiwi106MidiClockGenMode,
  Kiwi106MidiSoftThroughMode,
  KiwiGlobalData,
} from "../../types/KiwiGlobalData";
import {
  isKiwi106GlobalDumpSysexMessage,
  pack12Bit,
  packBits,
  unpack12Bit,
} from "../sysexUtils";
import {
  trimMidiChannel,
  trimNibble,
  trimMidiCcValue,
} from "../trimMidiCcValue";

const kiwi106MessageModeBytes: Record<Kiwi106MessageMode, number> = {
  off: 0,
  rx: 1,
  tx: 2,
  "rx-tx": 3,
};

const kiwi106MidiSoftThroughBytes: Record<Kiwi106MidiSoftThroughMode, number> =
  {
    "stop-all": 0,
    "pass-all": 1,
    "pass-only-non-cc": 2,
    "stop-only-cc-used": 3,
  };

const kiwi106MidiClockGenModeBytes: Record<Kiwi106MidiClockGenMode, number> = {
  internal: 0,
  midi: 1,
  "ext step": 2,
  "ext 24ppqn": 3,
  "ext 48ppqn": 4,
};

/** Build the sysex DATA for a global dump message
 * This omits the sysex headers, kiwi106 identifier, "device id", and sysex message type
 */
export const buildKiwi106GlobalDumpSysexData = (gd: KiwiGlobalData) => {
  const notUsed = 0;

  const midiChannelIn = gd.midiChannelIn - 1;
  const midiChannelOut = gd.midiChannelOut - 1;
  const sequencerMidiChannelOut = gd.sequencerMidiChannelOut - 1;
  const deviceId = gd.deviceId;
  const enableControlChange = kiwi106MessageModeBytes[gd.enableControlChange];
  const enableSysex = Number(gd.enableSysex);
  const enableProgramChange = kiwi106MessageModeBytes[gd.enableProgramChange];
  const midiSoftThrough = kiwi106MidiSoftThroughBytes[gd.midiSoftThrough];
  const enableMidiClockGen = Number(gd.enableMidiClockGen);
  const internalVelocity = gd.internalVelocity;
  const masterClockSource = kiwi106MidiClockGenModeBytes[gd.masterClockSource];
  const [patternLevelHi, patternLevelLo] = pack12Bit(gd.patternLevel);
  const patternControl = packBits(
    gd.patternClockSource === "seq",
    gd.patternDestinationVca,
    gd.patternDestinationVcf
  );
  const [intClockRateHi, intClockRateLo] = pack12Bit(gd.intClockRate);
  const mwLevel = gd.mwLevel;
  const atLevel = gd.atLevel;
  const keyTransposeDisable = Number(gd.keyTransposeDisable);
  const displayMode = packBits(gd.scrollingDisplay, gd.clockDisplay);
  const memoryProtect = 1; // Readonly, controlled via switch. Does nothing.
  const internalTune = gd.internalTune;
  const externalPedalPolarity = Number(gd.externalPedalPolarity === "inverse");

  const data = new Array(32);
  data[0] = midiChannelIn;
  data[1] = midiChannelOut;
  data[2] = sequencerMidiChannelOut;
  data[3] = deviceId;
  data[4] = enableControlChange;
  data[5] = enableSysex;
  data[6] = enableProgramChange;
  data[7] = midiSoftThrough;
  data[8] = enableMidiClockGen;
  data[9] = internalVelocity;
  data[10] = masterClockSource;
  data[11] = notUsed;
  data[12] = notUsed;
  data[13] = notUsed;
  data[14] = patternLevelHi;
  data[15] = patternLevelLo;
  data[16] = patternControl;
  data[17] = intClockRateHi;
  data[18] = intClockRateLo;
  data[19] = mwLevel;
  data[20] = atLevel;
  data[21] = keyTransposeDisable;
  data[22] = displayMode;
  data[23] = memoryProtect;
  data[24] = notUsed;
  data[25] = internalTune;
  data[26] = externalPedalPolarity;

  return data;
};

export const parseKiwi106GlobalDumpCommand = (
  m: Message
): Kiwi106SysexGlobalDumpCommand => {
  // Ensure it's a Kiwi 106 Global Dump Command
  if (!isKiwi106GlobalDumpSysexMessage(m)) {
    throw new Error("Message is not a Kiwi-106 Global Dump Sysex Command");
  }

  const data = [...m.data];
  const dataBytes = data.slice(8); // Skip header, start from first data byte

  // Global data now uses dataBytes with 0-based indexing matching documentation
  const globalData: KiwiGlobalData = {
    midiChannelIn: trimMidiChannel(dataBytes[0]), // Byte 0x00
    midiChannelOut: trimMidiChannel(dataBytes[1]), // Byte 0x01
    sequencerMidiChannelOut: trimMidiChannel(dataBytes[2]), // Byte 0x02
    deviceId: trimNibble(dataBytes[3]), // Byte 0x03

    // CLAUDE: Write a generic function to invert kiwi106MessageModeBytes and then lookup the
    // key for the given value
    enableControlChange: (() => {
      const value = dataBytes[4] & 0x03; // Byte 0x04
      switch (value) {
        case 0:
          return "off";
        case 1:
          return "rx";
        case 2:
          return "tx";
        case 3:
          return "rx-tx";
        default:
          return "rx";
      }
    })(),

    enableSysex: !!(dataBytes[5] & 0x01), // Byte 0x05

    enableProgramChange: (() => {
      const value = dataBytes[6] & 0x03; // Byte 0x06
      switch (value) {
        case 0:
          return "off";
        case 1:
          return "rx";
        case 2:
          return "tx";
        case 3:
          return "rx-tx";
        default:
          return "rx";
      }
    })(),

    midiSoftThrough: (() => {
      const value = dataBytes[7] & 0x03; // Byte 0x07
      switch (value) {
        case 0:
          return "stop-all";
        case 1:
          return "pass-all";
        case 2:
          return "pass-only-non-cc";
        case 3:
          return "stop-only-cc-used";
        default:
          return "pass-all";
      }
    })(),

    enableMidiClockGen: !!(dataBytes[8] & 0x01), // Byte 0x08
    internalVelocity: trimMidiCcValue(dataBytes[9] & 0x7f), // Byte 0x09

    masterClockSource: (() => {
      const value = dataBytes[10] & 0x07; // Byte 0x0a
      switch (value) {
        case 0:
          return "internal";
        case 1:
          return "midi";
        case 2:
          return "ext step";
        case 3:
          return "ext 24ppqn";
        case 4:
          return "ext 48ppqn";
        default:
          return "internal";
      }
    })(),

    // Bytes 0x0b-0x0d not used

    patternLevel: unpack12Bit(dataBytes[14], dataBytes[15]), // Bytes 0x0e-0x0f

    patternDestinationVca: !!(dataBytes[16] & 0x02), // Byte 0x10, y bit in 00000xyz
    patternDestinationVcf: !!(dataBytes[16] & 0x01), // Byte 0x10, z bit in 00000xyz
    patternClockSource: dataBytes[16] & 0x04 ? "seq" : "arp", // Byte 0x10, x bit in 00000xyz

    intClockRate: ((dataBytes[17] & 0x0f) << 4) | (dataBytes[18] & 0x0f), // Bytes 0x11-0x12
    mwLevel: dataBytes[19] & 0x7f, // Byte 0x13
    atLevel: dataBytes[20] & 0x7f, // Byte 0x14
    keyTransposeDisable: !!(dataBytes[21] & 0x01), // Byte 0x15

    clockDisplay: !!(dataBytes[22] & 0x01), // Byte 0x16, z bit in 000000yz
    scrollingDisplay: !!(dataBytes[22] & 0x02), // Byte 0x16, y bit in 000000yz

    // Byte 0x17 not used
    internalTune: dataBytes[25] & 0x7f, // Byte 0x19
    externalPedalPolarity: dataBytes[26] & 0x01 ? "inverse" : "normal", // Byte 0x1a

    // Bytes 0x1b-0x1f are nulls/not used
  };

  return {
    command: "Global Dump",
    data: globalData,
    dataBytes: m.dataBytes,
    message: m,
    isValid: true,
  };
};
