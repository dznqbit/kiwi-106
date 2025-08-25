import { Box, BoxProps } from "@mantine/core";
import { ReactNode } from "react";

export const JunoButtonContainer = ({
  children,
  ...rest
}: BoxProps & { children: ReactNode }) => {
  return (
    <Box bg="black" px={1} py={4} {...rest}>
      {children}
    </Box>
  );
};
