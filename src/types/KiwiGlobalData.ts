import { IntRange } from "./IntRange";
import { MidiChannel } from "./Midi";

export const kiwi106MessageModes = ["off", "rx", "tx", "rx-tx"] as const;
type Kiwi106MessageMode = (typeof kiwi106MessageModes)[number];

/**
 * Sysex Global Dump data
 */
export interface KiwiGlobalData {
  midiChannelIn: MidiChannel;
  midiChannelOut: MidiChannel;
  SequencerMidiChannelOut: MidiChannel;
  deviceId: IntRange<0, 16>;
  enableMidiCc: Kiwi106MessageMode;
  enableSysex: boolean; // 00=Off / 01=On
  
  enableProgramChange: "off" | "rx" | "tx" | "rx-tx";
                      // 00=None
                      // 01=PC Receive Enabled (Default)
                      // 02=PC Transmit Enabled
                      // 03=PC Receive & Transmit Enabled
  
  midiSoftThrough: "stop-all" | "pass-all" | "pass-only-non-cc" | "stop-only-cc-used";
  // xx = 00=Stop all
  // 01=Pass all
  // 10=Pass only nonCC
  // 11=Stop only CC we have used
  // Note - Midi real time (>$F8) will always pass
  // Note - SysEx intended for the Juno-106 will not be passed
  // Note – Active Sensing commands are suppressed within the 106 and not passed on

  enableMidiClockGen: boolean;
  internalVelocity: IntRange<0, 128>;
  masterClockSource: "internal" | "midi" | "ext step" | "ext 24ppqn" | "ext 48ppqn";  
                      // xx= 000-Internal
                      // 001-Midi
                      // 010-Ext Step
                      // 011-Ext 24ppqn
                      // 100-Ext 48ppqn
                      // Note – Master Clock will be divided according to the
                      // Arp/Seq/LFO Clock Divide options

  patternLevel: number; // 12 bit word
  patternDestinationVca: boolean;
  patternDestinationVcf: boolean;
  patternClockSource: "arp" | "seq";

  intClockRate: number; // Range is 0-255 for 5-300 BPM
  mwLevel: number; // I have NO IDEA what this is
  atLevel: number; // I have NO IDEA what this is
  keyTransposeDisable: boolean;
  clockDisplay: boolean;
  scrollingDisplay: boolean;
  internalTune: number; // 0=use fine tune knob
                        // 1-127=override fine tune
  externalPedalPolarity: "normal" | "inverse";
}