import { Group, GroupProps } from "@mantine/core";
import { ReactNode } from "react";

export const JunoButtonGroup = ({
  children, ...props
}: GroupProps & { children: ReactNode }) => {
  return (
    <Group bg="black" mt="xs" gap={2} p={4} {...props}>
      {children}
    </Group>
  );
};
