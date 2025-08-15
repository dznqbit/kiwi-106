import { KiwiPatch } from "../types/KiwiPatch";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { trimMidiCcValue } from "../utils/trimMidiCcValue";
import { VerticalSlider } from "./VerticalSlider";

interface KiwiPatchPropertySlider {
  property: keyof KiwiPatch;
}
export const KiwiPatchPropertySlider = ({
  property,
}: KiwiPatchPropertySlider) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();

  if (property === "patchName") {
    throw new Error("Cannot draw slider for patch name");
  }

  return (
    <VerticalSlider
      value={kiwiPatch[property]}
      onChange={(v) => {
        console.log("Set", v);
        setKiwiPatchProperty(property, trimMidiCcValue(v), {
          updatedBy: "Editor Change",
        });
      }}
    />
  );
};
