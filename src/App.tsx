import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContextProvider";
import { JunoProgrammer } from "./components/JunoProgrammer";
import { mantineTheme } from "./mantineTheme";

function App() {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
      <MidiContextProvider>
        <JunoProgrammer />
      </MidiContextProvider>
    </MantineProvider>
  );
}

export default App;
