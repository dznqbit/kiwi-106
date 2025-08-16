import { MessageEvent } from "webmidi";
import { Code, Group, Tooltip } from "@mantine/core";
import { SysexMidiMessage } from "../../utils/formatMidiMessage";
import { formatHex } from "../../utils/formatHex";
import {
  isKiwi106SysexMessage,
  kiwi106PatchEditBufferFields,
  isKiwi106BufferDumpSysexMessage,
} from "../../utils/sysexUtils";
import _ from "lodash";

export const SysexMessageData = ({
  messageEvent,
  formattedMessage,
}: {
  messageEvent: MessageEvent;
  formattedMessage: SysexMidiMessage;
}) => {
  const sysexData = [...messageEvent.data];

  // Check if this is a Kiwi-106 Patch Edit Buffer Dump
  if (isKiwi106BufferDumpSysexMessage(messageEvent.message)) {
    return <Kiwi106PatchEditBufferDisplay data={sysexData} />;
  }

  // Check if this is any other Kiwi-106 SysEx message
  if (isKiwi106SysexMessage(messageEvent.message)) {
    return <Kiwi106GenericSysexDisplay data={sysexData} />;
  }

  // Fallback for non-Kiwi-106 SysEx messages
  return <GenericSysexDisplay data={sysexData} />;
};

const Kiwi106PatchEditBufferDisplay = ({ data }: { data: number[] }) => {
  const fieldEntries = Object.entries(kiwi106PatchEditBufferFields);

  return (
    <Group gap="xs" wrap="wrap">
      {fieldEntries.map(([fieldName, range]) => {
        const [start, end] = range;
        const fieldData =
          end !== undefined ? data.slice(start, end + 1) : [data[start]];

        return (
          <LabeledMidiData key={fieldName} label={fieldName} data={fieldData} />
        );
      })}
    </Group>
  );
};

const Kiwi106GenericSysexDisplay = ({ data }: { data: number[] }) => {
  const [
    sysexHeader,
    mfId1,
    mfId2,
    mfId3,
    kiwiId,
    kiwi106Id,
    deviceId,
    commandId,
    ...rest
  ] = data;
  const [sysexFooter] = data.slice(-1);

  return (
    <Group gap="xs" wrap="wrap">
      <LabeledMidiData label="SysEx Header" data={[sysexHeader]} />
      <LabeledMidiData label="Manufacturer ID" data={[mfId1, mfId2, mfId3]} />
      <LabeledMidiData label="Kiwi ID" data={[kiwiId]} />
      <LabeledMidiData label="Kiwi-106 ID" data={[kiwi106Id]} />
      <LabeledMidiData label="Device ID" data={[deviceId]} />
      <LabeledMidiData label="Command ID" data={[commandId]} />

      {rest.slice(0, -1).map((d, i) => (
        <LabeledMidiData key={i} label="Data" data={[d]} />
      ))}
      <LabeledMidiData label="SysEx Footer" data={[sysexFooter]} />
    </Group>
  );
};

const GenericSysexDisplay = ({ data }: { data: number[] }) => {
  return (
    <Group gap="xs" wrap="wrap">
      {data.map((d, i) => (
        <LabeledMidiData
          key={i}
          label={
            i === 0
              ? "SysEx Header"
              : i === data.length - 1
                ? "SysEx Footer"
                : "Data"
          }
          data={[d]}
        />
      ))}
    </Group>
  );
};

const LabeledMidiData = ({
  label,
  data,
}: {
  label: string;
  data: number[];
}) => {
  return (
    <Tooltip label={label}>
      <Group
        gap={2}
        p={2}
        style={{
          borderRadius: 4,
          backgroundColor: "var(--mantine-color-dark-6)",
          border: "1px solid var(--mantine-color-dark-4)",
        }}
      >
        {_.map(data, formatHex).map((d, i) => (
          <Code key={i} p={2}>
            {d}
          </Code>
        ))}
      </Group>
    </Tooltip>
  );
};
