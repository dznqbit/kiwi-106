import { Slider } from "@mantine/core";
import { KiwiPatch } from "../types/KiwiPatch";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";

interface KiwiPatchPropertySlider {
  property: keyof KiwiPatch;
}
export const KiwiPatchPropertySlider = ({
  property,
}: KiwiPatchPropertySlider) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();

  return (
    <Slider
      labelAlwaysOn
      value={kiwiPatch[property]}
      onChange={(v) =>
        setKiwiPatchProperty(property, trimMidiCcValue(v), {
          updatedBy: "Editor Change",
        })
      }
      min={0}
      max={127}
    />
  );
};
