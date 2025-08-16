import { Button, Stack, Text } from "@mantine/core";
import { EnvelopeSource, KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";
import _ from "lodash";

interface EnvelopeSelectorButtonProps {
  property: keyof KiwiPatch;
  label?: string;
}

const envelopeSelectRanges: Record<EnvelopeSource, MidiCcValue[]> = {
  "env1": [0, 31],
  "env2": [64, 95],
  "env1-inverted": [32, 63],
  "env2-inverted": [96, 127]
};

export const EnvelopeSelector = ({
  property,
  label,
}: EnvelopeSelectorButtonProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const envSelectValue = kiwiPatch[property];

  if (!isMidiCcValue(envSelectValue)) {
    throw new Error("Woah! can't set string from WaveformSelector");
  }

  const ccValueToEnvelopeSource = (ccValue: MidiCcValue): EnvelopeSource => {
    for (const [envSelectValue, [min, max]] of Object.entries(envelopeSelectRanges)) {
      if (ccValue >= min && ccValue <= max) {
        return envSelectValue as EnvelopeSource;
      }
    }
    return "env1"; // Default fallback
  };

  const envelopeSource: EnvelopeSource = ccValueToEnvelopeSource(envSelectValue);

  const setEnvelopeSource = (waveform: EnvelopeSource) => {
    const waveformToCcValue = (waveform: EnvelopeSource): MidiCcValue => {
      const [min, _] = envelopeSelectRanges[waveform];
      const midiCcValue = min;
      if (!isMidiCcValue(midiCcValue)) {
        throw new Error("Computed impossible Midi CC value");
      }

      return midiCcValue;
    };

    const envelopeSourceCcValue = waveformToCcValue(waveform);
    console.log("Alright set", envelopeSourceCcValue);
    setKiwiPatchProperty(property, envelopeSourceCcValue, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <EnvelopeButton
        label="ENV1"
        envelope="env1"
        isSelected={envelopeSource === "env1"}
        onClick={() => setEnvelopeSource("env1")}
      />
      <EnvelopeButton
        label="iENV1"
        envelope="env1-inverted"
        isSelected={envelopeSource === "env1-inverted"}
        onClick={() => setEnvelopeSource("env1-inverted")}
      />
      <EnvelopeButton
        label="ENV2"
        envelope="env2"
        isSelected={envelopeSource === "env2"}
        onClick={() => setEnvelopeSource("env2")}
      />
      <EnvelopeButton
        label="iENV2"
        envelope={"env2-inverted"}
        isSelected={envelopeSource === "env2-inverted"}
        onClick={() => setEnvelopeSource("env2-inverted")}
      />
    </Stack>
  );
};

interface EnvelopeButtonProps {
  label?: string;
  envelope: EnvelopeSource;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const EnvelopeButton = ({ envelope, isSelected, onClick, size, label }: EnvelopeButtonProps) => {
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
      {label ?? envelope}
    </Button>
  );
}