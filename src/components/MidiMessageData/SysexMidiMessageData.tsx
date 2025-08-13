import { MessageEvent } from "webmidi";
import { Box, Code, Group, Stack, Text, Tooltip } from "@mantine/core";
import { SysexMidiMessage } from "../../utils/formatMidiMessage";
import { formatHex } from "../../utils/formatHex";
import _ from "lodash";

export const SysexMessageData = ({
  messageEvent,
  formattedMessage,
}: {
  messageEvent: MessageEvent;
  formattedMessage: SysexMidiMessage;
}) => {
  const sysexData = [...messageEvent.data];
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
  ] = sysexData;
  const [sysexFooter] = sysexData.slice(-1);

  return (
    <Group gap="xs" wrap="wrap">
      <LabeledMidiData label="Sysex Header" data={[sysexHeader]} />
      <LabeledMidiData
        label="KiwiTechnics Manufacturer Id"
        data={[mfId1, mfId2, mfId3]}
      />
      <LabeledMidiData label="KiwiTechnics Id" data={[kiwiId]} />
      <LabeledMidiData label="KiwiTechnics Juno-106 Id" data={[kiwi106Id]} />
      <LabeledMidiData label="Device Id" data={[deviceId]} />
      <LabeledMidiData label="Command Id" data={[commandId]} />

      {rest.map((d, i) => (
        <LabeledMidiData key={i} label="Data" data={[d]} />
      ))}
      <LabeledMidiData label="Sysex Footer" data={[sysexFooter]} />
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
