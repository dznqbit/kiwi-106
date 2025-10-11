import { Container, Overlay } from "@mantine/core";
import { JunoSliders } from "./JunoSliders";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { useMidiContext } from "../hooks/useMidiContext";
import { kiwiPatchDiff } from "../utils/kiwiPatchDiff";
import { useEffect } from "react";
import { ControlChangeMessageEvent, MessageEvent, WebMidi } from "webmidi";
import { useConfigStore } from "../stores/configStore";
import { objectKeys } from "../utils/objectKeys";
import { kiwiCcController, kiwiPatchKey } from "../utils/kiwiCcController";
import { kiwiCcLabel } from "../utils/kiwiCcLabel";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";
import { PatchNameEditor } from "./PatchNameEditor";
import { isMidiCcValue } from "../types/Midi";
import {
  isKiwi106UpdatePatchNameSysexMessage,
  isAnyKiwi106SysexMessage,
} from "../utils/sysexUtils";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { JunoPatchSelector } from "./JunoPatchSelector";
import { isDcoRange, isDcoWave, isLfoSource } from "../types/KiwiPatch";
import {
  dcoRangeControlChangeValues,
  dcoWaveControlChangeValues,
} from "../utils/kiwiMidi";

export const JunoProgrammer = () => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();
  const { setKiwiPatch, setKiwiPatchProperty: setPatchProperty } =
    useKiwiPatchStore();
  const kiwi106Context = useKiwi106Context();
  const kiwiMidi = kiwi106Context.active ? kiwi106Context.kiwiMidi : null;

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

    const updatePatchFromControlChange = (e: ControlChangeMessageEvent) => {
      const [_, b1, b2] = e.data;

      const patchKey = kiwiPatchKey(b1);
      const ccData = trimMidiCcValue(b2);

      if (patchKey) {
        if (patchKey === "dcoRange") {
          const dcoRange =
            Object.keys(dcoRangeControlChangeValues).find((k) => {
              if (isDcoRange(k)) {
                const [loBound, hiBound] = dcoRangeControlChangeValues[k];
                if (ccData >= loBound && ccData <= hiBound) {
                  return true;
                }
              }
            }) ?? "16";
          setPatchProperty(patchKey, dcoRange, { updatedBy: "Control Change" });
        } else if (patchKey === "dcoWave") {
          const dcoWave =
            Object.keys(dcoWaveControlChangeValues).find((k) => {
              if (isDcoWave(k)) {
                const [loBound, hiBound] = dcoWaveControlChangeValues[k];
                if (ccData >= loBound && ccData <= hiBound) {
                  return true;
                }
              }
            }) ?? "off";
          setPatchProperty(patchKey, dcoWave, { updatedBy: "Control Change" });
        } else {
          setPatchProperty(patchKey, ccData, { updatedBy: "Control Change" });
        }
      } else {
        console.log("Received unknown", kiwiCcLabel(b1));
      }
    };

    input.addListener("controlchange", updatePatchFromControlChange);

    const sysexListener = (e: MessageEvent) => {
      const message = e.message;

      if (!isAnyKiwi106SysexMessage(message)) {
        return;
      }

      if (isKiwi106UpdatePatchNameSysexMessage(message)) {
        // These messages seem to be complete borked: we can revisit.

        // const patchName = message.data
        //   .slice(8, -1)
        //   .map((x) => String.fromCharCode(x))
        //   .join("");
        // console.log("Time to update patch name with", patchName);
        return;
      }

      const kiwi106Command = kiwiMidi?.parseSysex(message);

      switch (kiwi106Command?.command) {
        case "Global Dump":
        case "Global Dump Received":
          // noop. Global dump is handled at the kiwiMidi level
          break;

        case "Patch Edit Buffer Dump":
          setKiwiPatch(kiwi106Command.kiwiPatch, { updatedBy: "Sysex Dump" });
          break;

        default:
          console.log(`Unknown command`);
      }
    };

    input.addListener("sysex", sysexListener);

    console.log("MessageLog: now listening...");

    return () => {
      input.removeListener("controlchange", updatePatchFromControlChange);
    };
  }, [
    midiContext.enabled,
    configStore.input,
    setPatchProperty,
    setKiwiPatch,
    kiwiMidi,
  ]);

  useEffect(() => {
    // Wire up updates to the KiwiStore to the (ie SEND MIDI OUT)
    const unsubscribeKiwiSyncer = useKiwiPatchStore.subscribe(
      (state, oldState) => {
        const diff = kiwiPatchDiff(state.kiwiPatch, oldState.kiwiPatch);

        if (
          Object.keys(diff).length > 0 &&
          state.updatedBy != "Control Change" &&
          state.updatedBy != "Sysex Dump"
        ) {
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

          for (const k of objectKeys(diff)) {
            const value = diff[k];
            if (value !== undefined) {
              if (isDcoRange(value)) {
                kiwiMidi?.sendControlChange("dcoRange", value);
              } else if (isDcoWave(value)) {
                kiwiMidi?.sendControlChange("dcoWave", value);
              } else if (isLfoSource(value)) {
                kiwiMidi?.sendControlChange(k, value);
              } else if (isMidiCcValue(value)) {
                channel.sendControlChange(kiwiCcController(k), value);
              }
            }
          }
        }
      },
    );

    return unsubscribeKiwiSyncer;
  }, [configStore.output?.id, configStore.outputChannel, kiwiMidi]);

  return (
    <Container size="xl" style={{ position: "relative" }} p={0} px="md">
      {!kiwi106Context.active && <Overlay backgroundOpacity={0.5} blur={3} />}
      <JunoPatchSelector />
      <PatchNameEditor />
      <JunoSliders />
    </Container>
  );
};
