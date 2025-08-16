import { Group, Stack } from "@mantine/core";
import { KiwiPatchPropertySlider } from "./KiwiPatchPropertySlider";
import { WaveformSelector } from "./WaveformSelector";
import { Kiwi106Fieldset } from "./Kiwi106Fieldset";
import { EnvelopeSelector } from "./EnvelopeSelector";
import { LfoSelector } from "./LfoSelector";
import { DcoRangeSelector } from "./DcoRangeSelector";
import { PwmControlSelector } from "./PwmControlSelector";
import { DcoWaveSelector } from "./DcoWaveSelector";

export const JunoSliders = () => {
  return (
    <Stack>
      <Group>
        <Kiwi106Fieldset legend="BEND">
          <Group>
            <KiwiPatchPropertySlider label="DCO" property="dcoBendAmount" />
            <KiwiPatchPropertySlider label="VCF" property="vcfBendAmount" />
            <KiwiPatchPropertySlider label="LFO" property="lfoModWheelAmount" />
            <KiwiPatchPropertySlider property="portamentoTime" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="LFO1">
          <Group align="flex-start">
            <WaveformSelector label="WAVE" property="lfo1Wave" />
            <KiwiPatchPropertySlider label="RATE" property="lfo1Rate" />
            <KiwiPatchPropertySlider label="DELAY TIME" property="lfo1Delay" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="LFO2">
          <Group align="flex-start">
            <WaveformSelector label="WAVE" property="lfo2Wave" />
            <KiwiPatchPropertySlider label="RATE" property="lfo2Rate" />
            <KiwiPatchPropertySlider label="DELAY TIME" property="lfo2Delay" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="DCO">
          <Group align="flex-start">
            <DcoRangeSelector label="RANGE" property="dcoRange" />
            <LfoSelector label="LFO Source" property="dcoLfoSource" />
            <KiwiPatchPropertySlider label="LFO" property="dcoLfoModAmount" />
            <KiwiPatchPropertySlider
              label="PWM"
              property="dcoPwmModAmount"
              sliderProps={{ min: 0, max: 100 }}
            />
            <PwmControlSelector label="PWM MOD SRC" property="dcoPwmControl" />
            <DcoWaveSelector property="dcoWave" />
            <KiwiPatchPropertySlider label="SUB" property="subLevel" />
            <KiwiPatchPropertySlider label="NOISE" property="noiseLevel" />
            <EnvelopeSelector label="ENV Source" property="dcoEnvelopeSource" />
            <KiwiPatchPropertySlider
              label="ENV"
              property="dcoEnvelopeModAmount"
            />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="VCF">
          <Group align="flex-start">
            <KiwiPatchPropertySlider label="FREQ" property="vcfLowPassCutoff" />
            <KiwiPatchPropertySlider
              label="RES"
              property="vcfLowPassResonance"
            />
            <EnvelopeSelector label="ENV Source" property="vcfEnvelopeSource" />
            <KiwiPatchPropertySlider
              label="ENV"
              property="vcfEnvelopeModAmount"
            />
            <LfoSelector label="LFO Source" property="vcfLfoSource" />
            <KiwiPatchPropertySlider label="LFO" property="vcfLfoModAmount" />
            <KiwiPatchPropertySlider label="KYBD" property="vcfPitchFollow" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="VCA">
          <Group align="flex-start">
            <LfoSelector label="LFO Source" property="vcaLfoSource" />
            <KiwiPatchPropertySlider label="LFO" property="vcaLfoModAmount" />
            <KiwiPatchPropertySlider label="LEVEL" property="volume" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="ENV1">
          <Group>
            <KiwiPatchPropertySlider label="A" property="env1Attack" />
            <KiwiPatchPropertySlider label="D" property="env1Decay" />
            <KiwiPatchPropertySlider label="S" property="env1Sustain" />
            <KiwiPatchPropertySlider label="R" property="env1Release" />
          </Group>
        </Kiwi106Fieldset>

        <Kiwi106Fieldset legend="ENV2">
          <Group>
            <KiwiPatchPropertySlider label="A" property="env2Attack" />
            <KiwiPatchPropertySlider label="D" property="env2Decay" />
            <KiwiPatchPropertySlider label="S" property="env2Sustain" />
            <KiwiPatchPropertySlider label="R" property="env2Release" />
          </Group>
        </Kiwi106Fieldset>
      </Group>
    </Stack>
  );
};
