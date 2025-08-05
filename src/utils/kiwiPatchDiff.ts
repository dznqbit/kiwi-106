import { KiwiPatch } from "../types/KiwiPatch";
import { objectKeys } from "./objectKeys";

// Compares two patches and returns only the values from a that differ from b
export const kiwiPatchDiff = (
  a: KiwiPatch,
  b: KiwiPatch,
): Partial<KiwiPatch> => {
  return objectKeys(a).reduce((acc, k) => {
    if (a[k] !== b[k]) {
      return { ...acc, [k]: a[k] };
    } else {
      return acc;
    }
  }, {});
};
