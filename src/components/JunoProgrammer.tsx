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
import { WebMidi } from "webmidi";
import { useConfigStore } from "../stores/configStore";
import { objectKeys } from "../utils/objectKeys";
import { kiwiCcValue } from "../utils/kiwiCcValue";

export const JunoProgrammer = () => {
  const configStore = useConfigStore();

  useEffect(() => {
    return useKiwiPatchStore.subscribe((state, oldState) => {
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
            channel.sendControlChange(kiwiCcValue(k), diff[k]);
          }
        }
      }
    });
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
