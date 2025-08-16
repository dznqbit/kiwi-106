import { Stack, Text } from "@mantine/core";
import { LfoWaveform, KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { WaveformButton } from "./WaveformButton";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";
import _ from "lodash";

interface WaveformSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

const waveformRanges: Record<LfoWaveform, MidiCcValue[]> = {
  sine: [0, 15],
  triangle: [16, 31],
  sawtooth: [32, 63],
  "reverse-sawtooth": [64, 95],
  square: [96, 111],
  random: [112, 127],
};

export const WaveformSelector = ({
  property,
  label,
}: WaveformSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const waveformCcValue = kiwiPatch[property];

  if (!isMidiCcValue(waveformCcValue)) {
    throw new Error("Woah! can't set string from WaveformSelector");
  }

  const ccValueToWaveform = (ccValue: MidiCcValue): LfoWaveform => {
    for (const [waveform, [min, max]] of Object.entries(waveformRanges)) {
      if (ccValue >= min && ccValue <= max) {
        return waveform as LfoWaveform;
      }
    }
    return "sine"; // Default fallback
  };

  const waveform: LfoWaveform = ccValueToWaveform(waveformCcValue);

  const setWaveform = (waveform: LfoWaveform) => {
    const waveformToCcValue = (waveform: LfoWaveform): MidiCcValue => {
      const [min, _] = waveformRanges[waveform];
      const midiCcValue = min;
      if (!isMidiCcValue(midiCcValue)) {
        throw new Error("Computed impossible Midi CC value");
      }

      return midiCcValue;
    };

    const waveformCcValue = waveformToCcValue(waveform);
    console.log("Alright set", waveformCcValue);
    setKiwiPatchProperty(property, waveformCcValue, {
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
