import { type Input, type Output } from "webmidi";
import { type KiwiMidi } from "../types/KiwiMidi";
import {
  kiwi106Identifier,
  kiwiTechnicsSysexId,
  kiwiPatchToSysexBytes,
  isKiwi106BufferDumpSysexMessage,
  parseKiwi106PatchEditBufferDumpCommand,
  isKiwi106SysexMessage,
  isKiwi106GlobalDumpSysexMessage,
  isKiwi106GlobalDumpReceivedSysexMessage,
} from "./sysexUtils";
import { DcoRange, KiwiPatch, KiwiPatchAddress } from "../types/KiwiPatch";
import { MidiCcValue, MidiMessage } from "../types/Midi";
import { KiwiGlobalData } from "../types/KiwiGlobalData";
import {
  buildKiwi106GlobalDumpSysexData,
  parseKiwi106GlobalDumpCommand,
} from "./kiwi106Sysex/globalDump";

export const dcoRangeControlChangeValues: Record<DcoRange, MidiCcValue[]> = {
  "16": [0, 31],
  "8": [32, 63],
  "4": [64, 127],
};

export const dcoRangeSysexValues: Record<DcoRange, MidiCcValue> = {
  "16": 0b00,
  "8": 0b01,
  "4": 0b10,
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

    sendSysexPatchBufferDump: (kiwiPatch: KiwiPatch) => {
      const dataBytes = kiwiPatchToSysexBytes(kiwiPatch);

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
      if (!isKiwi106SysexMessage(message)) {
        throw new Error(
          "[kiwiMidi] could not interpret non-Kiwi106 sysex message",
        );
      }

      if (isKiwi106BufferDumpSysexMessage(message)) {
        const command = parseKiwi106PatchEditBufferDumpCommand(message);
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
        };
      }

      throw new Error(
        `[kiwiMidi] unsupport sysex command 0x${message.data.map((n) => n.toString(16))}`,
      );
    },
  };
};
