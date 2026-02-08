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
import { KiwiPatch } from "../types/KiwiPatch";
import {
  chorusModeControlChangeValues,
  lfoSourceControlChangeValues,
  dcoRangeControlChangeValues,
  dcoWaveControlChangeValues,
  envelopeSourceControlChangeValues,
  keyAssignDetuneModeControlChangeValues,
  keyModeControlChangeValues,
  lfoWaveformControlChangeValues,
  pwmControlSourceControlChangeValues,
  vcaModeControlChangeValues,
} from "../utils/kiwiMidi";
import { controlChangeValue } from "../utils/controlChangeValue";

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
      kiwiMidi?.receivedMessage();

      // Seems like we can detect presses of the "Manual" button:
      // CC "All Notes Off"
      // CC vcaMode
      // CC vcfEnvelopeSource
      // CC dcoPwmControl

      const [_, b1, b2] = e.data;

      const patchKey = kiwiPatchKey(b1);
      const ccData = trimMidiCcValue(b2);
      const options = {
        updatedBy: "Control Change" as const,
      };

      console.log(`[cc -> patch] ${patchKey} ${ccData}`);
      if (patchKey) {
        switch (patchKey) {
          case "dcoPwmControl":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, pwmControlSourceControlChangeValues) ??
                "manual",
              options,
            );
            break;

          case "dcoRange":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, dcoRangeControlChangeValues) ?? "16",
              options,
            );
            break;

          case "dcoWave":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, dcoWaveControlChangeValues) ?? "off",
              options,
            );
            break;

          case "dcoLfoSource":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, lfoSourceControlChangeValues) ??
                "lfo1",
              options,
            );
            break;

          case "lfo1Mode":
          case "lfo2Mode":
            console.log(`[cc -> patch] ignoring ${patchKey}`);
            break;

          case "lfo1Wave":
          case "lfo2Wave":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, lfoWaveformControlChangeValues) ??
                "sine",
              options,
            );
            break;

          case "vcfEnvelopeSource":
          case "dcoEnvelopeSource":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, envelopeSourceControlChangeValues) ??
                "env1",
              options,
            );
            break;

          case "vcfLfoSource":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, lfoSourceControlChangeValues) ??
                "lfo1",
              options,
            );
            break;

          case "vcaLfoSource":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, lfoSourceControlChangeValues) ??
                "lfo1",
              options,
            );
            break;

          case "chorusMode":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, chorusModeControlChangeValues) ??
                "off",
              options,
            );
            break;

          case "vcaMode":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, vcaModeControlChangeValues) ?? "env1",
              options,
            );
            break;

          case "keyMode":
            setPatchProperty(
              patchKey,
              controlChangeValue(ccData, keyModeControlChangeValues) ?? "poly1",
              options,
            );
            break;

          case "keyAssignDetuneMode":
            setPatchProperty(
              patchKey,
              controlChangeValue(
                ccData,
                keyAssignDetuneModeControlChangeValues,
              ) ?? "unison-only",
              options,
            );
            break;

          default:
            setPatchProperty(patchKey, ccData, options);
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
              const props: Array<keyof KiwiPatch> = [
                "lfo1Mode",
                "lfo2Mode",
                "dcoRange",
                "dcoWave",
                "dcoLfoSource",
                "vcfLfoSource",
                "vcaLfoSource",
                "chorusMode",
                "vcaMode",
                "keyMode",
                "keyAssignDetuneMode",
              ];

              if (props.includes(k)) {
                kiwiMidi?.sendControlChange(k, value);
              } else if (isMidiCcValue(value)) {
                if (k === "dcoPwmControl") {
                  console.log("Update pwm control to", value);
                }

                if (k === "dcoPwmModAmount") {
                  console.log("Update pwm amount to", value);
                }

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
