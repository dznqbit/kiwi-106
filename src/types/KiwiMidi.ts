import { Message } from "webmidi";
import { KiwiPatch, KiwiPatchAddress } from "./KiwiPatch";
import { Kiwi106SysexGlobalDumpCommand, Kiwi106SysexPatchEditBufferDumpCommand } from "./Kiwi106Sysex";

/** Interface for Strategy pattern, so we can swap out for whatever */
export interface KiwiMidi {
  requestSysexDeviceEnquiry(): void;
  requestSysexEditBufferDump(): void;
  requestSysexGlobalDump(): void;
  requestSysexPatchName(): void;

  sendProgramChange(patchAddress: KiwiPatchAddress | "manual"): void;
  sendSysexPatchBufferDump(kiwiPatch: KiwiPatch): void;

  parseSysex(message: Message): Kiwi106SysexGlobalDumpCommand | Kiwi106SysexPatchEditBufferDumpCommand;
}
