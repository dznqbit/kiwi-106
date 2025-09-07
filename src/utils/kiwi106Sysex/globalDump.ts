import { Message } from "webmidi";
import { Kiwi106SysexGlobalDumpCommand } from "../../types/Kiwi106Sysex";
import {
  Kiwi106MessageMode,
  Kiwi106MasterClockSource,
  Kiwi106MidiSoftThroughMode,
  KiwiGlobalData,
} from "../../types/KiwiGlobalData";
import {
  findKeyByValue,
  isKiwi106GlobalDumpSysexMessage,
  unpack12Bit,
  packBits,
  pack12Bit,
  unpackBits,
  pack8Bit,
  unpack8Bit,
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

const kiwi106MidiClockGenModeBytes: Record<Kiwi106MasterClockSource, number> = {
  internal: 0,
  midi: 1,
  "ext step": 2,
  "ext 24ppqn": 3,
  "ext 48ppqn": 4,
};

const CLOCK_RATE_SCALE = 0.8644067797;

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
  const [patternLevelHi, patternLevelLo] = unpack12Bit(gd.patternLevel);
  const patternControl = packBits(
    gd.patternClockSource === "seq",
    gd.patternDestinationVca,
    gd.patternDestinationVcf,
  );

  // 0 - 255 => 5 - 300
  const scaledClockRate = Math.floor((gd.intClockRate - 5) * CLOCK_RATE_SCALE);
  const [intClockRateHi, intClockRateLo] = unpack8Bit(scaledClockRate);
  const mwLevel = gd.mwLevel;
  const atLevel = gd.atLevel;
  const keyTransposeDisable = Number(gd.keyTransposeDisable);
  const displayMode = packBits(gd.clockDisplay, gd.scrollingDisplay);
  const memoryProtect = 1; // Readonly, controlled via switch. Does nothing.
  const internalTune = gd.internalTune;
  const externalPedalPolarity = Number(gd.externalPedalPolarity === "inverse");

  const dataBytes = new Array(31).fill(0);

  dataBytes[0] = midiChannelIn;
  dataBytes[1] = midiChannelOut;
  dataBytes[2] = sequencerMidiChannelOut;
  dataBytes[3] = deviceId;
  dataBytes[4] = enableControlChange;
  dataBytes[5] = enableSysex;
  dataBytes[6] = enableProgramChange;
  dataBytes[7] = midiSoftThrough;
  dataBytes[8] = enableMidiClockGen;
  // internalVelocity only runs down to 63; anything below that is not stored, and min's out at 63
  dataBytes[9] = internalVelocity;
  dataBytes[10] = masterClockSource;
  dataBytes[11] = notUsed;
  dataBytes[12] = notUsed;
  dataBytes[13] = notUsed;
  dataBytes[14] = patternLevelHi;
  dataBytes[15] = patternLevelLo;
  // ^ verified
  dataBytes[16] = patternControl;
  dataBytes[17] = intClockRateHi;
  dataBytes[18] = intClockRateLo;
  // dataBytes[16] = 0x7a;
  // dataBytes[17] = 0x75;
  // dataBytes[18] = 0x07;
  dataBytes[19] = mwLevel;
  dataBytes[20] = atLevel;
  dataBytes[21] = keyTransposeDisable;
  dataBytes[22] = displayMode;
  dataBytes[23] = memoryProtect;
  dataBytes[24] = notUsed;
  dataBytes[25] = internalTune;
  dataBytes[26] = externalPedalPolarity;

  return dataBytes;
};

/** Parse a complete Midi Message into a kiwi106 Global Dump */
export const parseKiwi106GlobalDumpCommand = (
  m: Message
): Kiwi106SysexGlobalDumpCommand => {
  if (!isKiwi106GlobalDumpSysexMessage(m)) {
    throw new Error("Message is not a Kiwi-106 Global Dump Sysex Command");
  }

  // Slice out dataBytes, and now we can use the same indices from buildKiwi106GlobalDumpSysexData
  const dataBytes = m.data.slice(8);

  const midiChannelIn = trimMidiChannel(dataBytes[0] + 1);
  const midiChannelOut = trimMidiChannel(dataBytes[1] + 1);
  const sequencerMidiChannelOut = trimMidiChannel(dataBytes[2] + 1);
  const deviceId = trimNibble(dataBytes[3]);
  const enableControlChange = findKeyByValue(
    kiwi106MessageModeBytes,
    dataBytes[4] & 0x03
  );
  const enableSysex = dataBytes[5] === 1;
  const enableProgramChange = findKeyByValue(
    kiwi106MessageModeBytes,
    dataBytes[6] & 0x03
  );

  const midiSoftThrough = findKeyByValue(
    kiwi106MidiSoftThroughBytes,
    dataBytes[7] & 0x03
  );

  const enableMidiClockGen = !!(dataBytes[8] & 0x01);
  const internalVelocity = trimMidiCcValue(dataBytes[9] & 0x7f);

  const masterClockSource = findKeyByValue(
    kiwi106MidiClockGenModeBytes,
    dataBytes[10] & 0x07
  );

  const patternLevel = pack12Bit(dataBytes[14], dataBytes[15]);

  const [patternClockSourceBit, patternDestinationVca, patternDestinationVcf] =
    unpackBits(dataBytes[16], 3);

  console.log({
    controlData: dataBytes[16],
    patternClockSourceBit, patternDestinationVca, patternDestinationVcf
  })

  const patternClockSource = patternClockSourceBit ? "seq" : "arp";

  const scaledClockRate = pack8Bit(dataBytes[17], dataBytes[18])
  const intClockRate = Math.floor(scaledClockRate / CLOCK_RATE_SCALE) + 5;
  const mwLevel = dataBytes[19] & 0x7f;
  const atLevel = dataBytes[20] & 0x7f;
  const keyTransposeDisable = !!(dataBytes[21] & 0x01);

  const [clockDisplay, scrollingDisplay] = unpackBits(dataBytes[22], 2);

  const internalTune = dataBytes[25] & 0x7f;
  const externalPedalPolarity = dataBytes[26] & 0x01 ? "inverse" : "normal";

  const globalData: KiwiGlobalData = {
    midiChannelIn,
    midiChannelOut,
    sequencerMidiChannelOut,
    deviceId,
    enableControlChange,
    enableSysex,
    enableProgramChange,
    midiSoftThrough,
    enableMidiClockGen,
    internalVelocity,
    masterClockSource,
    patternLevel,
    patternDestinationVca,
    patternDestinationVcf,
    patternClockSource,
    intClockRate,
    mwLevel,
    atLevel,
    keyTransposeDisable,
    clockDisplay,
    scrollingDisplay,
    internalTune,
    externalPedalPolarity,
  };

  return {
    command: "Global Dump",
    data: globalData,
    dataBytes: m.dataBytes,
    message: m,
    isValid: true,
  };
};
