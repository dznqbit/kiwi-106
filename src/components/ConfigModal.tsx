import { Modal, Stack, Group, Title, Divider, Flex, Button } from "@mantine/core";
import { IconRefresh, IconWorldDown, IconWorldUp } from "@tabler/icons-react";
import { ConfigPanel } from "./ConfigPanel";
import { JunoButtonGroup } from "./JunoButtonGroup";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { useMidiContext } from "../hooks/useMidiContext";

interface ConfigModalProps {
  opened: boolean;
  onClose: () => void;
}

export const ConfigModal = ({ opened, onClose }: ConfigModalProps) => {
  const midiContext = useMidiContext();
  const { kiwiMidi } = useKiwi106Context();
  
  const sendSysexGlobalDump = () => {
    // TODO: grab all the shit
    console.log("[sendSysexGlobalDump]")
  }

  return (
    <Modal.Root
      opened={opened}
      onClose={onClose}
      size="xl"
    >
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
          <ConfigPanel />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
