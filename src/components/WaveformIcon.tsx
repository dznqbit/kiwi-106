import { LfoWaveform } from "../types/KiwiPatch";

interface WaveformIconProps {
  type: LfoWaveform | "pwm";
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  backgroundColor?: string;
}

export const WaveformIcon = ({
  type,
  width = 40,
  height = 20,
  stroke = "currentColor",
  strokeWidth = 2,
}: WaveformIconProps) => {
  const getPath = () => {
    const midY = height / 2;
    const qY = height / 4;
    const qW = width / 4;

    switch (type) {
      case "sine":
        return `M 0,${midY} Q ${1 * qW},0 ${width * 0.5},${midY} Q ${3 * qW},${height} ${width},${midY}`;

      case "triangle":
        return `M 0,${3 * qY} L ${(1 / 2) * width},${1 * qY} L ${width},${3 * qY}`;

      case "square":
        return `M ${strokeWidth},${3 * qY} L ${strokeWidth},${1 * qY} L ${width * 0.5},${1 * qY} L ${width * 0.5},${3 * qY} L ${width - strokeWidth},${3 * qY} L ${width - strokeWidth},${1 * qY}`;

      case "sawtooth":
        return `M ${strokeWidth},${3 * qY} L ${width - strokeWidth},${1 * qY} L ${width - strokeWidth},${3 * qY}`;

      case "reverse-sawtooth":
        return `M ${width - strokeWidth},${3 * qY} L ${strokeWidth},${1 * qY} L ${strokeWidth},${3 * qY}`;

      case "random":
        return `M 0,${2 * qY} L ${qW * 0.6},${2 * qY} L ${qW * 0.6},${1.2 * qY} L ${qW * 1.3},${1.2 * qY} L ${qW * 1.3},${3.1 * qY} L ${qW * 2.1},${3.1 * qY} L ${qW * 2.1},${1.8 * qY} L ${qW * 2.7},${1.8 * qY} L ${qW * 2.7},${2.9 * qY} L ${qW * 3.4},${2.9 * qY} L ${qW * 3.4},${1.1 * qY} L ${width},${1.1 * qY}`;

      case "pwm":
        return `M ${strokeWidth},${3 * qY} L ${strokeWidth},${1 * qY} L ${0.25 * width},${1 * qY} L ${0.25 * width},${3 * qY} L ${width - strokeWidth},${3 * qY} L ${width - strokeWidth},${1 * qY}
                M ${0.4 * width},${1 * qY} L ${0.5 * width},${1 * qY} L ${0.5 * width},${1.4 * qY} M ${0.5 * width},${2 * qY} L ${0.5 * width},${2.4 * qY}
        `;
    }
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path
        d={getPath()}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
