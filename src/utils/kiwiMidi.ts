import { type Input, type Output } from "webmidi";
import { type KiwiMidi } from "../types/KiwiMidi";
import { kiwi106Identifier, kiwiTechnicsSysexId } from "./sysexUtils";
import { KiwiPatchAddress } from "../types/KiwiPatch";

export const buildKiwiMidi = ({
  output,
}: {
  input: Input;
  output: Output;
}): KiwiMidi => {
  return {
    requestGlobalDumpSysex: () => {
      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x01, // Request Global Dump
      ]);
    },

    requestDeviceEnquirySysex: () => {
      const universalNonRealtimeIdentification = [0x7e];
      const universalData: number[] = [
        0x7f, // ALL devices
        0x06, // General information
        0x01, // Device Inquiry request
      ];

      output.sendSysex(universalNonRealtimeIdentification, universalData);
    },

    requestEditBufferDumpSysex: () => {
      output.sendSysex(kiwiTechnicsSysexId, [
        ...kiwi106Identifier,
        0x00, // Required "Device ID"
        0x03, // Request Buffer Dump
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
  };
};
