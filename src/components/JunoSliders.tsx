import { Fieldset, Group, Stack, Text } from "@mantine/core";
import { KiwiPatchPropertySlider } from "./KiwiPatchPropertySlider";
import { KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";

interface KiwiSliderProps {
  property: keyof KiwiPatch;
  label?: string;
}

const KiwiSlider = ({ property, label }: KiwiSliderProps) => {
  return (
    <Stack>
      <Text size="sm" mt="xl">
        {label ?? kiwiPatchLabel(property)}
      </Text>
      <KiwiPatchPropertySlider property={property} />
    </Stack>
  );
};

export const JunoSliders = () => {
  return (
    <Stack>
      <Group>
        <KiwiSlider property="portamentoTime" />
        <Fieldset legend="LFO1">
          <Group>
            <KiwiSlider property="lfo1Wave" />
            <KiwiSlider property="lfo1Rate" />
            <KiwiSlider property="lfo1Delay" />
          </Group>
        </Fieldset>

        <Fieldset legend="LFO2">
          <Group>
            <KiwiSlider property="lfo2Wave" />
            <KiwiSlider property="lfo2Rate" />
            <KiwiSlider property="lfo2Delay" />
          </Group>
        </Fieldset>
      </Group>

      <Group>
        <Fieldset legend="DCO">
          <Group>
            <KiwiSlider property="dcoLfoModAmount" />
            <KiwiSlider property="dcoPwmModAmount" />
            <KiwiSlider property="dcoEnvelopeModAmount" />
          </Group>
        </Fieldset>

        <Fieldset legend="Voices">
          <Group>
            <KiwiSlider property="subLevel" />
            <KiwiSlider property="noiseLevel" />
          </Group>
        </Fieldset>
      </Group>


      <Fieldset legend="Filter">
        <Group>
          <KiwiSlider property="vcfLowPassCutoff" />
          <KiwiSlider property="vcfLowPassResonance" />
          <KiwiSlider property="vcfEnvelopeModAmount" />
          <KiwiSlider property="vcfLfoModAmount" />
          <KiwiSlider property="vcfPitchFollow" />
        </Group>
      </Fieldset>


      <Group>
        <KiwiSlider property="volume" />
        <Fieldset legend="ENV1">
          <Group>
            <KiwiSlider property="env1Attack" />
            <KiwiSlider property="env1Decay" />
            <KiwiSlider property="env1Sustain" />
            <KiwiSlider property="env1Release" />
          </Group>
        </Fieldset>

        <Fieldset legend="ENV2">
          <Group>
            <KiwiSlider property="env2Attack" />
            <KiwiSlider property="env2Decay" />
            <KiwiSlider property="env2Sustain" />
            <KiwiSlider property="env2Release" />
          </Group>
        </Fieldset>
      </Group>
    </Stack>
  );
};
