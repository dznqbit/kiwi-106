import { Box, Group, Stack, Text, Title } from "@mantine/core";

interface ToggleValue<T> {
  value: T;
  label: string;
}

interface JunoToggleSwitchProps<T> {
  label: string;
  data: ToggleValue<T>[];
  selected: T;
  onSelect: (t: T) => void;
}

export const JunoToggleSwitch = <T,>({
  label,
  data,
  selected,
  onSelect,
}: JunoToggleSwitchProps<T>) => {
  const switchWidth = 20;
  const switchHeight = 22;
  const trackPadding = 2;

  const selectedIndex = data.map(({ value }) => value).indexOf(selected);

  return (
    <Stack gap={8} align="center">
      <Text size="sm" fw="bold">
        {label}
      </Text>

      <Group gap={0}>
        <Stack justify="center" gap={trackPadding} py={trackPadding}>
          {data.map((d) => (
            <Title
              onClick={() => onSelect(d.value)}
              order={6}
              h={switchHeight}
              style={{ cursor: "pointer", lineHeight: "1.4rem" }}
              pr="sm"
            >
              {d.label}
            </Title>
          ))}
        </Stack>
        <Stack align="center">
          <Box
            onClick={(e) => {
              const containerBox = e.currentTarget;
              const y =
                e.pageY -
                containerBox.getBoundingClientRect().top +
                window.scrollY;
              const idx = Math.floor(y / (switchHeight + trackPadding));
              onSelect(data[idx].value);
            }}
            style={{
              cursor: "pointer",
              position: "relative",
              width: switchWidth + 2 * trackPadding,
              height:
                data.length * switchHeight + (data.length + 1) * trackPadding,
              backgroundColor: "var(--mantine-color-black)",
              margin: "0",
            }}
          >
            <Box
              style={{
                position: "absolute",
                top:
                  selectedIndex * switchHeight +
                  (selectedIndex + 1) * trackPadding,
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
        </Stack>
      </Group>
    </Stack>
  );
};
