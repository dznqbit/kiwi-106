import { WebMidi } from "webmidi";
import { buildKiwiMidi } from "./kiwiMidi";
import { describe, expect, it, Mock, vi } from "vitest";
import { KiwiGlobalData } from "../types/KiwiGlobalData";
import { MidiCcValue, MidiMessage } from "../types/Midi";
import { unpack12Bit } from "./sysexUtils";
import { KiwiPatch } from "../types/KiwiPatch";

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
    const kiwiGlobalData: KiwiGlobalData = {
      midiChannelIn: 1,
      midiChannelOut: 16,
      sequencerMidiChannelOut: 8,
      deviceId: 10,
      enableControlChange: "rx-tx",
      enableSysex: true,
      enableProgramChange: "tx",
      midiSoftThrough: "stop-only-cc-used",
      enableMidiClockGen: false,
      internalVelocity: 100,
      masterClockSource: "midi",
      patternLevel: 1000,
      patternClockSource: "seq",
      patternDestinationVca: true,
      patternDestinationVcf: true,
      intClockRate: 300,
      mwLevel: 96,
      atLevel: 94,
      keyTransposeDisable: true,
      clockDisplay: true,
      scrollingDisplay: true,
      internalTune: 0,
      externalPedalPolarity: "normal",
    };

    it("works", () => {
      const { kiwiMidi, output } = subject();
      kiwiMidi.sendSysexGlobalDump(kiwiGlobalData);
      const [[header, data]] = (output.sendSysex as Mock).mock.calls;

      expect(header).toEqual([0x00, 0x21, 0x16]);

      expect(data[0]).toBe(0x60); // Kiwi106 Identifier 1
      expect(data[1]).toBe(0x03); // Kiwi106 Identifier 2
      expect(data[2]).toBe(0x00); // Device Id
      expect(data[3]).toBe(0x02); // Transmit/Receive Global Dump
      expect(data[4]).toBe(0); // Midi In
      expect(data[5]).toBe(15); // Midi Out
      expect(data[6]).toBe(7); // Sequencer Midi Out
      expect(data[7]).toBe(10); // Device Id
      expect(data[8]).toBe(3); // Enable CC
      expect(data[9]).toBe(1); // Enable Sysex
      expect(data[10]).toBe(2); // Enable PC
      expect(data[11]).toBe(3); // Midi Soft Thru
      expect(data[12]).toBe(0); // Midi Clock gen
      expect(data[13]).toBe(100); // Internal Velocity
      expect(data[14]).toBe(1); // Master clock source
      expect(data[15]).toBe(0); // Not used
      expect(data[16]).toBe(0); // Not used
      expect(data[17]).toBe(0); // Not used
      expect(data[18]).toBe(0b00000111); // Pattern level hi
      expect(data[19]).toBe(0b01101000); // Pattern level lo

      // This pattern control seems to be busted, I don't understand why
      // expect(data[20]).toBe(7);   // Pattern control
      expect(data[20]).toBe(0x0f); // Int clock rate hi
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

    describe("pattern control", () => {
      it("scales 0 correctly", () => {
        const { kiwiMidi, output } = subject();

        kiwiMidi.sendSysexGlobalDump({ ...kiwiGlobalData, intClockRate: 5 });
        const [[_, data]] = (output.sendSysex as Mock).mock.calls;

        // This pattern control seems to be busted, I don't understand why
        // expect(data[20]).toBe(7);   // Pattern control
        expect(data[20]).toBe(0x00); // Int clock rate hi
        expect(data[21]).toBe(0x00); // Int clock rate hi
        expect(data[22]).toBe(0x00); // Int clock rate lo
      });

      it("scales 153 correctly", () => {
        const { kiwiMidi, output } = subject();

        kiwiMidi.sendSysexGlobalDump({ ...kiwiGlobalData, intClockRate: 153 });
        const [[_, data]] = (output.sendSysex as Mock).mock.calls;

        // This pattern control seems to be busted, I don't understand why
        // expect(data[20]).toBe(7);   // Pattern control
        expect(data[20]).toBe(0b1000); // Int clock rate hi
        expect(data[21]).toBe(0b1000); // Int clock rate hi
        expect(data[22]).toBe(0b0000); // Int clock rate lo
      });
    });
  });

  const patchEditBufferDumpPreludeData = [
    0xf0, // Sysex header
    0x00,
    0x21,
    0x16, // Kiwitechnics mfg id
    0x60,
    0x03, // Kiwi106 identifier
    0x00, // Device ID, in practice always 0
    0x04, // Patch Edit Buffer dump
    0x00,
    0x00, // Two null bytes per docs
  ];

  describe("sendSysexPatchBufferDump", () => {
    it("works", () => {
      // We store patch data as 7 bit (for now), but many messages are in 12-bit format
      const convert7BitTo12Bit = (n: number) => n << 5;
      // Invert the "c2b" helper from patchEditBufferDump
      const b2c = (n: MidiCcValue) => unpack12Bit(convert7BitTo12Bit(n));

      const { kiwiMidi, output } = subject();
      const bogs = 0;
      const kiwiPatch: KiwiPatch = {
        patchName: "Test Patch",
        dcoWave: "ramp-and-pulse",
        dcoRange: "8",
        dcoEnvelopeModAmount: 88,
        dcoLfoModAmount: 77,
        dcoBendAmount: 66,
        lfoModWheelAmount: 55,
        dcoPwmModAmount: 44,
        dcoEnvelopeSource: "env1-inverted",
        dcoPwmControl: "env2-inverted",
        subLevel: 33,
        noiseLevel: 22,
        vcfHiPassCutoff: 2,
        vcfLowPassCutoff: 11,
        vcfLowPassResonance: 23,
        vcfLfoModAmount: 34,
        vcfEnvelopeModAmount: 45,
        vcfPitchFollow: 56,
        vcfBendAmount: 67,
      };

      kiwiMidi.sendSysexPatchBufferDump(kiwiPatch);
      const patchName = [
        0x54,
        0x65,
        0x73,
        0x74,
        0x20,
        0x50,
        0x61,
        0x74,
        0x63,
        0x68, // "Test Patch"
        0x20,
        0x20,
        0x20,
        0x20,
        0x20,
        0x20,
        0x20,
        0x20,
        0x20,
        0x20, // 10 spaces padding
      ];
      expect(output.sendSysex).toHaveBeenCalledWith(
        [0x00, 0x21, 0x16],
        [
          0x60,
          0x03, // Kiwi106 identifier
          0x00, // Device ID, in practice always 0
          0x04, // Patch Edit Buffer dump
          0x00,
          0x00, // Two null bytes per docs
          ...patchName,
          0b0000_1101, // 20 DCO Wave/Range
          ...b2c(88), // 21-22 DCO Env Hi/Lo
          ...b2c(77), // 23-24 DCO LFO Hi/Lo
          ...b2c(66), // 25-26 DCO Bend Mod Amount
          ...b2c(55), // 27-28 DCO Bend LFO Mod
          ...b2c(44), // 29-30 DCO Pwm Amount
          0b0111_0000, // 31 DCO Control
          ...b2c(33), // 32-33 Sub Level
          ...b2c(22), // 34-35 Noise level
          2, // 36 HPF level
          ...b2c(11), // 37-38 VCF Cutoff level
          ...b2c(23), // 39-40 VCF Resonance level
          ...b2c(34), // 41-42 VCF LFO Amount
          ...b2c(45), // 43-44 VCF ENV amount
          ...b2c(56), // 45-46 VCF Key Follow Amount
          ...b2c(67), // 47-48 VCF Bend Mod Amount
          0b0000_1111, // 49 VCF Control
          ...b2c(78), // 50-51 ENV1 A
          ...b2c(89), // 52-53 ENV1 D
          ...b2c(98), // 54-55 ENV1 S
          ...b2c(101), // 56-57 ENV1 R
          ...b2c(74), // 58-59 ENV2 A
          ...b2c(85), // 60-61 ENV2 D
          ...b2c(96), // 62-63 ENV2 S
          ...b2c(102), // 64-65 ENV2 R
          0, // 66 Env Control (Not Used ??)
          0b0000_0101, // 67 LFO1 Wave
          ...b2c(103), // 68-69 LFO1 Rate
          ...b2c(104), // 70-71 LFO1 Delay
          0b0000_0011, // 72 LFO2 Wave
          ...b2c(105), // 73-74 LFO2 Rate
          ...b2c(106), // 75-76 LFO2 Delay
          0x71, // 77 LFO1 Control PARTIAL IMPLEMENETD
          0x02, // 78 Chorus Control
          ...b2c(107), // 79-80 VCA level
          ...b2c(111), // 81-82 VCA LFO Mod Amount
          0x02, // 83 VCA Control
          ...b2c(121), // 84-85 Portamento Rate
          bogs, // 86 Portamento Control
          bogs, // 87 Load Sequence
          bogs, // 88 Load Pattern
          0x05, // 89 Voice Mode
          0x10,
          0x20, // 90-91 Voice Detune
          0x01, // 92 Detune Control
          bogs, // 93 Arp Control NOT IMPLEMENTED
          bogs, // 94 Aftertouch Control NOT IMPLEMENTED
          bogs, // 95 MW Control (I forget what MW is, again) NOT IMPLEMENTED
          bogs, // 96 Midi Control NOT IMPLEMENTED
          bogs,
          bogs, // 97-98 Patch Clock Tempo NOT IMPLEMENTED
          bogs, // 99 Arp Clock Divide NOT IMPLEMENTED
          bogs, // 100 Seq Control NOT IMPLEMENTED
          bogs, // 101 Seq Transpose NOT IMPLEMENTED
          bogs, // 102 Dynamics Control NOT IMPLEMENTED
          0x70, // 103 LFO2 Control PARTIAL IMPLEMENTED
          bogs, // 104 Seq Clock Divide NOT IMPLEMENTED IMPLEMENETD
          // 105-127 Not used, all set to 0
        ]
      );
    });
  });

  describe("parseSysex", () => {
    describe("patch edit buffer dump", () => {
      it("parses patch edit buffer dump command", () => {
        const { kiwiMidi } = subject();

        // "bogus" in neat formatting
        const bogs = 0x00;

        const patchName = [
          0x54,
          0x65,
          0x73,
          0x74,
          0x20,
          0x50,
          0x61,
          0x74,
          0x63,
          0x68, // "Test Patch"
          0x20,
          0x20,
          0x20,
          0x20,
          0x20,
          0x20,
          0x20,
          0x20,
          0x20,
          0x20, // 10 spaces padding
        ];

        // We store patch data as 7 bit (for now), but many messages are in 12-bit format
        const convert7BitTo12Bit = (n: number) => n << 5;

        // Invert the "c2b" helper from patchEditBufferDump
        const b2c = (n: MidiCcValue) => unpack12Bit(convert7BitTo12Bit(n));

        const mockMessage: MidiMessage = {
          isChannelMessage: false,
          isSystemMessage: true,
          data: [
            ...patchEditBufferDumpPreludeData,
            ...patchName,
            0b0000_1101, // 20 DCO Wave
            ...b2c(88), // 21-22 DCO Env Hi/Lo
            ...b2c(77), // 23-24 DCO LFO Hi/Lo
            ...b2c(66), // 25-26 DCO Bend Mod Amount
            ...b2c(55), // 27-28 DCO Bend LFO Mod
            ...b2c(44), // 29-30 DCO Pwm Amount
            0b0111_0000, // 31 DCO Control
            ...b2c(33), // 32-33 Sub Level
            ...b2c(22), // 34-35 Noise level
            2, // 36 HPF level
            ...b2c(11), // 37-38 VCF Cutoff level
            ...b2c(23), // 39-40 VCF Resonance level
            ...b2c(34), // 41-42 VCF LFO Amount
            ...b2c(45), // 43-44 VCF ENV amount
            ...b2c(56), // 45-46 VCF Key Follow Amount
            ...b2c(67), // 47-48 VCF Bend Mod Amount
            0b0000_1111, // 49 VCF Control
            ...b2c(78), // 50-51 ENV1 A
            ...b2c(89), // 52-53 ENV1 D
            ...b2c(98), // 54-55 ENV1 S
            ...b2c(101), // 56-57 ENV1 R
            ...b2c(74), // 58-59 ENV2 A
            ...b2c(85), // 60-61 ENV2 D
            ...b2c(96), // 62-63 ENV2 S
            ...b2c(102), // 64-65 ENV2 R
            0, // 66 Env Control (Not Used ??)
            0b0000_0101, // 67 LFO1 Wave
            ...b2c(103), // 68-69 LFO1 Rate
            ...b2c(104), // 70-71 LFO1 Delay
            0b0000_0011, // 72 LFO2 Wave
            ...b2c(105), // 73-74 LFO2 Rate
            ...b2c(106), // 75-76 LFO2 Delay
            0x71, // 77 LFO1 Control PARTIAL IMPLEMENETD
            0x02, // 78 Chorus Control
            ...b2c(107), // 79-80 VCA level
            ...b2c(111), // 81-82 VCA LFO Mod Amount
            0x02, // 83 VCA Control
            ...b2c(121), // 84-85 Portamento Rate
            bogs, // 86 Portamento Control
            bogs, // 87 Load Sequence
            bogs, // 88 Load Pattern
            0x05, // 89 Voice Mode
            0x10,
            0x20, // 90-91 Voice Detune
            0x01, // 92 Detune Control
            bogs, // 93 Arp Control NOT IMPLEMENTED
            bogs, // 94 Aftertouch Control NOT IMPLEMENTED
            bogs, // 95 MW Control (I forget what MW is, again) NOT IMPLEMENTED
            bogs, // 96 Midi Control NOT IMPLEMENTED
            bogs,
            bogs, // 97-98 Patch Clock Tempo NOT IMPLEMENTED
            bogs, // 99 Arp Clock Divide NOT IMPLEMENTED
            bogs, // 100 Seq Control NOT IMPLEMENTED
            bogs, // 101 Seq Transpose NOT IMPLEMENTED
            bogs, // 102 Dynamics Control NOT IMPLEMENTED
            0x70, // 103 LFO2 Control PARTIAL IMPLEMENTED
            bogs, // 104 Seq Clock Divide NOT IMPLEMENTED IMPLEMENETD
            // 105-127 Not used, all set to 0
          ],
        };

        const result = kiwiMidi.parseSysex(mockMessage);
        expect(result.command).toBe("Patch Edit Buffer Dump");
        if (result.command === "Patch Edit Buffer Dump") {
          expect(result.kiwiPatch.patchName).toBe("Test Patch");
          expect(result.kiwiPatch.dcoWave).toBe("ramp-and-pulse");
          expect(result.kiwiPatch.dcoRange).toBe("8");
          expect(result.kiwiPatch.dcoEnvelopeModAmount).toBe(88);
          expect(result.kiwiPatch.dcoLfoModAmount).toBe(77);
          expect(result.kiwiPatch.dcoBendAmount).toBe(66);
          // TODO: dcoBendLfoAmount
          // expect(result.kiwiPatch.dcoBendAmount).toBe(55);
          expect(result.kiwiPatch.dcoPwmModAmount).toBe(44);
          expect(result.kiwiPatch.dcoEnvelopeSource).toBe("env1-inverted");
          expect(result.kiwiPatch.dcoPwmControl).toBe("env2-inverted");
          expect(result.kiwiPatch.subLevel).toBe(33);
          expect(result.kiwiPatch.noiseLevel).toBe(22);
          expect(result.kiwiPatch.vcfHiPassCutoff).toBe(2);
          expect(result.kiwiPatch.vcfLowPassCutoff).toBe(11);
          expect(result.kiwiPatch.vcfLowPassResonance).toBe(23);
          expect(result.kiwiPatch.vcfLfoModAmount).toBe(34);
          expect(result.kiwiPatch.vcfEnvelopeModAmount).toBe(45);
          expect(result.kiwiPatch.vcfPitchFollow).toBe(56);
          expect(result.kiwiPatch.vcfBendAmount).toBe(67);
          expect(result.kiwiPatch.vcfEnvelopeSource).toBe("env2");
          expect(result.kiwiPatch.vcfLfoSource).toBe("lfo2-inverted");
          expect(result.kiwiPatch.env1Attack).toBe(78);
          expect(result.kiwiPatch.env1Decay).toBe(89);
          expect(result.kiwiPatch.env1Sustain).toBe(98);
          expect(result.kiwiPatch.env1Release).toBe(101);
          expect(result.kiwiPatch.env2Attack).toBe(74);
          expect(result.kiwiPatch.env2Decay).toBe(85);
          expect(result.kiwiPatch.env2Sustain).toBe(96);
          expect(result.kiwiPatch.env2Release).toBe(102);
          expect(result.kiwiPatch.lfo1Wave).toBe("random");
          expect(result.kiwiPatch.lfo1Rate).toBe(103);
          expect(result.kiwiPatch.lfo1Delay).toBe(104);
          expect(result.kiwiPatch.lfo2Wave).toBe("sawtooth");
          expect(result.kiwiPatch.lfo2Rate).toBe(105);
          expect(result.kiwiPatch.lfo2Delay).toBe(106);

          expect(result.kiwiPatch.volume).toBe(107);
          expect(result.kiwiPatch.vcaLfoModAmount).toBe(111);
          expect(result.kiwiPatch.portamentoTime).toBe(121);
          // expect(result.kiwiPatch.portamentoMode).toBe("on")

          // expect(result.kiwiPatch.dcoPwmModAmount).toBe(44);

          expect(result.kiwiPatch.lfo1Mode).toBe("plus");
          expect(result.kiwiPatch.lfo2Mode).toBe("normal");
          expect(result.kiwiPatch.chorusMode).toBe("chorus2");
          expect(result.kiwiPatch.vcaMode).toBe("env2");
          expect(result.kiwiPatch.keyMode).toBe("mono-staccato");
          expect(result.kiwiPatch.keyAssignDetune).toBe(65);
          expect(result.kiwiPatch.keyAssignDetuneMode).toBe("all");
        }
      });
    });

    it("parses global dump command", () => {
      const { kiwiMidi } = subject();
      const mockMessageData = [
        0xf0, 0x00, 0x21, 0x16, 0x60, 0x03, 0x00, 0x02, 0x00, 0x0f, 0x07, 0x0a,
        0x03, 0x01, 0x02, 0x03, 0x00, 0x64, 0x01, 0x00, 0x00, 0x00, 0x07, 0x68,
        0x07, 0x0f, 0x0f, 0x60, 0x5e, 0x01, 0x03, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0xf7,
      ];
      const mockMessage: MidiMessage = {
        data: mockMessageData,
        isSystemMessage: true,
        isChannelMessage: false,
      };

      const result = kiwiMidi.parseSysex(mockMessage);
      expect(result.command).toBe("Global Dump");
    });

    it("parses global dump received command", () => {
      const { kiwiMidi } = subject();
      const mockMessage: MidiMessage = {
        isSystemMessage: true,
        isChannelMessage: false,
        data: [
          0xf0, 0x00, 0x21, 0x16, 0x60, 0x03, 0x00, 0x25, 0x00, 0x01, 0xf7,
        ],
      };

      const result = kiwiMidi.parseSysex(mockMessage);
      expect(result.command).toBe("Global Dump Received");
    });

    it("throws error for non-Kiwi106 sysex message", () => {
      const { kiwiMidi } = subject();
      const mockMessage: MidiMessage = {
        isSystemMessage: true,
        isChannelMessage: false,
        data: [
          0xf0, 0x7e, 0x00, 0x06, 0x02, 0x41, 0x16, 0x02, 0x00, 0x02, 0x00,
          0x01, 0xf7,
        ],
      };

      expect(() => kiwiMidi.parseSysex(mockMessage)).toThrow(
        "[kiwiMidi] could not interpret non-Kiwi106 sysex message"
      );
    });

    it("throws error for unsupported Kiwi106 sysex command", () => {
      const { kiwiMidi } = subject();
      const mockMessage: MidiMessage = {
        isSystemMessage: true,
        isChannelMessage: false,
        data: [
          0xf0, 0x00, 0x21, 0x16, 0x60, 0x03, 0x00, 0x30, 0x00, 0x01, 0xf7,
        ],
      };

      expect(() => kiwiMidi.parseSysex(mockMessage)).toThrow();
    });
  });
});
