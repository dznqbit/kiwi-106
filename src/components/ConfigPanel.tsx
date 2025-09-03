import { Group, List, ListItem, Select, Stack, Text } from "@mantine/core";
import { useKiwi106Context } from "../hooks/useKiwi106Context";
import { Selector } from "./Selector";
import { kiwi106MessageModes, KiwiGlobalData } from "../types/KiwiGlobalData";
import { midiChannels } from "../types/Midi";
import { JunoToggleSwitch } from "./JunoToggleSwitch";
import { useEffect, useState } from "react";

export const ConfigPanel = () => {
  const kiwi106Context = useKiwi106Context();
  const midiChannelData = midiChannels.map((c) => ({
    value: c.toString(),
    label: c.toString(),
  }));

  const kiwi106MessageData = kiwi106MessageModes.map((mm) => ({
    value: mm.toString(),
    label: mm.toString(),
  }));

  const [midiCc, setMidiCc] = useState("lo");
  const [kiwiGlobalData, setKiwiGlobalData] = useState<KiwiGlobalData>();

  useEffect(() => {
    const globalData = kiwi106Context.kiwiGlobalData;
    if (globalData) {
      setKiwiGlobalData(globalData);
    }
  }, [kiwi106Context.kiwiGlobalData]);

  return (
    <Stack>
      <Stack>
        <List>
          <ListItem>Program version {kiwi106Context.programVersion}</ListItem>

          <ListItem>
            Bootloader version {kiwi106Context.bootloaderVersion}
          </ListItem>

          <ListItem>Build number {kiwi106Context.buildNumber}</ListItem>

          <Group>
            <Select
              label="MIDI Ch In"
              data={midiChannelData}
              value={
                kiwi106Context.kiwiGlobalData?.midiChannelIn?.toString() ?? null
              }
              onChange={(value) =>
                console.log(`Select MIDI Channel In ${value}`)
              }
            />

            <Select
              label="MIDI Ch Out"
              data={midiChannelData}
              value={
                kiwi106Context.kiwiGlobalData?.midiChannelOut?.toString() ??
                null
              }
              onChange={(value) =>
                console.log(`Select MIDI Channel Out ${value}`)
              }
            />

            <Select
              label="Seq MIDI Ch Out"
              data={midiChannelData}
              value={
                kiwi106Context.kiwiGlobalData?.sequencerMidiChannelOut?.toString() ??
                null
              }
              onChange={(value) =>
                console.log(`Select Sequencer MIDI Channel Out ${value}`)
              }
            />
            <Text>
              Device ID: {kiwi106Context.kiwiGlobalData?.deviceId ?? "Unknown"}
            </Text>
          </Group>

          <Group>
            <JunoToggleSwitch
              label="CC"
              data={kiwi106MessageData}
              selected={kiwiGlobalData?.enableControlChange ?? "off"}
              onSelect={(d) =>
                setKiwiGlobalData({ ...kiwiGlobalData, enableControlChange: d })
              }
            />
            <Selector
              label="Enable CC"
              values={kiwi106MessageModes}
              selected={
                kiwi106Context.kiwiGlobalData?.enableControlChange ?? null
              }
              onSelect={(x) => console.log(`Select MIDI CC ${x}`)}
            />

            <Selector
              label="Enable SysEx"
              values={[true, false]}
              selected={kiwi106Context.kiwiGlobalData?.enableSysex ?? null}
              onSelect={(x) => console.log(`Select Enable SysEx ${x}`)}
            />

            <Selector
              label="Enable PC"
              values={kiwi106MessageModes}
              selected={
                kiwi106Context.kiwiGlobalData?.enableProgramChange ?? null
              }
              onSelect={(x) => console.log(`Select Enable Program Change ${x}`)}
            />
          </Group>
          <Group>
            <Selector
              label="MIDI Soft Through"
              values={[
                "stop-all",
                "pass-all",
                "pass-only-non-cc",
                "stop-only-cc-used",
              ]}
              selected={kiwi106Context.kiwiGlobalData?.midiSoftThrough ?? null}
              onSelect={(x) => console.log(`Select MIDI Soft Through ${x}`)}
            />

            <Selector
              label="Enable MIDI Clock Gen"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.enableMidiClockGen ?? null
              }
              onSelect={(x) => console.log(`Select Enable MIDI Clock Gen ${x}`)}
            />

            <Text>
              Internal Velocity:{" "}
              {kiwi106Context.kiwiGlobalData?.internalVelocity ?? "Unknown"}
            </Text>

            <Selector
              label="Master Clock Source"
              values={[
                "internal",
                "midi",
                "ext step",
                "ext 24ppqn",
                "ext 48ppqn",
              ]}
              selected={
                kiwi106Context.kiwiGlobalData?.masterClockSource ?? null
              }
              onSelect={(x) => console.log(`Select Master Clock Source ${x}`)}
            />

            <Text>
              Pattern Level:{" "}
              {kiwi106Context.kiwiGlobalData?.patternLevel ?? "Unknown"}
            </Text>

            <Selector
              label="Pattern Destination VCA"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.patternDestinationVca ?? null
              }
              onSelect={(x) =>
                console.log(`Select Pattern Destination VCA ${x}`)
              }
            />

            <Selector
              label="Pattern Destination VCF"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.patternDestinationVcf ?? null
              }
              onSelect={(x) =>
                console.log(`Select Pattern Destination VCF ${x}`)
              }
            />

            <Selector
              label="Pattern Clock Source"
              values={["arp", "seq"]}
              selected={
                kiwi106Context.kiwiGlobalData?.patternClockSource ?? null
              }
              onSelect={(x) => console.log(`Select Pattern Clock Source ${x}`)}
            />

            <Text>
              Internal Clock Rate:{" "}
              {kiwi106Context.kiwiGlobalData?.intClockRate ?? "Unknown"}
            </Text>

            <Text>
              MW Level: {kiwi106Context.kiwiGlobalData?.mwLevel ?? "Unknown"}
            </Text>

            <Text>
              AT Level: {kiwi106Context.kiwiGlobalData?.atLevel ?? "Unknown"}
            </Text>

            <Selector
              label="Key Transpose Disable"
              values={[true, false]}
              selected={
                kiwi106Context.kiwiGlobalData?.keyTransposeDisable ?? null
              }
              onSelect={(x) => console.log(`Select Key Transpose Disable ${x}`)}
            />

            <Selector
              label="Clock Display"
              values={[true, false]}
              selected={kiwi106Context.kiwiGlobalData?.clockDisplay ?? null}
              onSelect={(x) => console.log(`Select Clock Display ${x}`)}
            />

            <Selector
              label="Scrolling Display"
              values={[true, false]}
              selected={kiwi106Context.kiwiGlobalData?.scrollingDisplay ?? null}
              onSelect={(x) => console.log(`Select Scrolling Display ${x}`)}
            />

            <Text>
              Internal Tune:{" "}
              {kiwi106Context.kiwiGlobalData?.internalTune ?? "Unknown"}
            </Text>

            <Selector
              label="External Pedal Polarity"
              values={["normal", "inverse"]}
              selected={
                kiwi106Context.kiwiGlobalData?.externalPedalPolarity ?? null
              }
              onSelect={(x) =>
                console.log(`Select External Pedal Polarity ${x}`)
              }
            />
          </Group>
        </List>
      </Stack>
    </Stack>
  );
};
