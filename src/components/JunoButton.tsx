import { Box, Button, Stack, Text } from "@mantine/core";

interface JunoButtonProps {
  label: string;
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
      <Text size="sm" fw="bold">
        {label}
      </Text>

      <Box
        style={{
          margin: "8px 0 4px 0",
          width: ledSize,
          height: ledSize,
          borderRadius: "50%",
          backgroundColor: isSelected ? "#ff0000" : "#880000",
          transition: "all 0.15s ease",
        }}
      />

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
