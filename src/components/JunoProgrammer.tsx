import { Container } from "@mantine/core";
import { ConfigPanel } from "./ConfigPanel";
import { NoteTester } from "./NoteTester";
import { HexCalculator } from "./HexCalculator";
import { MidiMessageTable } from "./MidiMessageTable";

export const JunoProgrammer = () => {
  return (
    <Container size="lg">
      <ConfigPanel />
      <MidiMessageTable />
      <HexCalculator />
      <NoteTester />
    </Container>
  );
};
