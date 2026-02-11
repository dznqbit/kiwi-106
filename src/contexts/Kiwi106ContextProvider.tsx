import { WebMidi, MessageEvent } from "webmidi";
import {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useConfigStore } from "../stores/configStore";
import { Kiwi106Context } from "./Kiwi106Context";
import { useMidiContext } from "../hooks/useMidiContext";
import { kiwi106Identifier, kiwiTechnicsSysexId } from "../utils/sysexUtils";
import { KiwiMidi, KiwiMidiFatalError } from "../types/KiwiMidi";
import { buildKiwiMidi } from "../utils/kiwiMidi";
import { type KiwiGlobalData } from "../types/KiwiGlobalData";
import { checkBrowser } from "../utils/checkBrowser";

const heartbeatIntervalMs = 5_000;

export const Kiwi106ContextProvider = ({ children }: PropsWithChildren) => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();
  const midiOutputId = configStore.output?.id;
  const midiInputId = configStore.input?.id;

  const [active, setActive] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatalError, setFatalError] = useState<KiwiMidiFatalError | null>(null);
  const [kiwiMidi, setKiwiMidi] = useState<KiwiMidi | null>(null);
  const [programVersion, setProgramVersion] = useState<string | null>(null);
  const [bootloaderVersion, setBootloaderVersion] = useState<string | null>(
    null,
  );
  const [buildNumber, setBuildNumber] = useState<string | null>(null);
  const [kiwiGlobalData, setKiwiGlobalData] = useState<KiwiGlobalData | null>(
    null,
  );
  const [lastHeartbeatAt, setLastHeartbeatAt] = useState<Date | null>(null);

  const sendDeviceEnquirySysex = useCallback(() => {
    if (!midiOutputId) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(midiOutputId);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    // Universal
    const universalNonRealtimeIdentification = [0x7e];
    const universalData: number[] = [
      0x7f, // ALL devices
      0x06, // General information
      0x01, // Device Inquiry request
    ];

    output.sendSysex(universalNonRealtimeIdentification, universalData);
  }, [midiOutputId]);

  const fail = useCallback(
    (reason: string, myFatalError?: KiwiMidiFatalError) => {
      console.log(`[Kiwi106Context] FAIL ${reason}`);

      if (myFatalError) {
        setFatalError(myFatalError);
      }

      if (active) {
        setActive(false);
      }

      if (connected) {
        setConnected(false);
      }

      if (kiwiMidi !== null) {
        setKiwiMidi(null);
      }
    },
    [active, connected, kiwiMidi],
  );

  useEffect(() => {
    const browserCheck = checkBrowser();
    if (!browserCheck.webMidiCapable) {
      fail(
        `${browserCheck.browserName} does not support WebMidi`,
        "webmidi-not-supported",
      );
      return;
    }
  }, [fail]);

  useEffect(() => {
    if (!midiContext.enabled) {
      fail("MidiContext not enabled");
      return;
    }

    if (!midiInputId) {
      fail("No inputId selected, cannot listen for heartbeats");
      return;
    }

    if (WebMidi.inputs.length === 0) {
      fail("WebMidi could not find inputs", "webmidi-empty-inputs");
      return;
    }

    const input = WebMidi.getInputById(midiInputId);
    if (!input) {
      fail(`Could not select midiInput "${midiInputId}"`);
      return;
    }

    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
    if (!output) {
      console.log("Send sysex message: no output");
      return;
    }

    const newKiwiMidi = (() => {
      if (kiwiMidi === null) {
        const newKiwiMidi = buildKiwiMidi({ input, output });
        setKiwiMidi(newKiwiMidi);
        return newKiwiMidi;
      }

      return kiwiMidi;
    })();

    // Fire off an initial device enquiry
    newKiwiMidi.requestSysexDeviceEnquiry();
    newKiwiMidi.requestSysexGlobalDump();

    // Set heartbeat timer
    const intervalHandle = setInterval(() => {
      newKiwiMidi.requestSysexDeviceEnquiry();
    }, heartbeatIntervalMs);

    const sysexListener = (e: MessageEvent) => {
      const messageData = e.message.data;

      // Device Inquiry
      if (
        messageData.length >= 10 &&
        messageData[0] === 0xf0 && // SysEx
        messageData[1] === 0x7e && // Non-Realtime
        messageData[3] === 0x06 && // General Information
        messageData[4] === 0x02 && // Identity Reply
        messageData[5] === kiwiTechnicsSysexId[0] && // Manufacturer Id Byte 1
        messageData[6] === kiwiTechnicsSysexId[1] && // Manufacturer Id Byte 2
        messageData[7] === kiwiTechnicsSysexId[2] && // Manufacturer Id Byte 3
        messageData[8] === kiwi106Identifier[0] && // Manufacturer Device Id Byte 1
        messageData[9] === kiwi106Identifier[1] && // Manufacturer Device Id Byte 2
        messageData[10] === 0 // Kiwi106 documentation suggests this is the "product Id"
      ) {
        const programMajorVersionNumber = messageData[11];
        const programMinorVersionNumber = messageData[12];
        const programVersion = `${programMajorVersionNumber}.${programMinorVersionNumber}`;

        const bootLoaderMajorVersionNumber = messageData[13];
        const bootLoaderMinorVersionNumber = messageData[14];
        const bootLoaderVersion = `${bootLoaderMajorVersionNumber}.${bootLoaderMinorVersionNumber}`;

        const buildNumber = messageData[15].toString();

        setActive(true);
        setConnected(true);
        setBootloaderVersion(bootLoaderVersion);
        setProgramVersion(programVersion);
        setBuildNumber(buildNumber);
        setLastHeartbeatAt(new Date());
        return;
      }

      try {
        const kiwi106Command = newKiwiMidi.parseSysex(e.message);
        switch (kiwi106Command.command) {
          case "Global Dump":
            setKiwiGlobalData(kiwi106Command.kiwiGlobalData);
            break;
          case "Patch Edit Buffer Dump":
            console.log(`Received Sysex "${kiwi106Command.command}"`);
            console.log(kiwi106Command.kiwiPatch);
            break;
          default:
            console.log(`Received Sysex "${kiwi106Command.command}": noop`);
            break;
        }
      } catch {
        return;
      }
    };

    input.addListener("sysex", sysexListener);

    return () => {
      clearInterval(intervalHandle);
      input.removeListener("sysex", sysexListener);
    };
  }, [
    kiwiMidi,
    sendDeviceEnquirySysex,
    midiContext.enabled,
    midiInputId,
    configStore.input,
    configStore.output,
    active,
    connected,
    fail,
  ]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const heartbeatCheckHandle = setInterval(() => {
      if (lastHeartbeatAt) {
        const timeSinceLastHeartbeatMs =
          new Date().getTime() - lastHeartbeatAt.getTime();

        if (timeSinceLastHeartbeatMs > heartbeatIntervalMs * 3) {
          const error = `Haven't seen heartbeat for ${Math.floor(timeSinceLastHeartbeatMs / 1000)}s`;
          console.log(`[Kiwi106Context] ${error}`);
          setConnected(false);
          setError(error);
        } else {
          setConnected(true);
          setError(null);
        }
      }
    }, heartbeatIntervalMs);

    return () => clearInterval(heartbeatCheckHandle);
  }, [active, lastHeartbeatAt]);

  const context: Kiwi106Context = useMemo(() => {
    if (
      active &&
      programVersion &&
      bootloaderVersion &&
      buildNumber &&
      kiwiMidi &&
      kiwiGlobalData &&
      midiOutputId &&
      midiInputId
    ) {
      return {
        active,
        connected,
        error,
        programVersion,
        bootloaderVersion,
        buildNumber,
        kiwiMidi,
        kiwiGlobalData,
      };
    } else {
      return {
        active: false,
        connected,
        error,
        fatalError,
      };
    }
  }, [
    active,
    connected,
    error,
    fatalError,
    kiwiMidi,
    kiwiGlobalData,
    programVersion,
    bootloaderVersion,
    buildNumber,
    midiInputId,
    midiOutputId,
  ]);

  return (
    <Kiwi106Context.Provider value={context}>
      {children}
    </Kiwi106Context.Provider>
  );
};
