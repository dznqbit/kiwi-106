import {
  Modal,
  Stack,
  Group,
  Divider,
  Flex,
  Button,
  Fieldset,
  Select,
  Text,
  MantineStyleProp,
  Space,
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
import { useCallback, useEffect, useState } from "react";
import { KiwiGlobalData } from "../types/KiwiGlobalData";
import { Kiwi106Context } from "../contexts/Kiwi106Context";

interface ConfigModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ConfigModal = ({ opened, onClose }: ConfigModalProps) => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();
  const kiwi106Context = useKiwi106Context();

  const [localKiwiGlobalData, setLocalKiwiGlobalData] =
    useState<KiwiGlobalData | null>(null);

  useEffect(() => {
    if (kiwi106Context.active) {
      console.log("set the damn context");
      setLocalKiwiGlobalData(kiwi106Context.kiwiGlobalData);
    }
  }, [kiwi106Context]);

  const formatName = (i: MidiPortData | null) =>
    i == null ? null : `${i.manufacturer} ${i.name}`;
  const findInputByFormattedName = (fn: string | null) =>
    configStore.availableInputs.find((i) => formatName(i) === fn) ?? null;
  const findOutputByFormattedName = (fn: string | null) =>
    configStore.availableOutputs.find((o) => formatName(o) === fn) ?? null;

  const sendSysexGlobalDump = useCallback(() => {
    if (kiwi106Context.active && localKiwiGlobalData) {
      console.log("[sendSysexGlobalDump]", localKiwiGlobalData);
      kiwi106Context.kiwiMidi.sendSysexGlobalDump(localKiwiGlobalData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kiwi106Context.active, localKiwiGlobalData]);

  return (
    <Modal.Root opened={opened} onClose={onClose} size="xl">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header px={0} pb={4}>
          <Stack gap="xs" style={{ width: "100%" }}>
            <Group px="md" style={{ width: "100%" }}>
              <Modal.Title>CONFIGURATION</Modal.Title>
              <Modal.CloseButton />
            </Group>
            <Divider color="dark.0" size="xl" mx="md" />
            <Flex mx="md" mt={4} justify="space-between">
              <Version kiwi106Context={kiwi106Context} />
              <Space />
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
                  onClick={() => {
                    if (kiwi106Context.active) {
                      kiwi106Context.kiwiMidi.requestSysexGlobalDump();
                    }
                  }}
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
                      (i) => `${i.manufacturer} ${i.name}`,
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
                      (i) => `${i.manufacturer} ${i.name}`,
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

            {localKiwiGlobalData && (
              <ConfigPanel
                kiwiGlobalData={localKiwiGlobalData}
                setKiwiGlobalData={setLocalKiwiGlobalData}
              />
            )}
          </Stack>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

interface VersionProps {
  kiwi106Context: Kiwi106Context;
}

function Version({ kiwi106Context }: VersionProps) {
  const style: MantineStyleProp = {
    fontFamily: "RetroComputer, PokemonClassic, monospace",
    fontSize: "0.6rem",
  };
  if (kiwi106Context.active) {
    return (
      <Group gap="md">
        <Group gap="xs">
          <Text style={style}>Program</Text>
          <Text style={style}>v{kiwi106Context.programVersion}</Text>
        </Group>

        <Group gap="xs">
          <Text style={style}>Bootloader</Text>
          <Text style={style}>v{kiwi106Context.bootloaderVersion}</Text>
        </Group>

        <Group gap="xs">
          <Text style={style}>Build</Text>
          <Text style={style}>v{kiwi106Context.buildNumber}</Text>
        </Group>
      </Group>
    );
  }
}
