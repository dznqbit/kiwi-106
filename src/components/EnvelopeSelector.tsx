import { Button, Stack, Text } from "@mantine/core";
import { EnvelopeSource, isEnvelopeSource } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import _ from "lodash";

interface EnvelopeSelectorButtonProps {
  property: 'dcoEnvelopeSource' | 'vcfEnvelopeSource';
  label?: string;
}

export const EnvelopeSelector = ({
  property,
  label,
}: EnvelopeSelectorButtonProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const envelopeSource = kiwiPatch[property];

  if (!isEnvelopeSource(envelopeSource)) {
    throw new Error(`Woah! EnvelopSelector cannot handle ${envelopeSource}`);
  }

  const setEnvelopeSource = (source: EnvelopeSource) => {
    setKiwiPatchProperty(property, source, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <EnvelopeButton
        label="ENV1"
        envelope="env1"
        isSelected={envelopeSource === "env1"}
        onClick={() => setEnvelopeSource("env1")}
      />
      <EnvelopeButton
        label="iENV1"
        envelope="env1-inverted"
        isSelected={envelopeSource === "env1-inverted"}
        onClick={() => setEnvelopeSource("env1-inverted")}
      />
      <EnvelopeButton
        label="ENV2"
        envelope="env2"
        isSelected={envelopeSource === "env2"}
        onClick={() => setEnvelopeSource("env2")}
      />
      <EnvelopeButton
        label="iENV2"
        envelope={"env2-inverted"}
        isSelected={envelopeSource === "env2-inverted"}
        onClick={() => setEnvelopeSource("env2-inverted")}
      />
    </Stack>
  );
};

interface EnvelopeButtonProps {
  label?: string;
  envelope: EnvelopeSource;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const EnvelopeButton = ({
  envelope,
  isSelected,
  onClick,
  size,
  label,
}: EnvelopeButtonProps) => {
  return (
    <Button
      radius={0}
      variant={isSelected ? "filled" : "outline"}
      onClick={onClick}
      size={size}
      style={{
        padding: "8px",
        margin: 0,
      }}
    >
      {label ?? envelope}
    </Button>
  );
};
