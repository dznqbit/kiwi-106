import { Button, Center, Stack, Text } from "@mantine/core";
import {
  DetuneMode,
  KiwiPatch,
  isKeyAssignDetuneMode,
} from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

interface DetuneModeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const DetuneModeSelector = ({
  property,
  label,
}: DetuneModeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const detuneMode = kiwiPatch[property];

  if (!isKeyAssignDetuneMode(detuneMode)) {
    throw new Error(
      `Woah! DetuneModeSelector for ${property} cannot handle ${detuneMode}`,
    );
  }

  const setDetuneMode = (detuneMode: DetuneMode) => {
    setKiwiPatchProperty(property, detuneMode, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack align="stretch" gap={2}>
      <Center>
        <Text size="sm" fw="bold" pb="sm">
          {label ?? kiwiPatchLabel(property)}
        </Text>
      </Center>
      <DetuneModeButton
        label="ALL"
        detuneMode="all"
        isSelected={detuneMode === "all"}
        onClick={() => setDetuneMode("all")}
      />
      <DetuneModeButton
        label="MONO / UNI"
        detuneMode="mono"
        isSelected={detuneMode === "mono"}
        onClick={() => setDetuneMode("mono")}
      />
    </Stack>
  );
};

interface DetuneModeButtonProps {
  label?: string;
  detuneMode: DetuneMode;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const DetuneModeButton = ({
  detuneMode,
  isSelected,
  onClick,
  size,
  label,
}: DetuneModeButtonProps) => {
  return (
    <Button
      radius={0}
      variant={isSelected ? "filled" : "outline"}
      onClick={onClick}
      size={size}
      style={{
        padding: "8px",
        margin: 0,
      }}
    >
      {label ?? detuneMode}
    </Button>
  );
};
