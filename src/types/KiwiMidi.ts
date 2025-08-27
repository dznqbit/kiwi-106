import { KiwiPatch, KiwiPatchAddress } from "./KiwiPatch";

export interface KiwiMidi {
  requestSysexDeviceEnquiry(): void;
  requestSysexEditBufferDump(): void;
  requestSysexGlobalDump(): void;
  requestSysexPatchName(): void;

  sendProgramChange(patchAddress: KiwiPatchAddress | "manual"): void;
  sendSysexPatchBufferDump(kiwiPatch: KiwiPatch): void;
}
