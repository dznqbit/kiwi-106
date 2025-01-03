import { MessageEvent, WebMidi } from "webmidi";
import { Stack, Title } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { useEffect } from "react";
import { useConfigStore } from "../stores/configStore";

export const MessageLog = () => {
  const configStore = useConfigStore();
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

  return (
    <Stack>
      <Title>Message Log</Title>
    </Stack>
  );
};
