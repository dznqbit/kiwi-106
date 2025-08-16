import { Button } from "@mantine/core";
import { WaveformIcon } from "./WaveformIcon";
import { LfoWaveform } from "../types/KiwiPatch";

interface WaveformButtonProps {
  waveform: LfoWaveform;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const WaveformButton = ({
  waveform,
  isSelected = false,
  onClick,
  size = "sm",
}: WaveformButtonProps) => {
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
      <WaveformIcon
        type={waveform}
        width={16}
        height={16}
        stroke={isSelected ? "white" : "currentColor"}
      />
    </Button>
  );
};
