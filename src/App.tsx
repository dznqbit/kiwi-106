import "@mantine/core/styles.css";
import {
  MantineProvider,
  Container,
  Button,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContextProvider";
import { JunoProgrammer } from "./components/JunoProgrammer";
import { mantineTheme } from "./mantineTheme";
import { Kiwi106ContextProvider } from "./contexts/Kiwi106ContextProvider";
import { IconInfoCircle, IconSettings } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { H1 } from "./components/H1";
import { MidiPanicButton } from "./components/MidiPanicButton";
import { InitializeMidiContextButton } from "./components/InitializeMidiContextButton";
import { ReactNode } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useKiwi106Context } from "./hooks/useKiwi106Context";
import { JunoButtonGroup } from "./components/JunoButtonGroup";
import { NoteButton } from "./components/NoteButton";
import { SendPatchBufferDumpButton } from "./components/Buttons/SendPatchBufferDumpButton";
import { RequestPatchBufferDumpButton } from "./components/Buttons/RequestPatchBufferDumpButton";
import { AboutModal } from "./components/AboutModal";
import { ConfigModal } from "./components/ConfigModal";
import { HealthMonitor } from "./components/HealthMonitor";

function Kiwi106Programmer() {
  const kiwi106Context = useKiwi106Context();

  const [
    isConfigDrawerOpened,
    { toggle: toggleConfigDrawer, close: closeConfigDrawer },
  ] = useDisclosure(false);

  const [
    isAboutModalOpened,
    { toggle: toggleAboutModal, close: closeAboutModal },
  ] = useDisclosure(false);

  return (
    <>
      <ErrorBoundary>
        <Container size="xl" mt="sm" mb="lg">
          <Stack>
            <Group justify="space-between">
              <Group>
                <H1 p={0} mb={-24}>
                  KIWI-106
                </H1>

                {!kiwi106Context.active && !kiwi106Context.fatalError && (
                  <JunoButtonGroup mt="md">
                    <InitializeMidiContextButton />
                  </JunoButtonGroup>
                )}
              </Group>

              <JunoButtonGroup mt="md">
                <NoteButton title="Test Note" />
                <MidiPanicButton title="Panic" />
                <RequestPatchBufferDumpButton title="Request Patch Buffer Dump" />
                <SendPatchBufferDumpButton title="Send Patch Buffer Dump" />
                <Button
                  title="About"
                  variant="juno"
                  onClick={toggleAboutModal}
                >
                  <IconInfoCircle color="black" />
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

            <HealthMonitor />
            <Divider color="blue" size="xl" />
          </Stack>

          <AboutModal
            opened={isAboutModalOpened}
            onClose={closeAboutModal}
          />
          <ConfigModal
            opened={isConfigDrawerOpened}
            onClose={closeConfigDrawer}
          />
        </Container>
        <JunoProgrammer />
      </ErrorBoundary>
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
