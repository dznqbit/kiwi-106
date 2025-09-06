import { describe, it, expect } from "vitest";
import { unpack12Bit, packBits, unpackBits, pack12Bit, pack8Bit, unpack8Bit } from "./sysexUtils";

describe("packBits", () => {
  it("packs bits correctly", () => {
    expect(packBits(true, false, true)).toEqual(5);
    expect(packBits(true, true, false)).toEqual(6);
    expect(packBits(false, true)).toEqual(1);
  });
});

describe("unpackBits", () => {
  it("unpacks bits correctly", () => {
    expect(unpackBits(5, 3)).toEqual([true, false, true]);
    expect(unpackBits(6, 3)).toEqual([true, true, false]);
    expect(unpackBits(2, 2)).toEqual([true, false]);
  });
});

describe("pack12Bit", () => {
  it("packs two bytes into a 12 bit number accordiing to Kiwi106 docs", () => {
    expect(pack12Bit(0b11001, 0b01001100)).toEqual(0b110011001100);
  });
});

describe("unpack12Bit", () => {
  it("unpacks a 12 bit number into two bytes", () => {
    expect(unpack12Bit(0b110011001100)).toEqual([0b11001, 0b01001100]);
  });
});

describe("pack8Bit", () => {
  it("packs two bytes into an 8 bit number accordiing to Kiwi106 docs", () => {
    expect(pack8Bit(0b00000110, 0b00001001)).toEqual(0b01101001);
    expect(pack8Bit(0b11110110, 0b11111001)).toEqual(0b01101001);
  });
});

describe("unpack8Bit", () => {
  it("unpacks an 8 bit number into two bytes", () => {
    expect(unpack8Bit(0b01101001)).toEqual([0b0110, 0b1001]);
  });
});
