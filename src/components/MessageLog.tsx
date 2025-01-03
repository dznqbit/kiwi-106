import { MessageEvent, WebMidi } from "webmidi";
import { List, Stack, Title } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { useEffect } from "react";
import { useConfigStore } from "../stores/configStore";
import { useMidiMessageStore } from "../stores/midiMessageStore";

export const MessageLog = () => {
  const configStore = useConfigStore();
  const midiMessageStore = useMidiMessageStore();
  const midiContext = useMidiContext();

  useEffect(() => {
    if (!midiContext.enabled) {
      console.log("MessageLog: WebMidi not enabled, dropping");
      return;
    }

    if (configStore.input == null) {
      console.log("MessageLog: No input selected, dropping");
      return;
    }

    const input = WebMidi.getInputById(configStore.input.id);
    if (!input) {
      console.log("MessageLog: cannot listen, dropping out");
      return;
    }

    const logMessage = (e: MessageEvent) => {
      const messageType = e.message.type;

      if (messageType === "clock") {
        return;
      }

      console.log(e.type, messageType, e);
      midiMessageStore.addMessageEvent(e);
    };

    input.addListener("midimessage", logMessage);
    // input.addListener("controlchange", logMessage);
    // input.addListener("noteoff", logMessage);
    // input.addListener("noteon", logMessage);
    // input.addListener("pitchbend", logMessage);
    // input.addListener("programchange", logMessage);

    console.log("MessageLog: now listening...");

    return () => {
      input.removeListener("midimessage", logMessage);
      // input.removeListener("controlchange", logMessage);
      // input.removeListener("noteoff", logMessage);
      // input.removeListener("noteon", logMessage);
      // input.removeListener("pitchbend", logMessage);
      // input.removeListener("programchange", logMessage);
    };
  }, [midiContext.enabled, configStore.input, configStore.inputChannel]);

  const { messageEvents } = midiMessageStore;
  return (
    <Stack>
      <Title>Message Log ({messageEvents.length})</Title>
      <List>
        {messageEvents.map((me) => 
          <List.Item>{me.data.join(", ")}</List.Item>
        )}
      </List>
    </Stack>
  );
};
