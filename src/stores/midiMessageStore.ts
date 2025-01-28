import { create } from "zustand";
import { MessageEvent } from "webmidi";

interface MidiMessageState {
  messageEvents: MessageEvent[];
}

interface MidiMessageActions {
  addMessageEvent: (m: MessageEvent) => void;
  clear: () => void;
}

type MidiMessageStore = MidiMessageState & MidiMessageActions;

export const useMidiMessageStore = create<MidiMessageStore>()(
  (set) => ({
    messageEvents: [],

    addMessageEvent: (m: MessageEvent) => set(
      ({ messageEvents, ...rest }) => ({ ...rest, messageEvents: [m, ...messageEvents] })
    ),

    clear: () => set(() => ({ messageEvents: []})),
  }),
);