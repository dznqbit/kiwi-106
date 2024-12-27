import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContextProvider";
import { JunoProgrammer } from "./components/JunoProgrammer";

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <MidiContextProvider>
        <JunoProgrammer />
      </MidiContextProvider>
    </MantineProvider>
  );
}

export default App;
