import { WebMidi } from "webmidi";
import { buildKiwiMidi } from "./kiwiMidi";
import { describe, expect, it, vi } from "vitest";

vi.mock("webmidi");

describe("kiwiMidi", () => {
  const subject = () => {
    const input = WebMidi.getInputById("input");
    const output = WebMidi.getOutputById("output");

    if (input && output) {
      const kiwiMidi = buildKiwiMidi({ input, output });
      return { kiwiMidi, input, output };
    } else {
      throw new Error("Could not build Webmidi mocks");
    }
  };

  describe("requestSysexDeviceEnquiry", () => {
    it("works", () => {
      const { kiwiMidi, output } = subject();
      kiwiMidi.requestSysexDeviceEnquiry();
      expect(output.sendSysex).toHaveBeenCalledWith([0x7e], [0x7f, 0x06, 0x01]);
    });
  });

    describe('requestSysexEditBufferDump', () => {
    it('works', () => {
      const { kiwiMidi, output } = subject();
      kiwiMidi.requestSysexEditBufferDump();
      expect(output.sendSysex).toHaveBeenCalledWith([0x00, 0x21, 0x16], [0x60, 0x03, 0x00, 0x03]);
    })
  });

  describe("requestSysexGlobalDump", () => {
    it("works", () => {
      const { kiwiMidi, output } = subject();
      kiwiMidi.requestSysexGlobalDump();
      expect(output.sendSysex).toHaveBeenCalledWith(
        [0x00, 0x21, 0x16],
        [0x60, 0x03, 0x00, 0x01]
      );
    });
  });
});
