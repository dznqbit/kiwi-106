import { Container } from "@mantine/core";
import { ConfigPanel } from "./ConfigPanel";
import { NoteTester } from "./NoteTester";

export const JunoProgrammer = () => {
  return (
    <Container size="lg">
      <ConfigPanel />
      <NoteTester />
    </Container>
  );
};
