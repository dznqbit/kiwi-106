import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Button,
  Group,
  Drawer,
  Stack,
  Divider,
  Modal,
  Space,
} from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContextProvider";
import { JunoProgrammer } from "./components/JunoProgrammer";
import { mantineTheme } from "./mantineTheme";
import { ConfigPanel } from "./components/ConfigPanel";
import { MidiMessageTable } from "./components/MidiMessageTable";
import { Kiwi106ContextProvider } from "./contexts/Kiwi106ContextProvider";
import { IconLogs, IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { H1 } from "./components/H1";
import { MidiPanicButton } from "./components/MidiPanicButton";
import { InitializeMidiContextButton } from "./components/InitializeMidiContextButton";
import { ReactNode } from "react";
import { useKiwi106Context } from "./hooks/useKiwi106Context";

function ContextProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
      <MidiContextProvider>
        <Kiwi106ContextProvider>{children}</Kiwi106ContextProvider>
      </MidiContextProvider>
    </MantineProvider>
  );
}

function App() {
  const kiwi106Context = useKiwi106Context();

  const [
    isConfigDrawerOpened,
    { toggle: toggleConfigDrawer, close: closeConfigDrawer },
  ] = useDisclosure(false);
  const [
    isMessageLogOpened,
    { toggle: toggleMessageLog, close: closeMessageLog },
  ] = useDisclosure(false);

  return (
    <ContextProviders>
      <Container size="lg" mt="sm" mb="lg">
        <Stack>
          <Group justify="space-between">
            <Group>
              <H1 p={0} mb={-24}>
                KIWI-106
              </H1>
              {!kiwi106Context.active && (
                <Group bg="black" mt="xs" gap={2} p={4}>
                  <InitializeMidiContextButton />
                </Group>
              )}
            </Group>

            <Group bg="black" mt="xs" gap={2} p={4}>
              <MidiPanicButton title="Panic" />
              <Button
                title="Logs"
                variant="juno"
                color="orange"
                onClick={toggleMessageLog}
                px="xs"
              >
                <IconLogs color="black" />
              </Button>
              <Button
                title="Settings"
                color="orange"
                variant="juno"
                onClick={toggleConfigDrawer}
                px="xs"
              >
                <IconSettings color="black" />
              </Button>
            </Group>
          </Group>
          <Divider color="blue" size="xl" />
        </Stack>

        <Modal
          opened={isConfigDrawerOpened}
          onClose={closeConfigDrawer}
          size="lg"
        >
          <ConfigPanel />
        </Modal>

        <Drawer
          opened={isMessageLogOpened}
          onClose={closeMessageLog}
          position="bottom"
          size="sm"
        >
          <Container>
            <MidiMessageTable />
          </Container>
        </Drawer>
      </Container>

      <JunoProgrammer />
    </ContextProviders>
  );
}

export default App;
