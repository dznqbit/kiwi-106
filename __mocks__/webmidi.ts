import { vi } from 'vitest';

export class Input {
  constructor(id: string) {
    this.id = id;
  }

  id: string;
  name: string = 'Mock Input';
  manufacturer: string = 'Mock Manufacturer';
  state: string = 'connected';
  type: string = 'input';

  addListener = vi.fn();
  removeListener = vi.fn();
  hasListener = vi.fn().mockReturnValue(false);
  send = vi.fn();
  sendSysex = vi.fn();
  sendTimecodeQuarterFrame = vi.fn();
  sendSongPosition = vi.fn();
  sendSongSelect = vi.fn();
  sendTuningRequest = vi.fn();
  sendClock = vi.fn();
  sendStart = vi.fn();
  sendContinue = vi.fn();
  sendStop = vi.fn();
  sendActiveSensing = vi.fn();
  sendReset = vi.fn();
  open = vi.fn();
  close = vi.fn();
}

export class Output {
  constructor(id: string) {
    this.id = id;
  }

  id: string;

  name: string = 'Mock Output';
  manufacturer: string = 'Mock Manufacturer';
  state: string = 'connected';
  type: string = 'output';

  addListener = vi.fn();
  removeListener = vi.fn();
  hasListener = vi.fn().mockReturnValue(false);
  send = vi.fn();
  sendSysex = vi.fn();
  sendTimecodeQuarterFrame = vi.fn();
  sendSongPosition = vi.fn();
  sendSongSelect = vi.fn();
  sendTuningRequest = vi.fn();
  sendClock = vi.fn();
  sendStart = vi.fn();
  sendContinue = vi.fn();
  sendStop = vi.fn();
  sendActiveSensing = vi.fn();
  sendReset = vi.fn();
  open = vi.fn();
  close = vi.fn();
}

class MockWebMidi {
  enabled: boolean = false;
  inputs: Input[] = [];
  outputs: Output[] = [];

  enable = vi.fn();
  disable = vi.fn();
  
  getInputById(id: string): Input {
    return new Input(id);
  }
  
  getOutputById(id: string): Output {
    return new Output(id);
  }

  getInputByName = vi.fn();
  getOutputByName = vi.fn();
  addListener = vi.fn();
  removeListener = vi.fn();
  hasListener = vi.fn().mockReturnValue(false);
}

export const WebMidi = new MockWebMidi();