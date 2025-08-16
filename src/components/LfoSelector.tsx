import { Button, Stack, Text } from "@mantine/core";
import { KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";

export type LfoSource = "lfo1" | "lfo2";

interface LfoSelectorButtonProps {
  property: keyof KiwiPatch;
  label?: string;
}

const lfoSelectRanges: Record<LfoSource, MidiCcValue[]> = {
  "lfo1": [0, 63],
  "lfo2": [64, 127]
};

export const LfoSelector = ({
  property,
  label,
}: LfoSelectorButtonProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const lfoSelectValue = kiwiPatch[property];

  if (!isMidiCcValue(lfoSelectValue)) {
    throw new Error("Woah! can't set string from LfoSelector");
  }

  const ccValueToLfoSource = (ccValue: MidiCcValue): LfoSource => {
    for (const [lfoSelectValue, [min, max]] of Object.entries(lfoSelectRanges)) {
      if (ccValue >= min && ccValue <= max) {
        return lfoSelectValue as LfoSource;
      }
    }
    return "lfo1"; // Default fallback
  };

  const lfoSource: LfoSource = ccValueToLfoSource(lfoSelectValue);

  const setLfoSource = (lfoSource: LfoSource) => {
    const lfoSourceToCcValue = (lfoSource: LfoSource): MidiCcValue => {
      const [min, _] = lfoSelectRanges[lfoSource];
      const midiCcValue = min;
      if (!isMidiCcValue(midiCcValue)) {
        throw new Error("Computed impossible Midi CC value");
      }

      return midiCcValue;
    };

    const lfoSourceCcValue = lfoSourceToCcValue(lfoSource);
    console.log("Setting LFO source", lfoSourceCcValue);
    setKiwiPatchProperty(property, lfoSourceCcValue, {
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

const LfoButton = ({ lfoSource, isSelected, onClick, size, label }: LfoButtonProps) => {
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
}