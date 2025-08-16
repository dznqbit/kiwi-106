import { Box, Stack, Text, Title } from "@mantine/core";
import { KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { isMidiCcValue, MidiCcValue } from "../types/Midi";

interface JunoToggleSwitchProps {
  property: keyof KiwiPatch;
  label?: string;
  option1: string;
  option2: string;
  // MIDI CC ranges for each option
  option1Range: [MidiCcValue, MidiCcValue];
  option2Range: [MidiCcValue, MidiCcValue];
}

export const JunoToggleSwitch = ({
  property,
  label,
  option1,
  option2,
  option1Range,
  option2Range,
}: JunoToggleSwitchProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const switchValue = kiwiPatch[property];

  if (!isMidiCcValue(switchValue)) {
    throw new Error("Woah! can't set string from JunoToggleSwitch");
  }

  const switchWidth = 20;
  const switchHeight = 22;
  const trackPadding = 2;

  const isOption1 =
    switchValue >= option1Range[0] && switchValue <= option1Range[1];

  const toggleSwitch = () => {
    const newValue = isOption1 ? option2Range[0] : option1Range[0];
    console.log(
      `Toggling ${property} to ${isOption1 ? option2 : option1}`,
      newValue,
    );
    setKiwiPatchProperty(property, newValue, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={8} align="center">
      <Text size="sm" fw="bold">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <Stack gap={0} align="center">
        <Title order={6}>{option1}</Title>

        {/* Switch Track */}
        <Box
          onClick={toggleSwitch}
          style={{
            cursor: "pointer",
            position: "relative",
            width: switchWidth + 2 * trackPadding,
            height: 2 * (switchHeight + trackPadding),
            backgroundColor: "var(--mantine-color-black)",
            margin: "0",
          }}
        >
          {/* Switch Handle */}
          <Box
            style={{
              position: "absolute",
              top: isOption1 ? trackPadding : trackPadding + switchHeight,
              left: trackPadding,
              width: switchWidth,
              height: switchHeight,
              backgroundColor: "var(--mantine-color-gray-8)",
            }}
          >
            <svg width={switchWidth} height={switchHeight}>
              <line
                y1={switchHeight / 2}
                y2={switchHeight / 2}
                x1={0}
                x2={switchWidth}
                stroke="var(--mantine-color-gray-2)"
                strokeWidth={3}
              />
            </svg>
          </Box>
        </Box>

        <Title order={6}>{option2}</Title>
      </Stack>
    </Stack>
  );
};
