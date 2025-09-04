import { describe, it, expect } from "vitest";
import { unpack12Bit, packBits, unpackBits, pack12Bit } from "./sysexUtils";

describe("packBits", () => {
  it("packs bits correctly", () => {
    expect(packBits(true, false, true)).toEqual(5);
  });
});

describe("upackBits", () => {
  it("unpacks bits correctly", () => {
    expect(unpackBits(5, 3)).toEqual([true, false, true]);
  });
});

describe("unpack12Bit", () => {
  it("packs two bytes into a 12 bit number accordiing to Kiwi106 docs", () => {
    expect(pack12Bit(0b11001, 0b01001100)).toEqual(0b110011001100);
  });
});

describe("unpack12Bit", () => {
  it("unpacks a 12 bit number into two bytes", () => {
    expect(unpack12Bit(0b110011001100)).toEqual([0b11001, 0b01001100]);
  });
});
