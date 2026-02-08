import { Box, Button, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";
import { IndicatorLed } from "./IndicatorLed";

interface JunoButtonProps {
  label: string | ReactNode;
  isSelected?: boolean;
  onClick: () => void;
  size?: "sm" | "md" | "lg";
}

export const JunoButton = ({
  label,
  isSelected = false,
  onClick,
  size = "md",
}: JunoButtonProps) => {
  const ledSize = {
    sm: 6,
    md: 8,
    lg: 10,
  }[size];

  const buttonSize = {
    sm: 24,
    md: 36,
    lg: 48,
  }[size];

  return (
    <Stack gap={4} align="center">
      {typeof label === "string" ? (
        <Text size="sm" fw="bold">
          {label}
        </Text>
      ) : (
        <Box style={{ fontSize: "12px", fontWeight: "bold" }}>{label}</Box>
      )}

      <IndicatorLed status={isSelected ? "selected" : "init"} />

      <Box bg="black" py={2} px={1}>
        <Button
          style={{ height: `${buttonSize}px`, width: `${buttonSize * 1.4}px` }}
          variant="beige"
          onClick={onClick}
        />
      </Box>
    </Stack>
  );
};
