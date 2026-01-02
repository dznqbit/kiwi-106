import { type Input, type Output } from "webmidi";
import { type KiwiMidi } from "../types/KiwiMidi";
import {
  kiwi106Identifier,
  kiwiTechnicsSysexId,
  isKiwi106BufferDumpSysexMessage,
  isAnyKiwi106SysexMessage,
  isKiwi106GlobalDumpSysexMessage,
  isKiwi106GlobalDumpReceivedSysexMessage,
} from "./sysexUtils";
import {
  ChorusMode,
  DcoRange,
  DcoWave,
  EnvelopeSource,
  isChorusMode,
  isDcoRange,
  isDcoWave,
  isKeyAssignDetuneMode,
  isKeyMode,
  isLfoMode,
  isLfoSource,
  isPwmControlSource,
  isVcaMode,
  DetuneMode,
  KeyMode,
  KiwiPatch,
  KiwiPatchAddress,
  LfoMode,
  LfoSource,
  LfoWaveform,
  PwmControlSource,
  VcaMode,
} from "../types/KiwiPatch";
import { MidiCcValue, MidiMessage } from "../types/Midi";
import { KiwiGlobalData } from "../types/KiwiGlobalData";
import {
  buildKiwi106GlobalDumpSysexData,
  parseKiwi106GlobalDumpCommand,
} from "./kiwi106Sysex/globalDump";
import {
  buildKiwi106PatchEditBufferSysexDump,
  parseKiwi106PatchEditBufferSysexDump,
} from "./kiwi106Sysex/patchEditBufferDump";
import { kiwiCcController } from "./kiwiCcController";

export const dcoRangeControlChangeValues: Record<DcoRange, MidiCcValue[]> = {
  "16": [0, 31],
  "8": [32, 63],
  "4": [64, 127],
};

export const dcoWaveControlChangeValues: Record<DcoWave, MidiCcValue[]> = {
  off: [0, 31],
  ramp: [32, 63],
  pulse: [64, 95],
  "ramp-and-pulse": [96, 127],
};

export const lfoModeControlChangeValues: Record<LfoMode, MidiCcValue[]> = {
  normal: [0, 63],
  plus: [64, 127],
};

export const lfoWaveformControlChangeValues: Record<
  LfoWaveform,
  MidiCcValue[]
> = {
  sine: [0, 15],
  triangle: [16, 31],
  sawtooth: [32, 63],
  "reverse-sawtooth": [64, 95],
  square: [96, 111],
  random: [112, 127],
};

export const chorusModeControlChangeValues: Record<ChorusMode, MidiCcValue[]> =
  {
    off: [0, 31],
    // NB: Spec claims c1=32-63 c2=64-127, but these ranges match what's on my board
    chorus1: [32, 80],
    chorus2: [81, 127],
  };

export const vcaModeControlChangeValues: Record<VcaMode, MidiCcValue[]> = {
  gate: [0, 31],
  env1: [32, 63],
  env2: [64, 127],
};

export const keyModeControlChangeValues: Record<KeyMode, MidiCcValue[]> = {
  poly1: [0, 15],
  poly2: [16, 31],
  "unison-legato": [32, 47],
  "unison-staccato": [48, 63],
  "mono-legato": [64, 79],
  "mono-staccato": [80, 127],
};

export const keyAssignDetuneModeControlChangeValues: Record<
  DetuneMode,
  MidiCcValue[]
> = {
  mono: [0, 63],
  all: [64, 127],
};

const dcoLfoSourceControlChangeValues: Record<LfoSource, MidiCcValue[]> = {
  lfo1: [0, 63],
  lfo2: [64, 127],
  "lfo1-inverted": [],
  "lfo2-inverted": [],
};

export const pwmControlSourceControlChangeValues: Record<
  PwmControlSource,
  MidiCcValue[]
> = {
  manual: [0, 18],
  lfo1: [19, 36],
  lfo2: [37, 54],
  env1: [55, 72],
  env2: [73, 90],
  "env1-inverted": [91, 108],
  "env2-inverted": [109, 127],
};

export const envelopeSourceControlChangeValues: Record<
  EnvelopeSource,
  MidiCcValue[]
> = {
  env1: [0, 31],
  env2: [64, 95],
  "env1-inverted": [32, 63],
  "env2-inverted": [96, 127],
};

export const buildKiwiMidi = ({
  output,
}: {
  input: Input;
  output: Output;
}): KiwiMidi => {
  return {
    requestSysexDeviceEnquiry: () => {
      const universalNonRealtimeIdentification = [0x7e];
      const universalData: number[] = [
        0x7f, // ALL devices
        0x06, // General information
        0x01, // Device Inquiry request
      ];

      output.sendSysex(universalNonRealtimeIdentification, universalData);
    },

    requestSysexEditBufferDump: () => {
      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x03, // Request Buffer Dump
      ]);
    },

    requestSysexGlobalDump: () => {
      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x01, // Request Global Dump
      ]);
    },

    requestSysexPatchName: () => {
      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x0b, // Request patch name
      ]);
    },

    sendProgramChange: (patchAddress: KiwiPatchAddress | "manual") => {
      // CC0: Bank Select MSB
      output.sendControlChange(0, 0);

      if (patchAddress === "manual") {
        // This doesn't work yet :(
        output.sendControlChange(32, 0);
        output.sendProgramChange(0);
      } else {
        const { group, bank, patch } = patchAddress;

        const groupIndex = Math.floor(group / 2);
        const baseTenPatchNumber =
          Math.max(0, (group % 2) - 1) * 64 + (bank - 1) * 8 + (patch - 1);

        output.sendControlChange(32, groupIndex);
        output.sendProgramChange(baseTenPatchNumber);
      }
    },

    sendControlChange: <K extends keyof KiwiPatch>(
      key: K,
      value: KiwiPatch[K],
    ) => {
      let ccByte = undefined;

      if (key === "dcoRange" && isDcoRange(value)) {
        ccByte = dcoRangeControlChangeValues[value][0];
      }

      if (key === "dcoWave" && isDcoWave(value)) {
        ccByte = dcoWaveControlChangeValues[value][0];
      }

      if (["lfo1Mode", "lfo2Mode"].includes(key) && isLfoMode(value)) {
        ccByte = lfoModeControlChangeValues[value][0];
      }

      if (
        ["dcoLfoSource", "vcfLfoSource", "vcaLfoSource"].includes(key) &&
        isLfoSource(value)
      ) {
        ccByte = dcoLfoSourceControlChangeValues[value][0];
      }

      if (key === "dcoPwmControl" && isPwmControlSource(value)) {
        ccByte = pwmControlSourceControlChangeValues[value][0];
      }

      if (key === "chorusMode" && isChorusMode(value)) {
        ccByte = chorusModeControlChangeValues[value][0];
      }

      if (key === "vcaMode" && isVcaMode(value)) {
        ccByte = vcaModeControlChangeValues[value][0];
      }

      if (key === "keyMode" && isKeyMode(value)) {
        ccByte = keyModeControlChangeValues[value][0];
      }

      if (key === "keyAssignDetuneMode" && isKeyAssignDetuneMode(value)) {
        ccByte = keyAssignDetuneModeControlChangeValues[value][0];
      }

      if (ccByte !== undefined) {
        output.sendControlChange(kiwiCcController(key), ccByte);
      }
    },

    sendSysexPatchBufferDump: (kiwiPatch: KiwiPatch) => {
      const dataBytes = buildKiwi106PatchEditBufferSysexDump(kiwiPatch);

      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x04, // Transmit Patch Buffer Dump
        0x00, // 2 x null bytes
        0x00,
        ...dataBytes,
      ]);
    },

    sendSysexGlobalDump: (kiwiGlobalData: KiwiGlobalData) => {
      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x02, // Transmit/Receive Global Dump

        ...buildKiwi106GlobalDumpSysexData(kiwiGlobalData),
      ]);
    },

    parseSysex: (message: MidiMessage) => {
      if (!isAnyKiwi106SysexMessage(message)) {
        throw new Error(
          "[kiwiMidi] could not interpret non-Kiwi106 sysex message",
        );
      }

      if (isKiwi106BufferDumpSysexMessage(message)) {
        const command = parseKiwi106PatchEditBufferSysexDump(message);
        return command;
      }

      if (isKiwi106GlobalDumpSysexMessage(message)) {
        const command = parseKiwi106GlobalDumpCommand(message);
        return command;
      }

      if (isKiwi106GlobalDumpReceivedSysexMessage(message)) {
        // Receiving f0,0,21,16,60,3,0,25,0,1,f7 after sysex writes, likely an ACK
        // That 0,1 might be an interesting data byte, for now we'll just ignore
        return {
          command: "Global Dump Received",
          message,
          data: message.data,
          isValid: true,
        };
      }

      throw new Error(
        `[kiwiMidi] unsupport sysex command 0x${message.data.map((n) => n.toString(16))}`,
      );
    },
  };
};
