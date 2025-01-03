import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageEvent } from "webmidi";

interface MidiMessageState {
  messageEvents: MessageEvent[];
}

interface MidiMessageActions {
  addMessageEvent: (m: MessageEvent) => void;
}

type MidiMessageStore = MidiMessageState & MidiMessageActions;

export const useMidiMessageStore = create<MidiMessageStore>()(
  // persist(
    (set) => ({
      messageEvents: [],

      addMessageEvent: (m: MessageEvent) => set(
        ({ messageEvents, ...rest }) => ({ ...rest, messageEvents: [...messageEvents, m] })
    )
    }),
  //   {
  //     name: "midiMessages"
  //   }
  // ),
);