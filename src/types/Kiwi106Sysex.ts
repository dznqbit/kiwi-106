import { KiwiGlobalData } from "./KiwiGlobalData";
import { KiwiPatch } from "./KiwiPatch";
import { MidiMessage } from "./Midi";

export const kiwi106SysexCommandNames = [
  "Request Global Dump",
  "Global Dump",
  "Request Patch Edit Buffer Dump",
  "Patch Edit Buffer Dump",
  "Request Patch Dump",
  "Patch Dump",
  "Request Pattern Dump",
  "Pattern Dump",
  "Request Sequencer Dump",
  "Sequencer Dump",
  "Request Patch Name",
  "Patch Name",
  "Request Patch Edit Buffer Parameter",
  "Patch Edit Buffer Parameter",
  "Request Global Parameter",
  "Global Parameter",
  "Request Pattern Edit Buffer Dump",
  "Pattern Edit Buffer Dump",
  "Request Sequence Edit Buffer Dump",
  "Sequence Edit Buffer Dump",
  "Request Sequence Edit Buffer Step",
  "Sequence Edit Buffer Step",
  "Global Dump Received" // 0x25
] as const;

export type Kiwi106SysexCommandName = (typeof kiwi106SysexCommandNames)[number];

export interface Kiwi106SysexCommand {
  message: MidiMessage;
  command: Kiwi106SysexCommandName;
  data: number[];
  isValid: boolean;
}

export interface Kiwi106SysexGlobalDumpCommand extends Kiwi106SysexCommand {
  command: "Global Dump";
  kiwiGlobalData: KiwiGlobalData;
}

export interface Kiwi106SysexGlobalDumpReceivedCommand extends Kiwi106SysexCommand {
  command: "Global Dump Received";
}

export interface Kiwi106SysexPatchEditBufferDumpCommand
  extends Kiwi106SysexCommand {
  command: "Patch Edit Buffer Dump";
  kiwiPatch: KiwiPatch;
}
