import { Button, Stack, Text } from "@mantine/core";
import { isVcaMode, KiwiPatch, VcaMode } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

interface VcaModeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const VcaModeSelector = ({ property, label }: VcaModeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const vcaMode = kiwiPatch[property];

  if (!isVcaMode(vcaMode)) {
    throw new Error(`VcaModeSelector expected VcaMode for "${property}"`);
  }

  const setVcaMode = (vcaMode: VcaMode) => {
    setKiwiPatchProperty(property, vcaMode, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack gap={2} pr="sm" justify="flex-start">
      <Text size="sm" fw="bold" pb="sm">
        {label ?? kiwiPatchLabel(property)}
      </Text>

      <VcaModeButton
        label="GATE"
        vcaMode="gate"
        isSelected={vcaMode === "gate"}
        onClick={() => setVcaMode("gate")}
      />
      <VcaModeButton
        label="ENV1"
        vcaMode="env1"
        isSelected={vcaMode === "env1"}
        onClick={() => setVcaMode("env1")}
      />
      <VcaModeButton
        label="ENV2"
        vcaMode="env2"
        isSelected={vcaMode === "env2"}
        onClick={() => setVcaMode("env2")}
      />
    </Stack>
  );
};

interface VcaModeButtonProps {
  label?: string;
  vcaMode: VcaMode;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const VcaModeButton = ({
  vcaMode,
  isSelected,
  onClick,
  size,
  label,
}: VcaModeButtonProps) => {
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
      {label ?? vcaMode}
    </Button>
  );
};
