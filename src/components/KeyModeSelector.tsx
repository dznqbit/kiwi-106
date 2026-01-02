import { Button, Center, Stack, Text } from "@mantine/core";
import { KeyMode, KiwiPatch, isKeyMode } from "../types/KiwiPatch";
import { kiwiPatchLabel } from "../utils/kiwiPatchLabel";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";

interface KeyModeSelectorProps {
  property: keyof KiwiPatch;
  label?: string;
}

export const KeyModeSelector = ({ property, label }: KeyModeSelectorProps) => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const keyMode = kiwiPatch[property];

  if (!isKeyMode(keyMode)) {
    throw new Error(
      `Woah! KeyModeSelector for ${property} cannot handle ${keyMode}`,
    );
  }

  const setKeyMode = (keyMode: KeyMode) => {
    setKiwiPatchProperty(property, keyMode, {
      updatedBy: "Editor Change",
    });
  };

  return (
    <Stack align="stretch" gap={2}>
      <Center>
        <Text size="sm" fw="bold" pb="sm">
          {label ?? kiwiPatchLabel(property)}
        </Text>
      </Center>

      <KeyModeButton
        label="POLY1"
        keyMode="poly1"
        isSelected={keyMode === "poly1"}
        onClick={() => setKeyMode("poly1")}
      />
      <KeyModeButton
        label="POLY2"
        keyMode="poly2"
        isSelected={keyMode === "poly2"}
        onClick={() => setKeyMode("poly2")}
      />
      <KeyModeButton
        label="UNI LEG"
        keyMode="unison-legato"
        isSelected={keyMode === "unison-legato"}
        onClick={() => setKeyMode("unison-legato")}
      />
      <KeyModeButton
        label="UNI STA"
        keyMode="unison-staccato"
        isSelected={keyMode === "unison-staccato"}
        onClick={() => setKeyMode("unison-staccato")}
      />
      <KeyModeButton
        label="MONO LEG"
        keyMode="mono-legato"
        isSelected={keyMode === "mono-legato"}
        onClick={() => setKeyMode("mono-legato")}
      />
      <KeyModeButton
        label="MONO STA"
        keyMode="mono-staccato"
        isSelected={keyMode === "mono-staccato"}
        onClick={() => setKeyMode("mono-staccato")}
      />
    </Stack>
  );
};

interface KeyModeButtonProps {
  label?: string;
  keyMode: KeyMode;
  isSelected?: boolean;
  onClick: () => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const KeyModeButton = ({
  keyMode,
  isSelected,
  onClick,
  size,
  label,
}: KeyModeButtonProps) => {
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
      {label ?? keyMode}
    </Button>
  );
};
