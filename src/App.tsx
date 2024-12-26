import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { MidiContextProvider } from "./contexts/MidiContext";
import { ConfigPanel } from "./components/ConfigPanel";
import { NoteTester } from "./components/NoteTester";

function App() {
  return (
    <MantineProvider defaultColorScheme="dark">
      <MidiContextProvider>
        <h1>Kiwi 106 Programmer</h1>
        <ConfigPanel />
        <NoteTester />
      </MidiContextProvider>
    </MantineProvider>
  );
}

export default App;
