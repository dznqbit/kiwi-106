  import { Group, TextInput } from "@mantine/core";
import { useKiwiPatchStore } from "../stores/kiwiPatchStore";
import { useEffect, useState } from "react";

export const PatchNameEditor = () => {
  const { kiwiPatch, setKiwiPatchProperty } = useKiwiPatchStore();
  const [patchName, setPatchName] = useState(kiwiPatch.patchName);

  // Every time the patch name changes, overwrite
  useEffect(() => {
    setPatchName(kiwiPatch.patchName);
  }, [kiwiPatch.patchName]);

  return (
    <Group>
      <TextInput
        variant="retroLabel"
        value={patchName}
        onChange={(e) => setPatchName(e.currentTarget.value)}
        onBlur={() =>
          setKiwiPatchProperty("patchName", patchName, {
            updatedBy: "Editor Change",
          })
        }
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        maxLength={20}
      />
    </Group>
  );
};
