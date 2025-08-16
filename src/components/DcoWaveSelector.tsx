import { Group, Stack, Text } from "@mantine/core";
import { DcoWave, KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";
import { JunoButton } from "./JunoButton";
import { WaveformIcon } from "./WaveformIcon";

interface DcoWaveSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

// Based on SysEx docs: 0000zyxx where y=Saw(Ramp) On/Off, z=Pulse(PWM) On/Off
// Mapping DcoWave types to MIDI CC ranges
const dcoWaveRanges: Record<DcoWave, MidiCcValue[]> = {
  "off": [0, 31],                    // PWM=0, Ramp=0 (zy=00)
  "ramp": [32, 63],                  // PWM=0, Ramp=1 (zy=01)  
  "pulse": [64, 95],                 // PWM=1, Ramp=0 (zy=10)
  "ramp-and-pulse": [96, 127],       // PWM=1, Ramp=1 (zy=11)
};

export const DcoWaveSelector = ({
  property,
  label,
}: DcoWaveSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const dcoWaveValue = kiwiPatch[property];

  if (!isMidiCcValue(dcoWaveValue)) {
    throw new Error("Woah! can't set string from DcoWaveSelector");
  }

  const ccValueToDcoWave = (ccValue: MidiCcValue): DcoWave => {
    for (const [waveValue, [min, max]] of Object.entries(dcoWaveRanges)) {
      if (ccValue >= min && ccValue <= max) {
        return waveValue as DcoWave;
      }
    }
    return "off"; // Default fallback
  };

  const dcoWave: DcoWave = ccValueToDcoWave(dcoWaveValue);

  const isPwmOn = dcoWave === "pulse" || dcoWave === "ramp-and-pulse";
  const isRampOn = dcoWave === "ramp" || dcoWave === "ramp-and-pulse";

  const togglePwm = () => {
    let newWave: DcoWave;
    if (isPwmOn) {
      newWave = isRampOn ? "ramp" : "off";
    } else {
      newWave = isRampOn ? "ramp-and-pulse" : "pulse";
    }
    setDcoWave(newWave);
  };

  const toggleRamp = () => {
    let newWave: DcoWave;
    if (isRampOn) {
      newWave = isPwmOn ? "pulse" : "off";
    } else {
      newWave = isPwmOn ? "ramp-and-pulse" : "ramp";
    }
    setDcoWave(newWave);
  };

  const setDcoWave = (wave: DcoWave) => {
    const waveToCcValue = (wave: DcoWave): MidiCcValue => {
      const [min, _] = dcoWaveRanges[wave];
      const midiCcValue = min;
      if (!isMidiCcValue(midiCcValue)) {
        throw new Error("Computed impossible Midi CC value");
      }

      return midiCcValue;
    };

    const dcoWaveCcValue = waveToCcValue(wave);
    console.log("Setting DCO wave", wave, dcoWaveCcValue);
    setKiwiPatchProperty(property, dcoWaveCcValue, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap="0" pr="sm" align="center" justify="flex-start">
      <Group gap="0">
        <JunoButton
          label={<WaveformIcon type="pwm" width={24} height={24} stroke="var(--mantine-color-gray-4)" strokeWidth={2} />}
          isSelected={isPwmOn}
          onClick={togglePwm}
        />
        <JunoButton
          label={<WaveformIcon type="sawtooth" width={24} height={24} stroke="var(--mantine-color-gray-4)" strokeWidth={2} />}
          isSelected={isRampOn}
          onClick={toggleRamp}
        />
      </Group>
    </Stack>
  );
};