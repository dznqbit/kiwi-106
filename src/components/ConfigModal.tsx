import {
  Modal,
  Stack,
  Group,
  Title,
  Divider,
  Flex,
  Button,
  Fieldset,
  Select,
} from "@mantine/core";
import { IconRefresh, IconWorldDown, IconWorldUp } from "@tabler/icons-react";
import { ConfigPanel } from "./ConfigPanel";
import { JunoButtonGroup } from "./JunoButtonGroup";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { useMidiContext } from "../hooks/useMidiContext";
import { isMidiChannel } from "../types/Midi";
import { SelectMidiChannel } from "./SelectMidiChannel";
import { MidiPortData } from "../contexts/MidiContext";
import { useConfigStore } from "../stores/configStore";

interface ConfigModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ConfigModal = ({ opened, onClose }: ConfigModalProps) => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();
  const { kiwiMidi } = useKiwi106Context();

  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    configStore.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    configStore.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const sendSysexGlobalDump = () => {
    // TODO: grab all the shit
    console.log("[sendSysexGlobalDump]");
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header px={0} pb={4}>
          <Stack gap="xs" style={{ width: "100%" }}>
            <Group px="md" style={{ width: "100%" }}>
              <Modal.Title>
                <Title order={2} style={{ lineHeight: 0.8 }}>
                  CONFIGURATION
                </Title>
              </Modal.Title>
              <Modal.CloseButton style={{ marginTop: -5 }} />
            </Group>
            <Divider color="dark.0" size="xl" mx="md" />
            <Flex mx="md" mt={4} justify="flex-end">
              <JunoButtonGroup mt={0}>
                <Button
                  title="Refresh MIDI Context"
                  variant="juno"
                  onClick={() => midiContext.initialize()}
                >
                  <IconRefresh />
                </Button>
                <Button
                  title="Request Global Dump"
                  variant="juno"
                  onClick={() => kiwiMidi?.requestSysexGlobalDump()}
                >
                  <IconWorldDown />
                </Button>
                <Button
                  title="Send Global Dump"
                  variant="juno"
                  onClick={sendSysexGlobalDump}
                >
                  <IconWorldUp />
                </Button>
              </JunoButtonGroup>
            </Flex>
          </Stack>
        </Modal.Header>
        <Modal.Body pt="md">
          <Stack>
            <Group>
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
                      (i) => `${i.manufacturer} ${i.name}`
                    )}
                    onChange={(fn) =>
                      configStore.setInput(findInputByFormattedName(fn))
                    }
                  ></Select>
                  <SelectMidiChannel
                    enabled={midiContext.enabled}
                    value={configStore.inputChannel}
                    onChange={(c) => {
                      if (isMidiChannel(c)) {
                        configStore.setInputChannel(c);
                      }
                    }}
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
                      (i) => `${i.manufacturer} ${i.name}`
                    )}
                    onChange={(fn) =>
                      configStore.setOutput(findOutputByFormattedName(fn))
                    }
                  ></Select>
                  <SelectMidiChannel
                    enabled={midiContext.enabled}
                    value={configStore.outputChannel}
                    onChange={(c) => {
                      if (isMidiChannel(c)) {
                        configStore.setOutputChannel(c);
                      }
                    }}
                  />
                </Group>
              </Fieldset>
            </Group>

            <ConfigPanel />
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
