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
import { kiwiCcController, kiwiPatchKey } from "../utils/kiwiCcController";
import { kiwiCcLabel } from "../utils/kiwiCcLabel";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";

export const JunoProgrammer = () => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();
  const {
    setPatchProperty,
  } = useKiwiPatchStore();

  useEffect(() => {
    // Wire incoming CC messages to the Kiwi store (ie READ MIDI IN)
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
      const [_, b1, b2] = e.data;

      const patchKey = kiwiPatchKey(b1)
      const ccData = trimMidiCcValue(b2)

      if (patchKey) {
        setPatchProperty(patchKey, ccData);
      } else {
        console.log("Received unknown", kiwiCcLabel(b1))
      }
    };

    input.addListener("controlchange", updateKiwiPatch);
    console.log("MessageLog: now listening...");

    return () => {
      input.removeListener("controlchange", updateKiwiPatch);
    };
  }, [midiContext.enabled, configStore.input, configStore.inputChannel, setPatchProperty]);

  useEffect(() => {
    // Wire up updates to the KiwiStore to the  (ie SEND MIDI OUT)
    const unsubscribeKiwiSyncer = useKiwiPatchStore.subscribe((state, oldState) => {
      const diff = kiwiPatchDiff(state.kiwiPatch, oldState.kiwiPatch);

      if (Object.keys(diff).length > 0) {
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
            channel.sendControlChange(kiwiCcController(k), diff[k]);
          }
        }
      }
    });

    return unsubscribeKiwiSyncer;
  }, [configStore.output?.id, configStore.outputChannel]);

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
