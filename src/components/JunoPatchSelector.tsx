import { Button, Group, Stack, Title } from "@mantine/core";
import { JunoButtonContainer } from "./JunoButtonContainer";
import { JunoButtonGroup } from "./JunoButtonGroup";
import { SevenSegmentDisplay } from "./SevenSegmentDisplay";
import { useMemo, useState } from "react";
import {
  isKiwiPatchBankIndex,
  isKiwiPatchIndex,
  KiwiPatchAddress,
  KiwiPatchBankIndex,
  KiwiPatchGroupIndex,
  KiwiPatchIndex,
} from "../types/KiwiPatch";

// All of this is dumb and I'm not proud of it
// but it's the simplest way of getting shit done

export const JunoPatchSelector = () => {
  // Even when in Manual mode, the Kiwi has a memory of the previous group/bank/patch
  const [group, setGroup] = useState<KiwiPatchGroupIndex>(1);
  const [bank, setBank] = useState<KiwiPatchBankIndex>(1);
  const [patch, setPatch] = useState<KiwiPatchIndex>(1);
  const [isManual, setIsManual] = useState(true);

  const selectPatchAddress = (address: KiwiPatchAddress | "manual") => {
    setIsManual(address === "manual");

    if (address !== "manual") {
      const { group, bank, patch } = address;
      setGroup(group);
      setBank(bank);
      setPatch(patch);
    }
  };

  const patchAddress = useMemo(() => {
    if (isManual) {
      return null;
    } else {
      return {
        group,
        bank,
        patch,
      };
    }
  }, [isManual, group, bank, patch]);

  return (
    <Group align="flex-start" justify="center">
      <Group gap={0} pt={2}>
        {[...new Array(8)]
          .map((_, i) => i + 1)
          .filter(isKiwiPatchBankIndex)
          .map((bank, i) => (
            <Stack align="center" gap={4}>
              <Title order={6}>{bank}</Title>
              <JunoButtonContainer
                pl={i === 0 ? 4 : undefined}
                pr={i === 7 ? 4 : undefined}
              >
                <Button
                  variant="juno"
                  color="blue"
                  size="lg"
                  onClick={() => selectPatchAddress({ group, bank, patch })}
                />
              </JunoButtonContainer>
            </Stack>
          ))}
      </Group>

      <SevenSegmentDisplay
        value={
          patchAddress ? patchAddress.bank * 10 + patchAddress.patch : null
        }
        size={32}
      />

      <Group gap={0} pt={2}>
        {[...new Array(8)]
          .map((_, i) => i + 1)
          .filter(isKiwiPatchIndex)
          .map((patch, i) => (
            <Stack align="center" gap={4}>
              <Title order={6}>{patch}</Title>
              <JunoButtonContainer
                pl={i === 0 ? 4 : undefined}
                pr={i === 7 ? 4 : undefined}
              >
                <Button
                  variant="juno"
                  color="blue"
                  size="lg"
                  onClick={() => selectPatchAddress({ group, bank, patch })}
                />
              </JunoButtonContainer>
            </Stack>
          ))}
      </Group>
      <Stack align="center" gap={4} pt={16.5}>
        <JunoButtonGroup>
          <Button
            variant="juno"
            color="beige"
            size="lg"
            onClick={() => selectPatchAddress("manual")}
          />
        </JunoButtonGroup>
        <Title order={6}>MANUAL</Title>
      </Stack>
    </Group>
  );
};
