import { KiwiPatch } from "../types/KiwiPatch";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";
import { VerticalSlider, type VerticalSliderProps } from "./VerticalSlider";
import { Code, Stack, Title } from "@mantine/core";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";

interface KiwiPatchPropertySlider {
  label?: string;
  property: keyof KiwiPatch;
  sliderProps?: Pick<VerticalSliderProps, "min" | "max">;
}

export const KiwiPatchPropertySlider = ({
  label,
  property,
  sliderProps,
}: KiwiPatchPropertySlider) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();

  if (property === "patchName") {
    throw new Error("Cannot draw slider for patch name");
  }

  const value = kiwiPatch[property];

  return (
    <Stack align="center">
      <Title order={6}>{label ?? kiwiPatchLabel(property)}</Title>

      <VerticalSlider
        value={value}
        onChange={(v) => {
          setKiwiPatchProperty(property, trimMidiCcValue(v), {
            updatedBy: "Editor Change",
          });
        }}
        {...sliderProps}
      />

      <Code>{value}</Code>
    </Stack>
  );
};
