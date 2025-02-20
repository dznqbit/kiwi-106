import { Fieldset, Stack, Text } from "@mantine/core"
import { KiwiPatchPropertySlider } from "./KiwiPatchPropertySlider";
import { KiwiPatch } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";

interface KiwiSliderProps {
  property: keyof KiwiPatch
}

const KiwiSlider = ({ property }: KiwiSliderProps) => {
return       <Stack>
<Text size="sm" mt="xl">{kiwiPatchLabel(property)}</Text>
<KiwiPatchPropertySlider property={property} />
</Stack>
}

export const JunoSliders = () => {
  return (
    <Stack>
      <KiwiSlider property="portamentoTime" />

      <Fieldset legend="LFO1">
        <KiwiSlider property="lfo1Wave" />
        <KiwiSlider property="lfo1Rate" />
        <KiwiSlider property="lfo1Delay" />
      </Fieldset>

      <Fieldset legend="LFO2">
        <KiwiSlider property="lfo2Wave" />
        <KiwiSlider property="lfo2Rate" />
        <KiwiSlider property="lfo2Delay" />
      </Fieldset>
      
      <KiwiSlider property="dcoLfoModAmount" />
      <KiwiSlider property="dcoPwmModAmount" />
      <KiwiSlider property="dcoEnvelopeModAmount" />

      <KiwiSlider property="subLevel" />
      <KiwiSlider property="noiseLevel" />
      
      <Fieldset legend="Filter">
        <KiwiSlider property="vcfLowPassCutoff" />
        <KiwiSlider property="vcfLowPassResonance" />
        <KiwiSlider property="vcfEnvelopeModAmount" />
        <KiwiSlider property="vcfLfoModAmount" />
        <KiwiSlider property="vcfPitchFollow" />
      </Fieldset>
      
      <KiwiSlider property="volume" />

      <Fieldset legend="ENV1">
        <KiwiSlider property="env1Attack" />
        <KiwiSlider property="env1Decay" />
        <KiwiSlider property="env1Sustain" />
        <KiwiSlider property="env1Release" />
      </Fieldset>


      <Fieldset legend="ENV2">
        <KiwiSlider property="env2Attack" />
        <KiwiSlider property="env2Decay" />
        <KiwiSlider property="env2Sustain" />
        <KiwiSlider property="env2Release" />
      </Fieldset>


    </Stack>
  );
}