import { Button, Stack, Text } from "@mantine/core";
import { isLfoSource, KiwiPatch, LfoSource } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

interface LfoSelectorButtonProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const LfoSelector = ({ property, label }: LfoSelectorButtonProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const lfoSource = kiwiPatch[property];

  if (!isLfoSource(lfoSource)) {
    throw new Error(`LfoSelector expected string source for "${property}"`);
  }

  const setLfoSource = (lfoSource: LfoSource) => {
    console.log(`Setting ${property} LFO source`, lfoSource);
    setKiwiPatchProperty(property, lfoSource, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <LfoButton
        label="LFO1"
        lfoSource="lfo1"
        isSelected={lfoSource === "lfo1"}
        onClick={() => setLfoSource("lfo1")}
      />
      <LfoButton
        label="LFO2"
        lfoSource="lfo2"
        isSelected={lfoSource === "lfo2"}
        onClick={() => setLfoSource("lfo2")}
      />
    </Stack>
  );
};

interface LfoButtonProps {
  label?: string;
  lfoSource: LfoSource;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const LfoButton = ({
  lfoSource,
  isSelected,
  onClick,
  size,
  label,
}: LfoButtonProps) => {
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
      {label ?? lfoSource}
    </Button>
  );
};
