import { MessageEvent, WebMidi } from "webmidi";
import { Stack, Title } from "@mantine/core"
import { useMidiContext } from "../hooks/useMidiContext"
import { useEffect } from "react";

export const MessageLog = () => {
  const midiContext = useMidiContext();
  
  useEffect(() => {
    if (!midiContext.enabled || midiContext.selectedInput == null) {
      console.log("MessageLog: cannot listen, dropping out");
      return;
    }

    const input = WebMidi.getInputById(midiContext.selectedInput.id);
    const logMessage = (e: MessageEvent) => {
      console.log(e);
    }

    input.addListener("controlchange", logMessage);
    input.addListener("noteoff", logMessage);
    input.addListener("noteon", logMessage);
    input.addListener("pitchbend", logMessage);
    input.addListener("programchange", logMessage);

    console.log("MessageLog: now listening...");
    
    return () => {
      input.removeListener("controlchange", logMessage);
      input.removeListener("noteoff", logMessage);
      input.removeListener("noteon", logMessage);
      input.removeListener("pitchbend", logMessage);
      input.removeListener("programchange", logMessage);
    }
  }, [midiContext.enabled, midiContext.selectedInput, midiContext.inputChannel]);

  return <Stack>
    <Title>Message Log</Title>
  </Stack>
}