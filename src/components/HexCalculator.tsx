import { Fieldset, Group, Input, TextInput } from "@mantine/core";
import { useState } from "react";

export const HexCalculator = () => {
  const [hexValue, setHexValue] = useState<number>(0);
  const [decimalValue, setDecimalValue] = useState<number>(0);

  return (
    <Group>
      <Fieldset legend="Hex to Decimal">
        <Group>
          <TextInput
            name="Hex"
            placeholder="FF"
            leftSection="0x"
            value={hexValue.toString(16)}
            onChange={(e) => {
              const inputValue =
                e.currentTarget.value === ""
                  ? "0"
                  : e.currentTarget.value.substring(0, 2);
              setHexValue(Number.parseInt(inputValue, 16));
            }}
          />
          <Input
            name="Decimal"
            readOnly
            placeholder="127"
            value={hexValue.toString(10)}
          />
        </Group>
      </Fieldset>
      <Fieldset legend="Decimal to Hex">
        <Group>
          <TextInput
            name="Decimal"
            placeholder="127"
            value={decimalValue}
            onChange={(e) => {
              const inputValue =
                e.currentTarget.value === ""
                  ? "0"
                  : e.currentTarget.value.substring(0, 3);
              setDecimalValue(Number.parseInt(inputValue));
            }}
          />
          <Input
            name="Hex"
            readOnly
            placeholder="0xFF"
            value={decimalValue.toString(16)}
            leftSection="0x"
          />
        </Group>
      </Fieldset>
    </Group>
  );
};
