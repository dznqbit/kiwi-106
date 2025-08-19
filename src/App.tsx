import "@mantine/core/styles.css";
import { MantineProvider, Container } from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContextProvider";
import { JunoProgrammer } from "./components/JunoProgrammer";
import { mantineTheme } from "./mantineTheme";
import { ConfigPanel } from "./components/ConfigPanel";
import { MidiMessageTable } from "./components/MidiMessageTable";
import { Kiwi106ContextProvider } from "./contexts/Kiwi106ContextProvider";

function App() {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
      <MidiContextProvider>
        <Kiwi106ContextProvider>
          <Container size="lg">
            <ConfigPanel />
            <MidiMessageTable />
          </Container>
          <JunoProgrammer />
        </Kiwi106ContextProvider>
      </MidiContextProvider>
    </MantineProvider>
  );
}

export default App;
