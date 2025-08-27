import { Group, Stack, Text } from "@mantine/core";
import { type DcoRange, isDcoRange, KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";
import { JunoButton } from "./JunoButton";

interface DcoRangeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const DcoRangeSelector = ({
  property,
  label,
}: DcoRangeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const dcoRange = kiwiPatch[property];

  if (!isDcoRange(dcoRange)) {
    throw new Error(`Woah! Can't assign DcoRangeSelector="${dcoRange}"`);
  }

  // const ccValueToDcoRange = (ccValue: MidiCcValue): DcoRange => {
  //   for (const [rangeValue, [min, max]] of Object.entries(dcoRangeRanges)) {
  //     if (ccValue >= min && ccValue <= max) {
  //       return rangeValue as DcoRange;
  //     }
  //   }
  //   return "16"; // Default fallback
  // };

  const setDcoRange = (range: DcoRange) => {
    // const rangeToCcValue = (range: DcoRange): MidiCcValue => {
    //   const [min, _] = dcoRangeRanges[range];
    //   const midiCcValue = min;
    //   if (!isMidiCcValue(midiCcValue)) {
    //     throw new Error("Computed impossible Midi CC value");
    //   }

    //   return midiCcValue;
    // };

    console.log("Setting DCO range", range);
    setKiwiPatchProperty(property, range, {
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
