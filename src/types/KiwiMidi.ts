import { KiwiPatchAddress } from "./KiwiPatch";

export interface KiwiMidi {
  requestGlobalDumpSysex(): void;
  requestDeviceEnquirySysex(): void;
  requestEditBufferDumpSysex(): void;

  sendProgramChange(patchAddress: KiwiPatchAddress | "manual"): void;
}
