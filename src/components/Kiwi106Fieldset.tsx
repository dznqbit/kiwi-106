import { Box, Text } from "@mantine/core";
import { ReactNode } from "react";

interface Kiwi106FieldsetProps {
  legend: string;
  children: ReactNode;
}

export const Kiwi106Fieldset = ({ legend, children }: Kiwi106FieldsetProps) => {
  return (
    <Box>
      <Text
        size="sm"
        fw="bold"
        style={{
          backgroundColor: "#d53d49",
          color: "white",
          padding: "4px 8px",
          width: "100%",
          display: "block",
          margin: 0,
          textAlign: "center",
        }}
      >
        {legend}
      </Text>
      <Box
        style={{
          padding: "8px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
