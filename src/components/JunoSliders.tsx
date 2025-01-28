import { Slider, Stack, Text } from "@mantine/core"
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

export const JunoSliders = () => {
  const {
    kiwiPatch: {
      portamentoTime, 
      volume, 
    },
    setPortamentoTime,
    setVolume,
  } = useKiwiPatchStore();

  return (
    <Stack>
      <Stack>
        <Text size="sm" mt="xl">Portamento</Text>
        <Slider
          labelAlwaysOn
          value={portamentoTime}
          onChange={setPortamentoTime}
          min={0}
          max={127}
        />
      </Stack>

      <Stack>
        <Text size="sm" mt="xl">Volume</Text>
        <Slider
          labelAlwaysOn
          value={volume}
          onChange={setVolume}
          min={0}
          max={127}
        />
      </Stack>
    </Stack>
  );
}