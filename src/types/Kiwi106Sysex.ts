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
  "Global Dump Received", // 0x25
] as const;

export type Kiwi106SysexCommandName = (typeof kiwi106SysexCommandNames)[number];
export const kiwi106SysexCommandBytes: Record<Kiwi106SysexCommandName, number> =
  {
    "Request Global Dump": 0x01,
    "Global Dump": 0x02,
    "Request Patch Edit Buffer Dump": 0x03,
    "Patch Edit Buffer Dump": 0x04,
    "Request Patch Dump": 0x05,
    "Patch Dump": 0x06,
    "Request Pattern Dump": 0x07,
    "Pattern Dump": 0x08,
    "Request Sequencer Dump": 0x09,
    "Sequencer Dump": 0x0a,
    "Request Patch Name": 0x0b,
    "Patch Name": 0x0c,
    "Request Patch Edit Buffer Parameter": 0x0d,
    "Patch Edit Buffer Parameter": 0x0e,
    "Request Global Parameter": 0x0f,
    "Global Parameter": 0x10,
    "Request Pattern Edit Buffer Dump": 0x11,
    "Pattern Edit Buffer Dump": 0x12,
    "Request Sequence Edit Buffer Dump": 0x13,
    "Sequence Edit Buffer Dump": 0x14,
    "Request Sequence Edit Buffer Step": 0x15,
    "Sequence Edit Buffer Step": 0x16,
    "Global Dump Received": 0x25,
  };

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

export interface Kiwi106SysexGlobalDumpReceivedCommand
  extends Kiwi106SysexCommand {
  command: "Global Dump Received";
}

export interface Kiwi106SysexPatchEditBufferDumpCommand
  extends Kiwi106SysexCommand {
  command: "Patch Edit Buffer Dump";
  kiwiPatch: KiwiPatch;
}
