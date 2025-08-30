import { Button, Stack, Text } from "@mantine/core";

type T = boolean | string | number;

interface SelectorProps {
  label: string;
  values: readonly T[];
  selected: T | null;
  onSelect?: (t: T) => void;
}

export const Selector = ({ label, values, selected, onSelect }: SelectorProps) => {
  const valueLabel = (v: T) => {
    return v.toString();
  }

  return (
    <Stack gap={2} pr="sm" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label}
      </Text>

      {values.map((v) =>
        <Button
          radius={0}
          variant={selected === v ? "filled" : "outline"}
          onClick={() => onSelect?.(v)}
          style={{
            padding: "8px",
            margin: 0,
          }}
        >
          {valueLabel(v)}
        </Button>
      )}
    </Stack>
  );
};
