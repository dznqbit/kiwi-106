import { KiwiPatch, KiwiPatchAddress } from "./KiwiPatch";
import {
  Kiwi106SysexGlobalDumpCommand,
  Kiwi106SysexGlobalDumpReceivedCommand,
  Kiwi106SysexPatchEditBufferDumpCommand,
} from "./Kiwi106Sysex";
import { KiwiGlobalData } from "./KiwiGlobalData";
import { MidiMessage } from "./Midi";

export interface KiwiMidi {
  requestSysexDeviceEnquiry(): void;
  requestSysexEditBufferDump(): void;
  requestSysexGlobalDump(): void;
  requestSysexPatchName(): void;

  sendProgramChange(patchAddress: KiwiPatchAddress | "manual"): void;
  sendSysexPatchBufferDump(kiwiPatch: KiwiPatch): void;
  sendSysexGlobalDump(kiwiGlobalData: KiwiGlobalData): void;

  parseSysex(
    message: MidiMessage
  ):
    | Kiwi106SysexGlobalDumpCommand
    | Kiwi106SysexGlobalDumpReceivedCommand
    | Kiwi106SysexPatchEditBufferDumpCommand;
}
