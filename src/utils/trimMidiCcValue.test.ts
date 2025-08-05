import { describe, it, expect } from "vitest";
import { trimMidiCcValue } from "./trimMidiCcValue";

describe("trimMidiCcValue", () => {
  it("trims high messages", () => {
    expect(trimMidiCcValue(128)).toBe(127);
  });

  it("passes normal messages", () => {
    expect(trimMidiCcValue(55)).toBe(55);
  });
});
