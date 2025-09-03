import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Button,
  Group,
  Drawer,
  Stack,
  Divider,
  Code,
} from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContextProvider";
import { JunoProgrammer } from "./components/JunoProgrammer";
import { mantineTheme } from "./mantineTheme";
import { MidiMessageTable } from "./components/MidiMessageTable";
import { Kiwi106ContextProvider } from "./contexts/Kiwi106ContextProvider";
import {
  IconLogs,
  IconSettings,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { H1 } from "./components/H1";
import { MidiPanicButton } from "./components/MidiPanicButton";
import { InitializeMidiContextButton } from "./components/InitializeMidiContextButton";
import { ReactNode } from "react";
import { useKiwi106Context } from "./hooks/useKiwi106Context";
import { JunoButtonGroup } from "./components/JunoButtonGroup";
import { NoteButton } from "./components/NoteButton";
import { SendPatchBufferDumpButton } from "./components/Buttons/SendPatchBufferDumpButton";
import { RequestPatchBufferDumpButton } from "./components/Buttons/RequestPatchBufferDumpButton";
import { ConfigModal } from "./components/ConfigModal";

function Kiwi106Programmer() {
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
    <>
      <Container size="xl" mt="sm" mb="lg">
        <Stack>
          <Group justify="space-between">
            <Group>
              <H1 p={0} mb={-24}>
                KIWI-106
              </H1>
              {!kiwi106Context.active && (
                <Group>
                  <JunoButtonGroup>
                    <InitializeMidiContextButton />
                  </JunoButtonGroup>
                  {kiwi106Context.midiError && (
                    <Code color="red">
                      Something went wrong. Try restarting your browser.
                    </Code>
                  )}
                </Group>
              )}
            </Group>

            <JunoButtonGroup>
              <NoteButton title="Test Note" />
              <MidiPanicButton title="Panic" />
              <SendPatchBufferDumpButton title="Send Patch Buffer Dump" />
              <RequestPatchBufferDumpButton title="Request Patch Buffer Dump" />
              <Button
                title="Logs"
                variant="juno"
                color="orange"
                onClick={toggleMessageLog}
              >
                <IconLogs color="black" />
              </Button>
              <Button
                title="Settings"
                color="orange"
                variant="juno"
                onClick={toggleConfigDrawer}
              >
                <IconSettings color="black" />
              </Button>
            </JunoButtonGroup>
          </Group>
          <Divider color="blue" size="xl" />
        </Stack>

        <ConfigModal
          opened={isConfigDrawerOpened}
          onClose={closeConfigDrawer}
        />

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
    </>
  );
}

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
  return (
    <ContextProviders>
      <Kiwi106Programmer />
    </ContextProviders>
  );
}

export default App;
