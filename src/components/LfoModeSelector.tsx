import { Button, Stack, Text } from "@mantine/core";
import { isLfoMode, KiwiPatch, LfoMode } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

interface LfoModeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const LfoModeSelector = ({ property, label }: LfoModeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const lfoMode = kiwiPatch[property];

  if (!isLfoMode(lfoMode)) {
    throw new Error(`LfoModeSelector expected LfoMode for "${property}"`);
  }

  const setLfoMode = (lfoMode: LfoMode) => {
    console.log(`Setting ${property} LFO mode`, lfoMode);
    setKiwiPatchProperty(property, lfoMode, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <LfoModeButton
        label="±"
        lfoMode="normal"
        isSelected={lfoMode === "normal"}
        onClick={() => setLfoMode("normal")}
      />
      <LfoModeButton
        label="+"
        lfoMode="plus"
        isSelected={lfoMode === "plus"}
        onClick={() => setLfoMode("plus")}
      />
    </Stack>
  );
};

interface LfoModeButtonProps {
  label?: string;
  lfoMode: LfoMode;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const LfoModeButton = ({
  lfoMode,
  isSelected,
  onClick,
  size,
  label,
}: LfoModeButtonProps) => {
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
      {label ?? lfoMode}
    </Button>
  );
};
