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
    <Stack>
      <Group>
        <LabeledMidiData label="Sysex Header" data={[sysexHeader]} />
        <LabeledMidiData
          label="KiwiTechnics Manufacturer Id"
          data={[mfId1, mfId2, mfId3]}
        />
        <LabeledMidiData label="KiwiTechnics Id" data={[kiwiId]} />
        <LabeledMidiData label="KiwiTechnics Juno-106 Id" data={[kiwi106Id]} />
        <LabeledMidiData label="Device Id" data={[deviceId]} />
        <LabeledMidiData label="Command Id" data={[commandId]} />

        {rest.map((d) => (
          <LabeledMidiData label="Test" data={[d]} />
        ))}
        <LabeledMidiData label="Sysex Footer" data={[sysexFooter]} />
      </Group>
    </Stack>
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
    <Box>
      <Tooltip label={label}>
        <Group gap="xs">
          {_.map(data, formatHex).map((d, i) => (
            <Code key={i} mx={2}>
              {d}
            </Code>
          ))}
        </Group>
      </Tooltip>
    </Box>
  );
};
