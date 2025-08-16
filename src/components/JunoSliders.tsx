import { Fieldset, Group, Stack, Text } from "@mantine/core";
import { KiwiPatchPropertySlider } from "./KiwiPatchPropertySlider";
import { KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { WaveformSelector } from "./WaveformSelector";
import { Kiwi106Fieldset } from "./Kiwi106Fieldset";
import { EnvelopeSelector } from "./EnvelopeSelector";
import { LfoSelector } from "./LfoSelector";
import { DcoRangeSelector } from "./DcoRangeSelector";

interface KiwiSliderProps {
  property: keyof KiwiPatch;
  label?: string;
}

const KiwiSlider = ({ property, label }: KiwiSliderProps) => {
  return (
    <Stack align="center">
      <Text size="sm" fw="bold">
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
        <Kiwi106Fieldset legend="BEND">
          <Group>
            <KiwiSlider label="DCO" property="dcoBendAmount" />
            <KiwiSlider label="VCF" property="vcfBendAmount" />
            <KiwiSlider label="LFO" property="lfoModWheelAmount" />
            <KiwiSlider property="portamentoTime" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="LFO1">
          <Group align="flex-start">
            <WaveformSelector label="WAVE" property="lfo1Wave" />
            <KiwiSlider label="RATE" property="lfo1Rate" />
            <KiwiSlider label="DELAY TIME" property="lfo1Delay" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="LFO2">
          <Group>
            <WaveformSelector label="WAVE" property="lfo2Wave" />
            <KiwiSlider label="RATE" property="lfo2Rate" />
            <KiwiSlider label="DELAY TIME" property="lfo2Delay" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="DCO">
          <Group align="flex-start">
            <DcoRangeSelector label="RANGE" property="dcoRange" />
            <LfoSelector label="LFO Source" property="dcoLfoSource" />
            <KiwiSlider label="LFO" property="dcoLfoModAmount" />
            <KiwiSlider label="PWM" property="dcoPwmModAmount" />
            <KiwiSlider label="SUB" property="subLevel" />
            <KiwiSlider label="NOISE" property="noiseLevel" />
            <EnvelopeSelector label="ENV Source" property="dcoEnvelopeSource" />
            <KiwiSlider label="ENV" property="dcoEnvelopeModAmount" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="VCF">
          <Group align="flex-start">
            <KiwiSlider label="FREQ" property="vcfLowPassCutoff" />
            <KiwiSlider label="RES" property="vcfLowPassResonance" />
            <EnvelopeSelector label="ENV Source" property="vcfEnvelopeSource" />
            <KiwiSlider label="ENV" property="vcfEnvelopeModAmount" />
            <LfoSelector label="LFO Source" property="vcfLfoSource" />
            <KiwiSlider label="LFO" property="vcfLfoModAmount" />
            <KiwiSlider label="KYBD" property="vcfPitchFollow" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="VCA">
          <Group align="flex-start">
            <LfoSelector label="LFO Source" property="vcaLfoSource" />
            <KiwiSlider label="LFO" property="vcaLfoModAmount" />
            <KiwiSlider label="LEVEL" property="volume" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="ENV1">
          <Group>
            <KiwiSlider label="A" property="env1Attack" />
            <KiwiSlider label="D" property="env1Decay" />
            <KiwiSlider label="S" property="env1Sustain" />
            <KiwiSlider label="R" property="env1Release" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="ENV2">
          <Group>
            <KiwiSlider label="A" property="env2Attack" />
            <KiwiSlider label="D" property="env2Decay" />
            <KiwiSlider label="S" property="env2Sustain" />
            <KiwiSlider label="R" property="env2Release" />
          </Group>
        </Kiwi106Fieldset>
      </Group>
    </Stack>
  );
};
