# Kiwi-106 MIDI SysEx Reference

## SysEx Header Format

```
0xf0                 Sysex Start
0x00 0x21 0x16        Kiwitechnics Manufacturers ID
0x60                Kiwitechnics ID
0x03                Kiwitechnics Juno-106 ID
nn                 Device ID (0x00-0x0f) (Juno-106 Device ID 1-16)
xx                 Command ID (see Command Table)
[Data]             Depending on command type
0xf7                Sysex Footer
```

**WARNING!** SysEx dumps have the ability to put non valid settings into memory and few checks are made for validity. If the Juno-106 becomes unusable due to non valid data you may need to do a full restore of the Juno-106 which will lose all saved memory.

## Command ID Reference

| Command | Description |
|---------|-------------|
| 0x01 | Request Global Dump |
| 0x02 | Transmit/Receive Global Dump |
| 0x03 | Request Patch Edit Buffer Dump |
| 0x04 | Transmit/Receive Patch Edit Buffer Dump |
| 0x05 | Request Patch Dump |
| 0x06 | Transmit/Receive Patch Dump |
| 0x07 | Request Pattern Dump |
| 0x08 | Transmit/Receive Pattern Dump |
| 0x09 | Request Seq Dump |
| 0x0a | Transmit/Receive Seq Dump |
| 0x0b | Request Patch Name |
| 0x0c | Transmit/Receive Patch Name |
| 0x0d | Request Patch Parameter |
| 0x0e | Transmit/Receive Patch Parameter |
| 0x0f | Request Global Parameter |
| 0x10 | Transmit/Receive Global Parameter |
| 0x11 | Request Pattern Edit Buffer Dump |
| 0x12 | Transmit/Receive Pattern Edit Buffer Dump |
| 0x13 | Request Sequence Edit Buffer Dump |
| 0x14 | Transmit/Receive Sequence Edit Buffer Dump |
| 0x15 | Request Seq Edit Buffer Step |
| 0x16 | Transmit/Receive Sequence Edit Step |

## Detailed Command Reference

### 0x01 Request Global Dump
- **Data:** No Data
- **Response:** Juno-106 transmits a 0x02 command

### 0x02 Transmit/Receive Global Dump
- **Data:** 48 data bytes

| Byte | Parameter | Format | Description |
|------|-----------|--------|-------------|
| 0x00 | Midi Channel In | 000yxxxx | xxxx = 0-15 for midi channel 1-16, y = set for Omni |
| 0x01 | Midi Channel Out | 0000xxxx | xxxx = 0-15 for midi channel 1-16 |
| 0x02 | Seq Midi Channel Out | 0000xxxx | xxxx = 0-15 for midi channel 1-16 |
| 0x03 | Device ID | 0000xxxx | xxxx = 0-15 for ID 1-16 |
| 0x04 | Enable MidiCC | 000000xx | 00=Off, 01=CC Receive Enabled (Default), 02=CC Transmit Enabled, 03=CC Receive & Transmit Enabled |
| 0x05 | Enable Sysex | 0000000x | x = Off/On (set=On) |
| 0x06 | Enable Program Change | 000000xx | 00=None, 01=PC Receive Enabled (Default), 02=PC Transmit Enabled, 03=PC Receive & Transmit Enabled |
| 0x07 | Midi Soft Through | 000000xx | 00=Stop all, 01=Pass all, 10=Pass only nonCC, 11=Stop only CC we have used |
| 0x08 | Enable Midi Clock Gen | 0000000x | x = Off/On (set=On) |
| 0x09 | Internal Velocity | 0xxxxxxx | x = Range 0x00-0x7f (0-127) |
| 0x0a | Master Clock Source | 000000xx | 000-Internal, 001-Midi, 010-Ext Step, 011-Ext 24ppqn, 100-Ext 48ppqn |
| 0x0b | Not Used | 00000000 | |
| 0x0c-0x0d | Not Used | 00000000 | |
| 0x0e | Pattern Level Hi | 000xxxxx | |
| 0x0f | Pattern Level Lo | 0yyyyyyy | Hi & Lo combined to make single 12 bit command |
| 0x10 | Pattern Control | 00000xyz | y=VCA Amount Destination, z=VCF Cutoff Destination, x=Clock Source |
| 0x11 | Int Clock Rate Hi | 0000xxxx | |
| 0x12 | Int Clock Rate Lo | 0000yyyy | Combined to make single 8 bit command, Range 0-255 for 5-300 BPM |
| 0x13 | MW Level | 0xxxxxxx | x = Range 0x00-0x7f (0-127) |
| 0x14 | AT Level | 0xxxxxxx | x = Range 0x00-0x7f (0-127) |
| 0x15 | Key Trans Disable | 0000000x | x = Disable Key Transpose (0=enable,1=disable) |
| 0x16 | Display Mode | 000000yz | z=Clock Display, y=Scrolling Display |
| 0x17 | Memory Protect | 0000000z | z = Memory Protect (Read only) |
| 0x18 | Not Used | 00000000 | |
| 0x19 | Internal Tune | 0xxxxxxx | x = Fine Tune Override |
| 0x1a | External Pedal Polarity | 0000000x | x = Ext Pedal Polarity |
| 0x1b-0x1f | Nulls | | Not currently Used |

### 0x03 Request Patch Edit Buffer Dump
- **Data:** No Data

### 0x04 Transmit/Receive Patch Edit Buffer Dump
- **Data:** 2 x Null + 128 data bytes

| Bytes | Parameter | Format | Description |
|-------|-----------|--------|-------------|
| 0x00-0x13 | Patch Name | Ascii Bytes | Patch Name |
| 0x14 | DCO Wave/Range | 0000zyxx | xx=DCO Range (00=16', 01=8', 10=4'), y=Saw On/Off, z=Pulse On/Off |
| 0x15-0x16 | DCO Env Amount | Hi/Lo | Combined to make 12 bit command |
| 0x17-0x18 | DCO LFO Amount | Hi/Lo | Combined to make 12 bit command |
| 0x19-0x1a | DCO Bend Mod Amount | Hi/Lo | Combined to make 12 bit command |
| 0x1b-0x1c | DCO Bend LFO Mod Amount | Hi/Lo | Combined to make 12 bit command |
| 0x1d-0x1e | DCO PWM Amount | Hi/Lo | Combined to make 12 bit command |
| 0x1f | DCO Control | Complex | Multiple bit fields for DCO control |
| 0x20-0x21 | Sub Level | Hi/Lo | Combined to make 12 bit command |
| 0x22-0x23 | Noise Level | Hi/Lo | Combined to make 12 bit command |
| 0x24 | HPF Level | 000000xx | xx = 0-3 |
| 0x25-0x26 | VCF Cutoff | Hi/Lo | Combined to make 12 bit command |
| 0x27-0x28 | VCF Resonance | Hi/Lo | Combined to make 12 bit command |
| 0x29-0x2a | VCF LFO Amount | Hi/Lo | Combined to make 12 bit command |
| 0x2b-0x2c | VCF ENV Amount | Hi/Lo | Combined to make 12 bit command |
| 0x2d-0x2e | VCF Key Amount | Hi/Lo | Combined to make 12 bit command |
| 0x2f-0x30 | VCF Bend Mod Amount | Hi/Lo | Combined to make 12 bit command |
| 0x31 | VCF Control | 0000wxyz | Control bits for VCF |
| 0x32-0x33 | Env 1 Attack | Hi/Lo | Combined to make 12 bit command |
| 0x34-0x35 | Env 1 Decay | Hi/Lo | Combined to make 12 bit command |
| 0x36-0x37 | Env 1 Sustain | Hi/Lo | Combined to make 12 bit command |
| 0x38-0x39 | Env 1 Release | Hi/Lo | Combined to make 12 bit command |
| 0x3a-0x3b | Env 2 Attack | Hi/Lo | Combined to make 12 bit command |
| 0x3c-0x3d | Env 2 Decay | Hi/Lo | Combined to make 12 bit command |
| 0x3e-0x3f | Env 2 Sustain | Hi/Lo | Combined to make 12 bit command |
| 0x40-0x41 | Env 2 Release | Hi/Lo | Combined to make 12 bit command |
| 0x42 | Env Control | | Not used |
| 0x43 | LFO 1 Wave | 000000xxx | 000=Sine, 001=Triangle, 010=Square, 011=Saw, 100=Reverse Saw, 101=Random |
| 0x44-0x45 | LFO 1 Rate | Hi/Lo | Combined to make 12 bit command |
| 0x46-0x47 | LFO 1 Delay | Hi/Lo | Combined to make 12 bit command |
| 0x48 | LFO 2 Wave | 000000xxx | Same values as LFO 1 Wave |
| 0x49-0x4a | LFO 2 Rate | Hi/Lo | Combined to make 12 bit command |
| 0x4b-0x4c | LFO 2 Delay | Hi/Lo | Combined to make 12 bit command |
| 0x4d | LFO1 Control | 00xxxxxz | z=LFO1 Mode, xxxxx=Sync options |
| 0x4e | Chorus Control | 000000xx | 00=off, 01=Type 1, 10=type 2 |
| 0x4f-0x50 | VCA Level | Hi/Lo | Combined to make 12 bit command |
| 0x51-0x52 | VCA LFO Mod Amount | Hi/Lo | Combined to make 12 bit command |
| 0x53 | VCA Control | 000v0xyz | Control bits for VCA |
| 0x54-0x55 | Portamento Rate | Hi/Lo | Combined to make 12 bit command |
| 0x56 | Portamento Control | 0000000x | x = 0=Off 1=On |
| 0x57 | Load Sequence | 0000xxxx | Seq number to load (0-8) |
| 0x58 | Load Pattern | 0000xxxx | Pattern number to load (0-8) |
| 0x59 | Voice Mode | 00000xxx | Voice mode selection |
| 0x5a-0x5b | Voice Detune Amount | Hi/Lo | Combined to make 12 bit command |
| 0x5c | Detune Control | 0000000x | Detune mode |
| 0x5d | Arp Control | 00yyy0zz | Arp settings |
| 0x5e | AT Control | 00000xyz | Aftertouch control |
| 0x5f | MW Control | 00000xyz | Mod wheel control |
| 0x60 | Midi Control | 0000wxyz | MIDI control settings |
| 0x61 | Patch Clock Tempo | Complex | Clock tempo override |
| 0x63 | Arp Clock Divide | 0000yyyy | Arp clock divider |
| 0x64 | Seq Control | 000vwxyz | Sequence control bits |
| 0x65 | Seq Transpose | 0-36 | Sequence transpose |
| 0x66 | Dynamics Control | 0000yyzz | Dynamics settings |
| 0x67 | LFO2 Control | 00xxxxxz | LFO2 control similar to LFO1 |
| 0x68 | Seq Clock Divide | 0000yyyy | Seq clock divider |
| 0x69-0x7f | Not used | 0x00 | All set to 0x00 |

### 0x05 Request Patch Dump
- **Data:** Bank Number + Patch Number
- **Bank Number:** 000000xx (0=Patches 1-128, 1=129-256, 2=257-384, 3=385-512)
- **Patch Number:** 0xxxxxxx (0-127)
- **Response:** Juno-106 transmits a 0x06 command

### 0x06 Transmit/Receive Patch Dump
- **Data:** Bank + Patch + 128 data bytes (same format as 0x04 command)

### 0x07 Request Pattern Dump
- **Data:** Pattern Number (0000xxxx, x = 0-7 for pattern 1-8)
- **Response:** Juno-106 transmits a 0x08 command

### 0x08 Transmit/Receive Pattern Dump
- **Data:** Pattern Number + 29 data bytes

| Bytes | Parameter | Description |
|-------|-----------|-------------|
| 0x00-0x13 | Pattern Name | Ascii Bytes |
| 0x14 | Pattern Byte 1 | 0000wxyz (Pattern sections 16-13) |
| 0x15 | Pattern Byte 2 | 0000wxyz (Pattern sections 12-9) |
| 0x16 | Pattern Byte 3 | 0000wxyz (Pattern sections 8-5) |
| 0x17 | Pattern Byte 4 | 0000wxyz (Pattern sections 4-1) |
| 0x18-0x1b | Not Used | |
| 0x1c | Pattern Length | 0000xxxx (xxxx = 1-15 for 2-16) |

### 0x09 Request Seq Dump
- **Data:** Sequence Number (0000xxxx, x = 0-7 for Sequence 1-8)
- **Response:** Juno-106 transmits a 0x0a command

### 0x0a Transmit/Receive Seq Dump
- **Data:** Seq Number + 1800 data bytes

| Bytes | Parameter | Description |
|-------|-----------|-------------|
| 0x00-0x13 | Seq Name | 20 Ascii Bytes |
| 0x14 | Seq Length | 0xxxxxxx (x = 0=No Seq, 1-124=Steps) |
| 0x15-0x2e | Reserved | 26 bytes for future expansion |
| 0x2f-0x67b | Seq Steps | 124 x 13 bytes per step |

**Sequence Step Format (13 bytes per step):**
- Bytes 1-6: Note numbers (32-96, 0x00 if not used)
- Byte 7: Tie bits 1-6 (set if tie set)
- Bytes 8-13: Voice 1-6 Level (0-127)

### 0x0b Request Patch Name
- **Data:** No data
- **Response:** Juno-106 transmits a 0x0c command

### 0x0c Transmit/Receive Patch Name
- **Data:** 20 data bytes (Ascii patch name)
- **Note:** This only affects the edit buffer. Patch must be saved or changes will be lost.

### 0x0d Request Edit Buffer Patch Parameter
- **Data:** Parameter Number (Data Position from 0x04 format)
- **Response:** Juno-106 transmits a 0x0e command

### 0x0e Transmit/Receive Edit Buffer Patch Parameter
- **Data:** 2 data bytes
  - Byte 1: Parameter Number (Data Position)
  - Byte 2: Parameter Value (Hi) - 0x00 for non-12 bit parameters
  - Byte 3: Parameter Value (Lo)

### 0x0f Request Global Parameter
- **Data:** Global Parameter Number (Data Position from 0x02 format)
- **Response:** Juno-106 transmits a 0x10 command

### 0x10 Transmit/Receive Global Parameter
- **Data:** 2 data bytes (same format as 0x0e)

### 0x11 Request Pattern Edit Buffer Dump
- **Data:** No Data
- **Response:** Juno-106 transmits a 0x12 command

### 0x12 Transmit/Receive Edit Pattern Dump
- **Data:** Null + 29 data bytes (same format as 0x08 with 0 Pattern Number)

### 0x13 Request Sequence Edit Buffer Dump
- **Data:** No Data
- **Response:** Juno-106 transmits a 0x14 command

### 0x14 Transmit/Receive Sequence Edit Buffer Dump
- **Data:** 892 data bytes (same format as 0x0a with 0 Sequence Number)

### 0x15 Request Edit Buffer Seq Step
- **Data:** Sequence step (0xxxxxxx, x = 0-124 for step)
- **Response:** Juno-106 transmits a 0x16 command

### 0x16 Transmit/Receive Edit Buffer Seq Step
- **Data:** Seq Step + 14 data bytes
  - Sequence step number
  - Seq Length
  - 13-byte step data (same format as in 0x0a)

## LFO Sync Values

| Value | Description |
|-------|-------------|
| 00000 | Free Running |
| 00001 | Sync Two Notes (192 Clocks/Step) |
| 00010 | Sync Dotted Whole Note (144 Clocks/Step) |
| 00011 | Sync Whole Note (96 Clocks/Step) |
| 00100 | Sync Dotted Half Note (72 Clocks/Step) |
| 00101 | Sync Half Note (48 Clocks/Step) |
| 00110 | Sync Dotted 1/4 Note (36 Clocks/Step) |
| 00111 | Sync Quarter note (24 Clocks/Step) |
| 01000 | Sync Dotted 1/8 Note (18 Clocks/Step) |
| 01001 | Sync 1/4 Note Triplets (16 Clocks/Step) |
| 01010 | Sync 8th note (12 Clocks/Step) |
| 01011 | Sync 8th note triplets (8 Clocks/Step) |
| 01100 | Sync 16th note (6 Clocks/Step) |
| 01101 | Sync 16th note triplets (4 Clocks/Step) |
| 01110 | Sync 32nd note (3 Clocks/Step) |
| 01111 | Sync 32nd note triplets (2 Clocks/Step) |
| 10000 | Sync 64th note triplets (1 Clocks/Step) |

## Clock Divide Values

| Value | Description |
|-------|-------------|
| 0x01 | Half Note (48 Clocks/Step) |
| 0x02 | Quarter note (24 Clocks/Step) |
| 0x03 | 8th note (12 Clocks/Step) |
| 0x04 | 8th note, half swing (14,10 Clocks/Step) |
| 0x05 | 8th note, full swing (16,8 Clocks/Step) |
| 0x06 | 8th note triplets (8 Clocks/Step) |
| 0x07 | 16th note (6 Clocks/Step) |
| 0x08 | 16th note, half swing (7,5 Clocks/Step) |
| 0x09 | 16th note, full swing (8,4 Clocks/Step) |
| 0x10 | 16th note triplets (4 Clocks/Step) |
| 0x11 | 32nd note (3 Clocks/Step) |
| 0x12 | 32nd note triplets (2 Clocks/Step) |
| 0x13 | 64th note triplets (1 Clocks/Step) |

## Notes

- `0xnn` = Hexadecimal Data - Decimal data in brackets e.g. 0x0a (10)
- Hi & Lo bytes are combined: 000xxxxx + 0yyyyyyy = 0000xxxx xyyyyyyy
- All SysEx messages must include proper header and footer
- Device ID should match the Juno-106's configured device ID (1-16)
- When playing type 2 or 6 dumps into the 106, need 500mS delay between each sysex message