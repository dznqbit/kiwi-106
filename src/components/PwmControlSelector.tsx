import { Button, Stack, Text } from "@mantine/core";
import { PwmControlSource, KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";

interface PwmControlSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

const pwmControlRanges: Record<PwmControlSource, MidiCcValue[]> = {
  "manual": [0, 18],
  "lfo1": [19, 36],
  "lfo2": [37, 54],
  "env1": [55, 72],
  "env2": [73, 90],
  "env1-inverted": [91, 108],
  "env2-inverted": [109, 127],
};

export const PwmControlSelector = ({
  property,
  label,
}: PwmControlSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const pwmControlCcValue = kiwiPatch[property];

  if (!isMidiCcValue(pwmControlCcValue)) {
    throw new Error("Woah! can't set string from PwmControlSelector");
  }

  const ccValueToPwmControl = (ccValue: MidiCcValue): PwmControlSource => {
    for (const [pwmControl, [min, max]] of Object.entries(pwmControlRanges)) {
      if (ccValue >= min && ccValue <= max) {
        return pwmControl as PwmControlSource;
      }
    }
    return "manual"; // Default fallback
  };

  const pwmControl: PwmControlSource = ccValueToPwmControl(pwmControlCcValue);

  const setPwmControl = (pwmControl: PwmControlSource) => {
    const pwmControlToCcValue = (pwmControl: PwmControlSource): MidiCcValue => {
      const [min, _] = pwmControlRanges[pwmControl];
      const midiCcValue = min;
      if (!isMidiCcValue(midiCcValue)) {
        throw new Error("Computed impossible Midi CC value");
      }

      return midiCcValue;
    };

    const pwmControlCcValue = pwmControlToCcValue(pwmControl);
    console.log("Setting PWM control", pwmControlCcValue);
    setKiwiPatchProperty(property, pwmControlCcValue, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <PwmControlButton
        label="MAN"
        pwmControl="manual"
        isSelected={pwmControl === "manual"}
        onClick={() => setPwmControl("manual")}
      />
      <PwmControlButton
        label="LFO1"
        pwmControl="lfo1"
        isSelected={pwmControl === "lfo1"}
        onClick={() => setPwmControl("lfo1")}
      />
      <PwmControlButton
        label="LFO2"
        pwmControl="lfo2"
        isSelected={pwmControl === "lfo2"}
        onClick={() => setPwmControl("lfo2")}
      />
      <PwmControlButton
        label="ENV1"
        pwmControl="env1"
        isSelected={pwmControl === "env1"}
        onClick={() => setPwmControl("env1")}
      />
      <PwmControlButton
        label="iENV1"
        pwmControl="env1-inverted"
        isSelected={pwmControl === "env1-inverted"}
        onClick={() => setPwmControl("env1-inverted")}
      />
      <PwmControlButton
        label="ENV2"
        pwmControl="env2"
        isSelected={pwmControl === "env2"}
        onClick={() => setPwmControl("env2")}
      />
      <PwmControlButton
        label="iENV2"
        pwmControl="env2-inverted"
        isSelected={pwmControl === "env2-inverted"}
        onClick={() => setPwmControl("env2-inverted")}
      />
    </Stack>
  );
};

interface PwmControlButtonProps {
  label?: string;
  pwmControl: PwmControlSource;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const PwmControlButton = ({ pwmControl, isSelected, onClick, size, label }: PwmControlButtonProps) => {
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
      {label ?? pwmControl}
    </Button>
  );
}