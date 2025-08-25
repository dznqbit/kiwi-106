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
import { KiwiMidi } from "../types/KiwiMidi";
import { buildKiwiMidi } from "../utils/kiwiMidi";

const heartbeatIntervalMs = 5_000;

export const Kiwi106ContextProvider = ({ children }: PropsWithChildren) => {
  const midiContext = useMidiContext();
  const configStore = useConfigStore();

  const [active, setActive] = useState(false);
  const [kiwiMidi, setKiwiMidi] = useState<KiwiMidi | null>(null);
  const [programVersion, setProgramVersion] = useState<string | null>(null);
  const [bootloaderVersion, setBootloaderVersion] = useState<string | null>(
    null,
  );
  const [lastHeartbeatAt, setLastHeartbeatAt] = useState<Date | null>(null);

  const sendDeviceEnquirySysex = useCallback(() => {
    if (!configStore.output?.id) {
      console.log("Send sysex message: no output");
      return;
    }

    const output = WebMidi.getOutputById(configStore.output?.id);
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
  }, [configStore]);

  useEffect(() => {
    const fail = (reason: string) => {
      console.log(`[Kiwi106Context] FAIL ${reason}`);
      if (active) {
        setActive(false);
      }

      if (kiwiMidi !== null) {
        setKiwiMidi(null);
      }
    };

    if (!midiContext.enabled) {
      fail("MidiContext not enabled");
      return;
    }

    const midiInputId = configStore.input?.id;
    if (!midiInputId) {
      fail("No inputId selected, cannot listen for heartbeats");
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

    const newKiwiMidi = buildKiwiMidi({ input, output });
    setKiwiMidi(newKiwiMidi);

    // Fire off an initial device enquiry
    newKiwiMidi.requestDeviceEnquirySysex();

    // Set heartbeat timer
    const intervalHandle = setInterval(() => {
      newKiwiMidi.requestDeviceEnquirySysex();
    }, heartbeatIntervalMs);

    const kiwi106DeviceEnquiryListener = (e: MessageEvent) => {
      const messageData = e.message.data;

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

        setActive(true);
        setBootloaderVersion(bootLoaderVersion);
        setProgramVersion(programVersion);
        setLastHeartbeatAt(new Date());
      }
    };

    input.addListener("sysex", kiwi106DeviceEnquiryListener);

    return () => {
      clearInterval(intervalHandle);
      input.removeListener("sysex", kiwi106DeviceEnquiryListener);
    };
  }, [
    sendDeviceEnquirySysex,
    midiContext.enabled,
    configStore.input,
    configStore.output,
    active,
  ]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const heartbeatCheckHandle = setInterval(() => {
      if (lastHeartbeatAt) {
        const timeSinceLastHeartbeatMs =
          new Date().getTime() - lastHeartbeatAt.getTime();

        if (timeSinceLastHeartbeatMs > 15_000) {
          console.log(
            `[Kiwi106Context] Haven't seen heartbeat since ${timeSinceLastHeartbeatMs}`,
          );
          setActive(false);
        }
      }
    }, heartbeatIntervalMs);

    return () => clearInterval(heartbeatCheckHandle);
  }, [active, lastHeartbeatAt]);

  const context: Kiwi106Context = useMemo(
    () => ({
      active,
      midiError: midiContext.enableError,
      programVersion,
      bootloaderVersion,
      kiwiMidi,
    }),
    [
      active,
      kiwiMidi,
      midiContext.enableError,
      programVersion,
      bootloaderVersion,
    ],
  );

  return (
    <Kiwi106Context.Provider value={context}>
      {children}
    </Kiwi106Context.Provider>
  );
};
