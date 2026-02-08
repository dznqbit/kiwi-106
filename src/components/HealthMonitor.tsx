import { Box, Group, Tooltip } from "@mantine/core";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { useMidiContext } from "../hooks/useMidiContext";
import { MidiContextStatus } from "../contexts/MidiContext";
import { EventEmitter, WebMidi } from "webmidi";
import { useEffect } from "react";

type IndicatorStatus = "init" | "enabled" | "error" | "warning";

const indicatorColors: Record<IndicatorStatus, string> = {
  init: "grey",
  enabled: "green",
  error: "red",
  warning: "yellow",
};

const Indicator = ({
  status,
  label,
}: {
  status: IndicatorStatus;
  label: string;
}) => (
  <Tooltip label={label}>
    <Box w={20} h={20} bg={indicatorColors[status]}></Box>
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
  const kiwi106Context = useKiwi106Context();
  
  if (kiwi106Context.active) {
    return (
      <>
        <Indicator label="MIDI Out" status="init" />
        <Indicator label="MIDI In" status="init" />
      </>
    );
  } else {
    return (
      <>
        <Indicator label="MIDI Out" status="init" />
        <Indicator label="MIDI In" status="init" />
      </>
    );
  }
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
