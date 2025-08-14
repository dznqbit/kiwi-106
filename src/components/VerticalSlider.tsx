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
    const newValue = Math.round((newNormalizedValue * (max - min) + min) / step) * step;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  });

  return (
    <Box
      ref={ref}
      style={{
        width: 20,
        height: 200,
        backgroundColor: 'var(--mantine-color-gray-3)',
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 4,
      }}
    >
      {/* Filled track */}
      <Box
        style={{
          position: 'absolute',
          bottom: 0,
          height: `${normalizedValue * 100}%`,
          width: '100%',
          backgroundColor: 'var(--mantine-color-blue-6)',
          borderRadius: '0 0 4px 4px',
        }}
      />

      {/* Thumb */}
      <Box
        style={{
          position: 'absolute',
          bottom: `calc(${normalizedValue * 100}% - 6px)`,
          left: -2,
          width: 24,
          height: 12,
          backgroundColor: 'var(--mantine-color-blue-7)',
          borderRadius: 2,
          border: '1px solid var(--mantine-color-gray-6)',
        }}
      />
    </Box>
  );
};