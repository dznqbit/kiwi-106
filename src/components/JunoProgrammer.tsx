import { Container } from "@mantine/core";
import { ConfigPanel } from "./ConfigPanel";
import { NoteTester } from "./NoteTester";
import { HexCalculator } from "./HexCalculator";
import { MidiMessageTable } from "./MidiMessageTable";
import { JunoSliders } from "./JunoSliders";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { useMidiContext } from "../hooks/useMidiContext";
import { kiwiPatchDiff } from "../utils/kiwiPatchDiff";
import { useEffect } from "react";
import { ControlChangeMessageEvent, WebMidi } from "webmidi";
import { useConfigStore } from "../stores/configStore";
import { objectKeys } from "../utils/objectKeys";
import { kiwiCcController } from "../utils/kiwiCcController";

export const JunoProgrammer = () => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();
  // const kiwiPatchStore = useKiwiPatchStore();

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

    const updateKiwiPatch = (e: ControlChangeMessageEvent) => {
      console.log(e);
      // TODO: Map incoming CC to KiwiPatch
      // e.controller.number
      // (e.value);
    };

    input.addListener("controlchange", updateKiwiPatch);
    console.log("MessageLog: now listening...");

    return () => {
      input.removeListener("controlchange", updateKiwiPatch);
    };
  }, [midiContext.enabled, configStore.input, configStore.inputChannel]);

  useEffect(() => {
    const unsubscribeKiwiSyncer = useKiwiPatchStore.subscribe((state, oldState) => {
      const diff = kiwiPatchDiff(state.kiwiPatch, oldState.kiwiPatch);

      if (Object.keys(diff).length > 0) {
        console.log(":o, state change!", { diff });

        const outputId = configStore.output?.id;
        if (outputId == null) {
          console.log("incomplete (no outputId)");
          return;
        }    
        
        const output = WebMidi.getOutputById(outputId);
        if (output == null) {
          console.log("incomplete (no output)");
          return;
        }
        const channel = output.channels[configStore.outputChannel];

        for(const k of objectKeys(diff)) {
          if (diff[k] !== undefined) {
            console.log("SEND :D", k, diff[k]);
            channel.sendControlChange(kiwiCcController(k), diff[k]);
          }
        }
      }
    });

    return unsubscribeKiwiSyncer;
  }, []);

  return (
    <Container size="lg">
      <ConfigPanel />
      <MidiMessageTable />
      <HexCalculator />
      <NoteTester />
      <JunoSliders />
    </Container>
  );
};
