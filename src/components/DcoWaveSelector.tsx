import { Group, Stack } from "@mantine/core";
import { DcoWave } from "../types/KiwiPatch";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { JunoButton } from "./JunoButton";
import { WaveformIcon } from "./WaveformIcon";

interface DcoWaveSelectorProps {
  property: "dcoWave";
}

export const DcoWaveSelector = ({ property }: DcoWaveSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const dcoWave = kiwiPatch[property];

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
    console.log("Setting DCO wave", wave);
    setKiwiPatchProperty("dcoWave", wave, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap="0" pr="sm" align="center" justify="flex-start">
      <Group gap="0">
        <JunoButton
          label={
            <WaveformIcon
              type="pwm"
              width={24}
              height={24}
              stroke="var(--mantine-color-gray-4)"
              strokeWidth={2}
            />
          }
          isSelected={isPwmOn}
          onClick={togglePwm}
        />
        <JunoButton
          label={
            <WaveformIcon
              type="sawtooth"
              width={24}
              height={24}
              stroke="var(--mantine-color-gray-4)"
              strokeWidth={2}
            />
          }
          isSelected={isRampOn}
          onClick={toggleRamp}
        />
      </Group>
    </Stack>
  );
};
