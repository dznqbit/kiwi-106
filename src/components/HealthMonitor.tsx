import { Group, Tooltip } from "@mantine/core";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiContextStatus } from "../contexts/MidiContext";
import { useEffect, useRef } from "react";
import { IndicatorLed } from "./IndicatorLed";
import { flashIndicatorLed } from "../utils/flashIndicatorLed";

type IndicatorStatus = "init" | "enabled" | "error" | "warning";

const Indicator = ({
  status,
  label,
  ledRef,
}: {
  status: IndicatorStatus;
  label: string;
  ledRef?: React.Ref<HTMLDivElement>;
}) => (
  <Tooltip label={label}>
    <IndicatorLed ref={ledRef} status={status} />
  </Tooltip>
);

const midiContextStatusMap: Record<MidiContextStatus, IndicatorStatus> = {
  enabled: "enabled",
  uninitialized: "init",
  error: "error",
};

const MidiContextIndicator = () => {
  const midiContext = useMidiContext();
  const midiContextTooltip =
    midiContext.enableError ??
    (midiContext.enabled ? "WebMidi enabled" : "WebMidi not initialized");

  return (
    <Indicator
      label={midiContextTooltip}
      status={midiContextStatusMap[midiContext.status]}
    />
  );
};

const KiwiContextIndicator = () => {
  const kiwi106Context = useKiwi106Context();

  if (kiwi106Context.active) {
    if (kiwi106Context.connected) {
      return <Indicator label={`Kiwi106 connected`} status="enabled" />;
    } else {
      return (
        <Indicator
          label={kiwi106Context.error ?? "Kiwi106 not responding"}
          status="warning"
        />
      );
    }
  } else {
    if (kiwi106Context.error) {
      return <Indicator label={kiwi106Context.error} status="error" />;
    } else {
      return <Indicator label="Kiwi106 not enabled" status="init" />;
    }
  }
};

const MidiTrafficIndicators = () => {
  const midiInputRef = useRef<null | HTMLDivElement>(null);
  const midiOutputRef = useRef<null | HTMLDivElement>(null);

  const kiwi106Context = useKiwi106Context();

  useEffect(() => {
    if (kiwi106Context.active) {
      const { kiwiMidi } = kiwi106Context;
      const receiveMessageHandle = kiwiMidi.addEventListener(
        "receiveMessage",
        () => {
          const currentInputRef = midiInputRef?.current;
          if (currentInputRef != null) {
            flashIndicatorLed(currentInputRef);
          }
        },
      );

      const sentMessageHandle = kiwiMidi.addEventListener("sendMessage", () => {
        const currentOutputRef = midiOutputRef?.current;
        if (currentOutputRef != null) {
          flashIndicatorLed(currentOutputRef);
        }
      });

      return () => {
        kiwiMidi.removeEventListener("receiveMessage", receiveMessageHandle);
        kiwiMidi.removeEventListener("sendMessage", sentMessageHandle);
      };
    }
  }, [kiwi106Context]);

  return (
    <>
      <Indicator ledRef={midiOutputRef} label="MIDI Out" status="init" />
      <Indicator ledRef={midiInputRef} label="MIDI In" status="init" />
    </>
  );
};

export const HealthMonitor = () => {
  return (
    <Group>
      <MidiContextIndicator />
      <KiwiContextIndicator />
      <MidiTrafficIndicators />
    </Group>
  );
};
