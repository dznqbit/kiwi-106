import { Group, Stack, Text } from "@mantine/core";
import { KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";
import { JunoButton } from "./JunoButton";

export type DcoRange = "16" | "8" | "4";

interface DcoRangeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

// Based on SysEx docs: xx=DCO Range (00=16', 01=8', 10=4')
// We'll map these to MIDI CC ranges
const dcoRangeRanges: Record<DcoRange, MidiCcValue[]> = {
  "16": [0, 42], // 00 binary pattern
  "8": [43, 85], // 01 binary pattern
  "4": [86, 127], // 10 binary pattern
};

export const DcoRangeSelector = ({
  property,
  label,
}: DcoRangeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const dcoRangeValue = kiwiPatch[property];

  if (!isMidiCcValue(dcoRangeValue)) {
    throw new Error("Woah! can't set string from DcoRangeSelector");
  }

  const ccValueToDcoRange = (ccValue: MidiCcValue): DcoRange => {
    for (const [rangeValue, [min, max]] of Object.entries(dcoRangeRanges)) {
      if (ccValue >= min && ccValue <= max) {
        return rangeValue as DcoRange;
      }
    }
    return "16"; // Default fallback
  };

  const dcoRange: DcoRange = ccValueToDcoRange(dcoRangeValue);

  const setDcoRange = (range: DcoRange) => {
    const rangeToCcValue = (range: DcoRange): MidiCcValue => {
      const [min, _] = dcoRangeRanges[range];
      const midiCcValue = min;
      if (!isMidiCcValue(midiCcValue)) {
        throw new Error("Computed impossible Midi CC value");
      }

      return midiCcValue;
    };

    const dcoRangeCcValue = rangeToCcValue(range);
    console.log("Setting DCO range", dcoRangeCcValue);
    setKiwiPatchProperty(property, dcoRangeCcValue, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap="0" pr="sm" align="center" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <Group gap="0">
        <JunoButton
          label="16'"
          isSelected={dcoRange === "16"}
          onClick={() => setDcoRange("16")}
        />
        <JunoButton
          label="8'"
          isSelected={dcoRange === "8"}
          onClick={() => setDcoRange("8")}
        />
        <JunoButton
          label="4'"
          isSelected={dcoRange === "4"}
          onClick={() => setDcoRange("4")}
        />
      </Group>
    </Stack>
  );
};
