import { Select } from "@mantine/core";
import { Enumerations } from "webmidi";

interface SelectMidiChannelParams {
  enabled: boolean;
  value: number;
  onChange: (v: number) => void;
}

export const SelectMidiChannel = ({
  enabled,
  value,
  onChange,
}: SelectMidiChannelParams) => {
  const width = 96;

  return (
    <Select
      width={width}
      label="Channel"
      allowDeselect={false}
      placeholder={enabled ? "1-16" : "N / A"}
      value={String(value)}
      data={Enumerations.CHANNEL_NUMBERS.map(String)}
      onChange={(v) => onChange(Number(v))}
      comboboxProps={{ width }}
    ></Select>
  );
};
