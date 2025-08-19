import { Group } from "@mantine/core";
import { ReactNode } from "react";

export const JunoButtonGroup = ({ children }: { children: ReactNode }) => {
  return (
    <Group bg="black" mt="xs" gap={2} p={4}>
      {children}
    </Group>
  );
};
