import { Group } from "@mantine/core";
import { KiwiPatchAddress } from "../types/KiwiPatch";

interface SegmentDisplayProps {
  x: number;
  y: number;
  w: number;
  h: number;
  isOn: boolean;
  id: string;
}

interface SevenSegmentDisplayProps {
  value: number | null;
  size?: number;
  color?: string;
  offColor?: string;
}

interface SevenSegmentDigitProps {
  digit: number;
  dot: boolean;
  size: number;
  color: string;
  offColor: string;
}

const SevenSegmentDigit = ({
  digit,
  dot = false,
  size,
  color,
  offColor,
}: SevenSegmentDigitProps) => {
  const segmentPatterns = {
    [-1]: [false, false, false, false, false, false, true],
    0: [true, true, true, true, true, true, false],
    1: [false, true, true, false, false, false, false],
    2: [true, true, false, true, true, false, true],
    3: [true, true, true, true, false, false, true],
    4: [false, true, true, false, false, true, true],
    5: [true, false, true, true, false, true, true],
    6: [true, false, true, true, true, true, true],
    7: [true, true, true, false, false, false, false],
    8: [true, true, true, true, true, true, true],
  };

  const segments = segmentPatterns[digit as keyof typeof segmentPatterns] || [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  const width = size;
  const height = size * 1.5;
  const thickness = size * 0.14;
  const gap = thickness * 0.3;
  const segmentHeight = (height - thickness * 3 - gap * 2) / 2;

  const TopSegment = ({ x, y, w, isOn, id }: SegmentDisplayProps) => {
    return (
      <polygon
        id={id}
        points={`
        ${x},${y}
        ${x + w},${y}
        ${x + w - thickness},${y + thickness}
        ${x + thickness},${y + thickness}
        ${x},${y}
      `}
        style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
      />
    );
  };

  const TopRightSegment = ({ x, y, h, isOn, id }: SegmentDisplayProps) => (
    <polygon
      id={id}
      points={`
        ${x + thickness},${y - thickness}
        ${x + thickness},${y + thickness / 2}
        ${x + thickness},${y + h - thickness / 2}
        ${x + thickness / 2},${y + h}
        ${x},${y + h - thickness / 2}
        ${x},${y}
      `}
      style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
    />
  );

  const BottomRightSegment = ({ x, y, h, isOn, id }: SegmentDisplayProps) => (
    <polygon
      id={id}
      points={`
        ${x + thickness / 2},${y - thickness / 2}
        ${x + thickness},${y}
        ${x + thickness},${y + h}
        ${x},${y + h - thickness}
        ${x},${y + h - thickness / 2}
        ${x},${y}
      `}
      style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
    />
  );

  const BottomSegment = ({ x, y, w, isOn, id }: SegmentDisplayProps) => {
    return (
      <polygon
        id={id}
        points={`
        ${x},${y + thickness}
        ${x + thickness},${y}
        ${x + w - thickness},${y}
        ${x + w},${y + thickness}
        ${x},${y + thickness}
      `}
        style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
      />
    );
  };

  const BottomLeftSegment = ({ x, y, h, isOn, id }: SegmentDisplayProps) => (
    <polygon
      id={id}
      points={`
        ${x + thickness / 2},${y - thickness / 2}
        ${x + thickness},${y}
        ${x + thickness},${y + h - thickness}
        ${x},${y + h}
        ${x},${y}
      `}
      style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
    />
  );

  const TopLeftSegment = ({ x, y, h, isOn, id }: SegmentDisplayProps) => (
    <polygon
      id={id}
      points={`
        ${x},${y - thickness}
        ${x + thickness},${y}
        ${x + thickness},${y + thickness / 2}
        ${x + thickness},${y + h - thickness / 2}
        ${x + thickness / 2},${y + h}
        ${x},${y + h - thickness / 2}
      `}
      style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
    />
  );

  const MiddleSegment = ({ x, y, w, isOn, id }: SegmentDisplayProps) => (
    <polygon
      id={id}
      points={`
        ${x + thickness / 2},${y + thickness / 2}
        ${x + thickness},${y}
        ${x + w - thickness},${y}
        ${x + w - thickness / 2},${y + thickness / 2}
        ${x + w - thickness},${y + thickness}
        ${x + thickness},${y + thickness}
        ${x + thickness / 2},${y + thickness / 2}
      `}
      style={{ fill: isOn ? color : offColor, strokeWidth: 1 }}
    />
  );

  const digitWidth = 0.76 * width;
  const dotRadius = 0.55 * thickness;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height * 0.9}`}>
      <TopSegment
        x={0}
        w={digitWidth}
        h={segmentHeight}
        y={0}
        isOn={segments[0]}
        id="top"
      />
      <TopRightSegment
        x={digitWidth - thickness}
        y={thickness + gap}
        h={segmentHeight}
        w={digitWidth}
        isOn={segments[1]}
        id="topRight"
      />
      <BottomRightSegment
        x={digitWidth - thickness}
        y={2 * thickness + segmentHeight + gap}
        h={segmentHeight}
        w={digitWidth}
        isOn={segments[2]}
        id="bottomRight"
      />
      <BottomSegment
        x={0}
        y={2 * (thickness + segmentHeight) - gap}
        h={segmentHeight}
        w={digitWidth}
        isOn={segments[3]}
        id="bottom"
      />
      <BottomLeftSegment
        x={0}
        y={2 * thickness + segmentHeight + gap}
        h={segmentHeight}
        w={digitWidth}
        isOn={segments[4]}
        id="bottomLeft"
      />
      <TopLeftSegment
        x={0}
        y={thickness + gap}
        h={segmentHeight}
        w={digitWidth}
        isOn={segments[5]}
        id="topLeft"
      />
      <MiddleSegment
        x={gap / 2}
        y={thickness + segmentHeight}
        h={segmentHeight}
        w={digitWidth - gap}
        isOn={segments[6]}
        id="middle"
      />

      {/* dot */}
      <circle
        cx={digitWidth + 2 * gap + dotRadius}
        cy={height - (gap + 2 * dotRadius)}
        r={dotRadius}
        fill={dot ? color : "transparent"}
      />
    </svg>
  );
};

export const SevenSegmentDisplay = ({
  value,
  size = 60,
  color = "#ff0000",
  offColor = "#220000",
}: SevenSegmentDisplayProps) => {
  const digits =
    value === null
      ? [-1, -1]
      : value.toString().padStart(2, "0").split("").map(Number);

  return (
    <Group bg="black" gap={size * 0.3} p={size * 0.3}>
      {digits.map((digit, index) => (
        <SevenSegmentDigit
          key={index}
          dot={false}
          digit={digit}
          size={size}
          color={color}
          offColor={offColor}
        />
      ))}
    </Group>
  );
};

export const KiwiPatchDisplay = ({
  patchAddress,
  size = 60,
}: {
  patchAddress: KiwiPatchAddress | null;
  size?: number;
}) => {
  const color = "#ff0000",
    offColor = "#220000";

  const digits =
    patchAddress === null
      ? [-1, -1, -1]
      : [patchAddress.group, patchAddress.bank, patchAddress.patch];

  return (
    <Group bg="black" gap={size * 0.2} p={size * 0.3} pl={size * 0.45}>
      {digits.map((digit, index) => (
        <SevenSegmentDigit
          key={index}
          dot={index === 0}
          digit={digit}
          size={size}
          color={color}
          offColor={offColor}
        />
      ))}
    </Group>
  );
};
