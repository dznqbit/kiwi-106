import { MessageEvent, WebMidi } from "webmidi";
import { Button, Group, Stack, Table, Text, Code } from "@mantine/core";
import { useMidiContext } from "../hooks/useMidiContext";
import { useEffect } from "react";
import { useConfigStore } from "../stores/configStore";
import { useMidiMessageStore } from "../stores/midiMessageStore";
import {
  formatMidiMessage,
  FormattedMidiMessage,
  isControlChangeMidiMessage,
  isNoteMidiMessage,
  isSysexMidiMessage,
} from "../utils/formatMidiMessage";
import { IconTrash } from "@tabler/icons-react";
import * as _ from "lodash";
import { SysexMessageData } from "./MidiMessageData/SysexMidiMessageData";
import { formatHex } from "../utils/formatHex";
import { ControlChangeMidiMessageData } from "./MidiMessageData/ControlChangeMidiMessageData";
import { NoteMidiMessageData } from "./MidiMessageData/NoteMidiMessageData";
import { isSysexDeviceEnquiryReply } from "../utils/sysexUtils";
import { H1 } from "./H1";

export const MidiMessageTable = () => {
  const configStore = useConfigStore();
  const midiMessageStore = useMidiMessageStore();
  const midiContext = useMidiContext();

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

    const logMessage = (e: MessageEvent) => {
      const messageType = e.message.type;

      if (messageType === "clock" || isSysexDeviceEnquiryReply(e.message)) {
        return;
      }

      console.log(e.type, messageType, e);
      midiMessageStore.addMessageEvent(e);
    };

    input.addListener("midimessage", logMessage);

    return () => {
      input.removeListener("midimessage", logMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midiContext.enabled, configStore.input, configStore.inputChannel]);

  const { messageEvents, clear: clearMidiMessages } = midiMessageStore;
  return (
    <Stack>
      <Group>
        <H1>MESSAGE LOG</H1>
        <Button onClick={() => clearMidiMessages()} leftSection={<IconTrash />}>
          Clear
        </Button>
      </Group>

      <Table.ScrollContainer h={256} minWidth={512}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={128}>Type</Table.Th>
              <Table.Th w={32}>Channel</Table.Th>
              <Table.Th>Message</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {messageEvents.slice(0, 20).map((me) => (
              <MidiMessageRow key={me.timestamp} messageEvent={me} />
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
};

interface MidiMessageRowParams {
  messageEvent: MessageEvent;
}

const MidiMessageRow = ({ messageEvent }: MidiMessageRowParams) => {
  const formattedMessage = formatMidiMessage(messageEvent);

  return (
    <Table.Tr>
      <Table.Td>{formattedMessage.label}</Table.Td>
      <Table.Td>{formattedMessage.channel ?? "ALL"}</Table.Td>
      <Table.Td>
        <MessageData
          key={`${messageEvent.timestamp}-data`}
          messageEvent={messageEvent}
          formattedMessage={formattedMessage}
        />
        <MessageSparkline messageEvent={messageEvent} />
      </Table.Td>
    </Table.Tr>
  );
};

interface MessageDataParams {
  messageEvent: MessageEvent;
  formattedMessage: FormattedMidiMessage;
}

const MessageData = ({ messageEvent, formattedMessage }: MessageDataParams) => {
  if (isSysexMidiMessage(formattedMessage)) {
    return (
      <SysexMessageData
        messageEvent={messageEvent}
        formattedMessage={formattedMessage}
      />
    );
  }

  if (isControlChangeMidiMessage(formattedMessage)) {
    return <ControlChangeMidiMessageData formattedMessage={formattedMessage} />;
  }

  if (isNoteMidiMessage(formattedMessage)) {
    return <NoteMidiMessageData formattedMessage={formattedMessage} />;
  }

  return (
    <Text>
      ({messageEvent.rawData.length} bytes)
      <br />
      {_.map(messageEvent.data, formatHex).map((d, i) => (
        <Code key={[messageEvent.timestamp, "data", i].join("")} mx={2}>
          {d}
        </Code>
      ))}
    </Text>
  );
};

const mapColor = (byte: number) => {
  // Convert byte to HSL (hue, saturation, lightness)
  const hue = Math.floor((byte / 255) * 360); // 0-360 degrees around color wheel
  const saturation = 100; // Full saturation
  const lightness = 50; // Medium lightness

  // Convert HSL to RGB
  const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness / 100 - c / 2;

  let r, g, b;
  if (hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert RGB to hex
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
};

interface MessageSparklineParams {
  messageEvent: MessageEvent;
}

const MessageSparkline = ({ messageEvent }: MessageSparklineParams) => {
  const data = [...messageEvent.data];
  const bytesPerRow = 64;
  const cellSize = 10;

  const width = bytesPerRow * cellSize;
  const height = Math.ceil(data.length / bytesPerRow) * cellSize;

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const x = (i % bytesPerRow) * cellSize;
        const y = Math.floor(i / bytesPerRow) * cellSize;

        return (
          <rect
            key={`sparkline-${i}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={`#${mapColor(d)}`}
          />
        );
      })}
    </svg>
  );
};
