import { Group, Stack, Text } from "@mantine/core";
import { type ChorusMode, isChorusMode, KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { JunoButton } from "./JunoButton";

interface ChorusModeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const ChorusModeSelector = ({
  property,
  label,
}: ChorusModeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const chorusMode = kiwiPatch[property];

  if (!isChorusMode(chorusMode)) {
    throw new Error(`Woah! Can't assign ChorusModeSelector="${chorusMode}"`);
  }

  const setChorusMode = (mode: ChorusMode) => {
    setKiwiPatchProperty(property, mode, {
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
          label="Off"
          isSelected={chorusMode === "off"}
          onClick={() => setChorusMode("off")}
        />
        <JunoButton
          label="I"
          isSelected={chorusMode === "chorus1"}
          onClick={() => setChorusMode("chorus1")}
        />
        <JunoButton
          label="II"
          isSelected={chorusMode === "chorus2"}
          onClick={() => setChorusMode("chorus2")}
        />
      </Group>
    </Stack>
  );
};
