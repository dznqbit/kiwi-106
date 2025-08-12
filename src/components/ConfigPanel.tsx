import { WebMidi } from "webmidi";
import { Button, Fieldset, Group, Select, Stack } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiPortData } from "../contexts/MidiContext";
import { SelectMidiChannel } from "./SelectMidiChannel";
import {
  IconRefresh,
  IconExclamationCircle,
  IconBrain,
} from "@tabler/icons-react";
import { useConfigStore } from "../stores/configStore";
import { kiwi106Identifier, kiwiTechnicsSysexId } from "../utils/sysexUtils";

export const ConfigPanel = () => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();

  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    configStore.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    configStore.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const midiPanic = () => {
    for (const output of WebMidi.outputs) {
      output.sendAllSoundOff();
    }
  };

  const sendDeviceEnquirySysex = () => {
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    // Universal
    const universalNonRealtimeIdentification = [0x7e];
    const universalData: number[] = [
      0x7f, // ALL devices
      0x06, // General information
      0x01, // Device Inquiry request
    ];

    output.sendSysex(universalNonRealtimeIdentification, universalData);
  };

  const requestGlobalDumpSysex = () => {
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    output.sendSysex(kiwiTechnicsSysexId, [
      ...kiwi106Identifier,
      0x00, // Required "Device ID"
      0x01, // Request Global Dump
    ]);
  };

  const requestPatchDumpSysex = () => {
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    output.sendSysex(kiwiTechnicsSysexId, [
      ...kiwi106Identifier,
      0x00, // Required "Device ID"
      0x03, // Request Buffer Dump
    ]);
  };

  const sendPatchBufferDumpSysex = () => {
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    output.sendSysex(kiwiTechnicsSysexId, [
      ...kiwi106Identifier,
      0x00, // Required "Device ID"
      0x04, // Transmit Patch Buffer Dump

      0x00, // Per docs, 2 x null bytes followed by 128 bytes of data in following format
      0x00,

      // "yahoo"
      121,
      97,
      104,
      111,
      111,

      0x73,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x20,
      0x0c,
      0x00,
      0x00,
      0x01,
      0x00,
      0x1f,
      0x68,
      0x00,
      0x00,
      0x1a,
      0x22,
      0x00,
      0x00,
      0x00,
      0x02,
      0x30,
      0x00,
      0x12,
      0x34,
      0x00,
      0x00,
      0x03,
      0x6c,
      0x00,
      0x00,
      0x01,
      0x70,
      0x00,
      0x20,
      0x00,
      0x00,
      0x00,
      0x0c,
      0x54,
      0x1f,
      0x63,
      0x00,
      0x00,
      0x00,
      0x14,
      0x03,
      0x44,
      0x13,
      0x6f,
      0x00,
      0x00,
      0x00,
      0x02,
      0x14,
      0x2c,
      0x17,
      0x3c,
      0x00,
      0x0d,
      0x41,
      0x11,
      0x44,
      0x00,
      0x00,
      0x1c,
      0x24,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x04,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x01,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x0c,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
      0x00,
    ]);
  };

  const requestPatchNameSysex = () => {
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    output.sendSysex(kiwiTechnicsSysexId, [
      ...kiwi106Identifier,
      0x00, // Required "Device ID"
      0x0b, // Request patch name
    ]);

    console.log("Requested patch name");
  };

  return (
    <Group wrap="nowrap">
      <Fieldset legend="Input">
        <Group wrap="nowrap">
          <Select
            label="Device"
            clearable
            allowDeselect={false}
            placeholder={
              midiContext.enabled ? "Select an input" : "Not available"
            }
            value={formatName(configStore.input)}
            data={configStore.availableInputs.map(
              (i) => `${i.manufacturer} ${i.name}`,
            )}
            onChange={(fn) =>
              configStore.setInput(findInputByFormattedName(fn))
            }
          ></Select>
          <SelectMidiChannel
            enabled={midiContext.enabled}
            value={configStore.inputChannel}
            onChange={(c) => configStore.setInputChannel(c)}
          />
        </Group>
      </Fieldset>

      <Fieldset legend="Output">
        <Group wrap="nowrap">
          <Select
            label="Device"
            clearable
            allowDeselect={false}
            placeholder={
              midiContext.enabled ? "Select an output" : "Not available"
            }
            value={formatName(configStore.output)}
            data={configStore.availableOutputs.map(
              (i) => `${i.manufacturer} ${i.name}`,
            )}
            onChange={(fn) =>
              configStore.setOutput(findOutputByFormattedName(fn))
            }
          ></Select>
          <SelectMidiChannel
            enabled={midiContext.enabled}
            value={configStore.outputChannel}
            onChange={(c) => configStore.setOutputChannel(c)}
          />
        </Group>
      </Fieldset>

      <Stack>
        <Button
          onClick={() => midiContext.initialize()}
          leftSection={<IconRefresh />}
        >
          Scan
        </Button>
        <Button onClick={midiPanic} leftSection={<IconExclamationCircle />}>
          Panic
        </Button>
        <Button onClick={sendDeviceEnquirySysex} leftSection={<IconBrain />}>
          Device Enquiry
        </Button>
        <Button onClick={requestGlobalDumpSysex} leftSection={<IconBrain />}>
          Request Global Dump
        </Button>
        <Button onClick={requestPatchDumpSysex} leftSection={<IconBrain />}>
          Request Patch Dump
        </Button>
        <Button onClick={sendPatchBufferDumpSysex} leftSection={<IconBrain />}>
          Send Patch Dump
        </Button>
        <Button onClick={requestPatchNameSysex} leftSection={<IconBrain />}>
          Request Patch Name
        </Button>
      </Stack>
    </Group>
  );
};
