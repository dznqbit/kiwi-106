import { Box } from "@mantine/core";
import { useMove } from "@mantine/hooks";

interface VerticalSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const VerticalSlider = ({
  value,
  onChange,
  min = 0,
  max = 127,
  step = 1,
}: VerticalSliderProps) => {
  // Convert value to 0-1 range for useMove
  const normalizedValue = (value - min) / (max - min);

  const { ref } = useMove(({ y }) => {
    // Invert y (1 - y) so moving up increases value
    const newNormalizedValue = 1 - y;
    const newValue =
      Math.round((newNormalizedValue * (max - min) + min) / step) * step;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  });

  const trackWidth = 32;
  const trackHeight = 200;

  const sliderWidth = 44;
  const sliderHeight = 20;
  const sliderNotchY = sliderHeight / 2;
  const sliderNotchHeight = 3;

  return (
    <Box
      ref={ref}
      style={{
        width: trackWidth,
        height: trackHeight,
        position: "relative",
        cursor: "pointer",
        borderRadius: 4,
      }}
    >
      {/* Track */}
      <Box
        style={{
          height: trackHeight,
        }}
      >
        <svg style={{ position: "absolute" }} width={trackWidth} height={trackHeight}>
          {/* White ticks */}
          {Array.from({ length: 11 }, (_, i) => {
            const y = (i / 10) * trackHeight;
            const strokeWidth = [0, 5, 10].includes(i) ? 2 : 1;
            return (
              <line
                key={i}
                x1={0}
                y1={y}
                x2={trackWidth}
                y2={y}
                stroke="var(--mantine-color-gray-5)"
                strokeWidth={strokeWidth}
              />
            );
          })}

          {/* Track gap */}
          <line
            y1={0}
            y2={trackHeight}
            x1={trackWidth / 2}
            x2={trackWidth / 2}
            stroke="var(--mantine-color-black)"
            strokeWidth={6}
          />
        </svg>
      </Box>

      {/* Thumb */}
      <Box
        style={{
          position: "absolute",
          bottom: `calc(${normalizedValue * 100}%)`,
          left: (trackWidth - sliderWidth) / 2,
          width: sliderWidth,
          height: sliderHeight,
          backgroundColor: "var(--mantine-color-gray-8)",
        }}
      >
        <svg width={sliderWidth} height={sliderHeight}>
          <line
            y1={sliderNotchY}
            y2={sliderNotchY}

            x1={0}
            x2={sliderWidth / 4}
            stroke="var(--mantine-color-gray-2)"
            strokeWidth={sliderNotchHeight}
          />

          <line
            y1={sliderNotchY}
            y2={sliderNotchY}

            x1={3 * (sliderWidth / 4)}
            x2={sliderWidth}
            stroke="var(--mantine-color-gray-2)"
            strokeWidth={sliderNotchHeight}
          />
        </svg>
      </Box>
    </Box>
  );
};
