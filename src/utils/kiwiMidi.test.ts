import { WebMidi } from "webmidi";
import { buildKiwiMidi } from "./kiwiMidi";
import { describe, expect, it, Mock, vi } from "vitest";
import { KiwiGlobalData } from "../types/KiwiGlobalData";

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

  describe("requestSysexEditBufferDump", () => {
    it("works", () => {
      const { kiwiMidi, output } = subject();
      kiwiMidi.requestSysexEditBufferDump();
      expect(output.sendSysex).toHaveBeenCalledWith(
        [0x00, 0x21, 0x16],
        [0x60, 0x03, 0x00, 0x03]
      );
    });
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

  describe("sendSysexGlobalDump", () => {
    it("works", () => {
      const { kiwiMidi, output } = subject();
      const kiwiGlobalData: KiwiGlobalData = {
        midiChannelIn: 1,
        midiChannelOut: 16,
        sequencerMidiChannelOut: 8,
        deviceId: 10,
        enableControlChange: 'rx-tx',
        enableSysex: true,
        enableProgramChange: 'tx',
        midiSoftThrough: 'stop-only-cc-used',
        enableMidiClockGen: false,
        internalVelocity: 100,
        masterClockSource: 'midi',
        patternLevel: 1000,
        patternClockSource: 'seq',
        patternDestinationVca: true,
        patternDestinationVcf: true,
        intClockRate: 300,
        mwLevel: 96,
        atLevel: 94,
        keyTransposeDisable: true,
        clockDisplay: true,
        scrollingDisplay: true,
        internalTune: 0,
        externalPedalPolarity: 'normal',
      };

      kiwiMidi.sendSysexGlobalDump(kiwiGlobalData);
      const [[header, data]] = (output.sendSysex as Mock).mock.calls;
      
      expect(header).toEqual([0x00, 0x21, 0x16]);
      
      expect(data[0]).toBe(0x60); // Kiwi106 Identifier 1
      expect(data[1]).toBe(0x03); // Kiwi106 Identifier 2
      expect(data[2]).toBe(0x00); // Device Id
      expect(data[3]).toBe(0x02); // Transmit/Receive Global Dump
      expect(data[4]).toBe(0);    // Midi In
      expect(data[5]).toBe(15);   // Midi Out
      expect(data[6]).toBe(7);    // Sequencer Midi Out
      expect(data[7]).toBe(10);   // Device Id
      expect(data[8]).toBe(3);    // Enable CC
      expect(data[9]).toBe(1);    // Enable Sysex
      expect(data[10]).toBe(2);   // Enable PC
      expect(data[11]).toBe(3);   // Midi Soft Thru
      expect(data[12]).toBe(0);   // Midi Clock gen
      expect(data[13]).toBe(100); // Internal Velocity
      expect(data[14]).toBe(1);   // Master clock source
      expect(data[15]).toBe(0);   // Not used
      expect(data[16]).toBe(0);   // Not used
      expect(data[17]).toBe(0);   // Not used
      expect(data[18]).toBe(0b00000111); // Pattern level hi
      expect(data[19]).toBe(0b01101000); // Pattern level lo
      expect(data[20]).toBe(7);   // Pattern control
      expect(data[21]).toBe(0x0f); // Int clock rate hi
      expect(data[22]).toBe(0x0f); // Int clock rate lo
      expect(data[23]).toBe(96); // MW Level
      expect(data[24]).toBe(94); // AT Level
      expect(data[25]).toBe(1); // Key trans disabled
      expect(data[26]).toBe(3); // display mode
      expect(data[27]).toBe(1); // memory protect
      expect(data[28]).toBe(0); // not used
      expect(data[29]).toBe(0); // internal tune
      expect(data[30]).toBe(0); // external pedal polarity
      expect(data[31]).toBe(0); // not used
      expect(data[32]).toBe(0); // not used
      expect(data[33]).toBe(0); // not used
      expect(data[34]).toBe(0); // not used

    });
  });
});
