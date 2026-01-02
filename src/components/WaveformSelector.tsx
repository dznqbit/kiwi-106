import { Stack, Text } from "@mantine/core";
import { LfoWaveform, isLfoWaveform } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { WaveformButton } from "./WaveformButton";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import _ from "lodash";

interface WaveformSelectorProps {
  property: "lfo1Wave" | "lfo2Wave";
  label?: string;
}

export const WaveformSelector = ({
  property,
  label,
}: WaveformSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const waveform = kiwiPatch[property];

  if (!isLfoWaveform(waveform)) {
    throw new Error(`Woah! WaveformSelector cannot handle ${waveform}`);
  }

  const setWaveform = (waveform: LfoWaveform) => {
    setKiwiPatchProperty(property, waveform, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <WaveformButton
        waveform={"sine"}
        isSelected={waveform === "sine"}
        onClick={() => setWaveform("sine")}
      />
      <WaveformButton
        waveform="triangle"
        isSelected={waveform === "triangle"}
        onClick={() => setWaveform("triangle")}
      />
      <WaveformButton
        waveform="square"
        isSelected={waveform === "square"}
        onClick={() => setWaveform("square")}
      />
      <WaveformButton
        waveform={"sawtooth"}
        isSelected={waveform === "sawtooth"}
        onClick={() => setWaveform("sawtooth")}
      />
      <WaveformButton
        waveform={"reverse-sawtooth"}
        isSelected={waveform === "reverse-sawtooth"}
        onClick={() => setWaveform("reverse-sawtooth")}
      />
      <WaveformButton
        waveform={"random"}
        isSelected={waveform === "random"}
        onClick={() => setWaveform("random")}
      />
    </Stack>
  );
};
