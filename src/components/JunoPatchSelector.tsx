import { Button, Center, Group, Stack, Title } from "@mantine/core";
import { JunoButtonContainer } from "./JunoButtonContainer";
import { JunoButtonGroup } from "./JunoButtonGroup";
import { KiwiPatchDisplay } from "./SevenSegmentDisplay";
import { useEffect, useMemo, useState } from "react";
import {
  isKiwiPatchIndex,
  KiwiPatchAddress,
  KiwiPatchIndex,
} from "../types/KiwiPatch";
import { useKiwi106Context } from "../hooks/useKiwi106Context";

// All of this is dumb and I'm not proud of it
// but it's the simplest way of getting shit done

export const JunoPatchSelector = () => {
  const { kiwiMidi } = useKiwi106Context();

  // Even when in Manual mode, the Kiwi has a memory of the previous group/bank/patch
  const [group, setGroup] = useState<KiwiPatchIndex>(1);
  const [bank, setBank] = useState<KiwiPatchIndex>(1);
  const [patch, setPatch] = useState<KiwiPatchIndex>(1);
  const [isManual, setIsManual] = useState(true);
  const [isGroupModalActive, setIsGroupModalActive] = useState(false);

  const selectPatchAddress = (address: KiwiPatchAddress | "manual") => {
    setIsManual(address === "manual");
    setIsGroupModalActive(false);

    if (address !== "manual") {
      const { group, bank, patch } = address;
      setGroup(group);
      setBank(bank);
      setPatch(patch);
    }
  };

  const handleGroupButtonClick = () => {
    setIsGroupModalActive(!isGroupModalActive);
  };

  const handleBankButtonClick = (selectedBank: KiwiPatchIndex) => {
    if (isGroupModalActive) {
      setGroup(selectedBank);
      setIsGroupModalActive(false);
    } else {
      selectPatchAddress({ group, bank: selectedBank, patch });
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

  useEffect(() => {
    kiwiMidi?.sendProgramChange(patchAddress ?? "manual");
  }, [kiwiMidi, patchAddress]);

  return (
    <Group align="flex-start" justify="center" gap="xs" p={0}>
      <Stack align="center" gap={4} pt={54.5}>
        <JunoButtonGroup>
          <Button
            variant="juno"
            color={isGroupModalActive ? "orange" : "beige"}
            size="lg"
            onClick={handleGroupButtonClick}
          />
        </JunoButtonGroup>
        <Title order={5}>GROUP</Title>
      </Stack>

      <Stack align="center" gap="xs" pt={6.5}>
        <Title order={5}>BANK</Title>
        <Group gap={0} pt={2} pb={16}>
          {[...new Array(8)]
            .map((_, i) => i + 1)
            .filter(isKiwiPatchIndex)
            .map((bank, i) => (
              <Stack align="center" gap={4} key={i}>
                <Title order={5}>{bank}</Title>
                <JunoButtonContainer
                  pl={i === 0 ? 4 : undefined}
                  pr={i === 7 ? 4 : undefined}
                >
                  <Button
                    variant="juno"
                    color="blue"
                    size="lg"
                    onClick={() => handleBankButtonClick(bank)}
                  />
                </JunoButtonContainer>
              </Stack>
            ))}
        </Group>
      </Stack>

      <Stack gap="xs">
        <Group justify="center" grow gap={0}>
          <Center>
            <Title order={6}>GROUP</Title>
          </Center>
          <Center>
            <Title order={6}>BANK</Title>
          </Center>
          <Center>
            <Title order={6}>PATCH</Title>
          </Center>
        </Group>
        <KiwiPatchDisplay patchAddress={patchAddress} size={40} />
      </Stack>

      <Stack align="center" gap="xs" pt={6.5}>
        <Title order={5}>PATCH</Title>
        <Group gap={0} pt={2}>
          {[...new Array(8)]
            .map((_, i) => i + 1)
            .filter(isKiwiPatchIndex)
            .map((patch, i) => (
              <Stack align="center" gap={4} key={i}>
                <Title order={5}>{patch}</Title>
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
      </Stack>

      <Stack align="center" gap={4} pt={54.5}>
        <JunoButtonGroup>
          <Button
            variant="juno"
            color="beige"
            size="lg"
            onClick={() => selectPatchAddress("manual")}
          />
        </JunoButtonGroup>
        <Title order={5}>MANUAL</Title>
      </Stack>
    </Group>
  );
};
