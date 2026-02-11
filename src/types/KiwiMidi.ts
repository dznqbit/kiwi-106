import { KiwiPatch, KiwiPatchAddress } from "./KiwiPatch";
import {
  Kiwi106SysexGlobalDumpCommand,
  Kiwi106SysexGlobalDumpReceivedCommand,
  Kiwi106SysexPatchEditBufferDumpCommand,
} from "./Kiwi106Sysex";
import { KiwiGlobalData } from "./KiwiGlobalData";
import { MidiMessage } from "./Midi";

export type KiwiMidiFatalError = "fail";
export type KiwiMidiEvent = "receiveMessage" | "sendMessage";
export type KiwiMidiReceiveMessageEvent = {
  name: "receiveMessage";
};
export type KiwiMidiSendMessageEvent = {
  name: "sendMessage";
};
export type KiwiMidiEventListener = (
  e: KiwiMidiReceiveMessageEvent | KiwiMidiSendMessageEvent,
) => void;

export interface KiwiMidi {
  addEventListener(
    eventName: KiwiMidiEvent,
    listener: KiwiMidiEventListener,
  ): number;
  removeEventListener(eventName: KiwiMidiEvent, eventListenerId: number): void;

  requestSysexDeviceEnquiry(): void;
  requestSysexEditBufferDump(): void;
  requestSysexGlobalDump(): void;
  requestSysexPatchName(): void;

  sendProgramChange(patchAddress: KiwiPatchAddress | "manual"): void;
  sendControlChange<K extends keyof KiwiPatch>(
    key: K,
    value: KiwiPatch[K],
  ): void;
  sendSysexPatchBufferDump(kiwiPatch: KiwiPatch): void;
  sendSysexGlobalDump(kiwiGlobalData: KiwiGlobalData): void;

  receivedMessage(): void;
  parseSysex(
    message: MidiMessage,
  ):
    | Kiwi106SysexGlobalDumpCommand
    | Kiwi106SysexGlobalDumpReceivedCommand
    | Kiwi106SysexPatchEditBufferDumpCommand;
}
