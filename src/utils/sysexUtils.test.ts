import { describe, it, expect } from "vitest";
import { pack12Bit, packBits } from "./sysexUtils";

describe("packBits", () => {
  it("packs bits correctly", () => {
    expect(packBits(true, false, true)).toEqual(5);
  });
});

describe("pack12Bit", () => {
  it("packs a 12 bit number into two bytes", () => {
    expect(pack12Bit(0b110011001100)).toEqual([0b11001, 0b01001100]);
  })
});