# Kiwi-106 MIDI SysEx Reference

## SysEx Header Format

```
$f0                 Sysex Start
$00 $21 $16        Kiwitechnics Manufacturers ID
$60                Kiwitechnics ID
$03                Kiwitechnics Juno-106 ID
nn                 Device ID ($00-$0f) (Juno-106 Device ID 1-16)
xx                 Command ID (see Command Table)
[Data]             Depending on command type
$f7                Sysex Footer
```

**WARNING!** SysEx dumps have the ability to put non valid settings into memory and few checks are made for validity. If the Juno-106 becomes unusable due to non valid data you may need to do a full restore of the Juno-106 which will lose all saved memory.

## Command ID Reference

| Command | Description |
|---------|-------------|
| $01 | Request Global Dump |
| $02 | Transmit/Receive Global Dump |
| $03 | Request Patch Edit Buffer Dump |
| $04 | Transmit/Receive Patch Edit Buffer Dump |
| $05 | Request Patch Dump |
| $06 | Transmit/Receive Patch Dump |
| $07 | Request Pattern Dump |
| $08 | Transmit/Receive Pattern Dump |
| $09 | Request Seq Dump |
| $0a | Transmit/Receive Seq Dump |
| $0b | Request Patch Name |
| $0c | Transmit/Receive Patch Name |
| $0d | Request Patch Parameter |
| $0e | Transmit/Receive Patch Parameter |
| $0f | Request Global Parameter |
| $10 | Transmit/Receive Global Parameter |
| $11 | Request Pattern Edit Buffer Dump |
| $12 | Transmit/Receive Pattern Edit Buffer Dump |
| $13 | Request Sequence Edit Buffer Dump |
| $14 | Transmit/Receive Sequence Edit Buffer Dump |
| $15 | Request Seq Edit Buffer Step |
| $16 | Transmit/Receive Sequence Edit Step |

## Detailed Command Reference

### $01 Request Global Dump
- **Data:** No Data
- **Response:** Juno-106 transmits a $02 command

### $02 Transmit/Receive Global Dump
- **Data:** 48 data bytes

| Byte | Parameter | Format | Description |
|------|-----------|--------|-------------|
| $00 | Midi Channel In | 000yxxxx | xxxx = 0-15 for midi channel 1-16, y = set for Omni |
| $01 | Midi Channel Out | 0000xxxx | xxxx = 0-15 for midi channel 1-16 |
| $02 | Seq Midi Channel Out | 0000xxxx | xxxx = 0-15 for midi channel 1-16 |
| $03 | Device ID | 0000xxxx | xxxx = 0-15 for ID 1-16 |
| $04 | Enable MidiCC | 000000xx | 00=Off, 01=CC Receive Enabled (Default), 02=CC Transmit Enabled, 03=CC Receive & Transmit Enabled |
| $05 | Enable Sysex | 0000000x | x = Off/On (set=On) |
| $06 | Enable Program Change | 000000xx | 00=None, 01=PC Receive Enabled (Default), 02=PC Transmit Enabled, 03=PC Receive & Transmit Enabled |
| $07 | Midi Soft Through | 000000xx | 00=Stop all, 01=Pass all, 10=Pass only nonCC, 11=Stop only CC we have used |
| $08 | Enable Midi Clock Gen | 0000000x | x = Off/On (set=On) |
| $09 | Internal Velocity | 0xxxxxxx | x = Range $00-$7f (0-127) |
| $0a | Master Clock Source | 000000xx | 000-Internal, 001-Midi, 010-Ext Step, 011-Ext 24ppqn, 100-Ext 48ppqn |
| $0b | Not Used | 00000000 | |
| $0c-$0d | Not Used | 00000000 | |
| $0e | Pattern Level Hi | 000xxxxx | |
| $0f | Pattern Level Lo | 0yyyyyyy | Hi & Lo combined to make single 12 bit command |
| $10 | Pattern Control | 00000xyz | y=VCA Amount Destination, z=VCF Cutoff Destination, x=Clock Source |
| $11 | Int Clock Rate Hi | 0000xxxx | |
| $12 | Int Clock Rate Lo | 0000yyyy | Combined to make single 8 bit command, Range 0-255 for 5-300 BPM |
| $13 | MW Level | 0xxxxxxx | x = Range $00-$7f (0-127) |
| $14 | AT Level | 0xxxxxxx | x = Range $00-$7f (0-127) |
| $15 | Key Trans Disable | 0000000x | x = Disable Key Transpose (0=enable,1=disable) |
| $16 | Display Mode | 000000yz | z=Clock Display, y=Scrolling Display |
| $17 | Memory Protect | 0000000z | z = Memory Protect (Read only) |
| $18 | Not Used | 00000000 | |
| $19 | Internal Tune | 0xxxxxxx | x = Fine Tune Override |
| $1a | External Pedal Polarity | 0000000x | x = Ext Pedal Polarity |
| $1b-$1f | Nulls | | Not currently Used |

### $03 Request Patch Edit Buffer Dump
- **Data:** No Data

### $04 Transmit/Receive Patch Edit Buffer Dump
- **Data:** 2 x Null + 128 data bytes

| Bytes | Parameter | Format | Description |
|-------|-----------|--------|-------------|
| $00-$13 | Patch Name | Ascii Bytes | Patch Name |
| $14 | DCO Wave/Range | 0000zyxx | xx=DCO Range (00=16', 01=8', 10=4'), y=Saw On/Off, z=Pulse On/Off |
| $15-$16 | DCO Env Amount | Hi/Lo | Combined to make 12 bit command |
| $17-$18 | DCO LFO Amount | Hi/Lo | Combined to make 12 bit command |
| $19-$1a | DCO Bend Mod Amount | Hi/Lo | Combined to make 12 bit command |
| $1b-$1c | DCO Bend LFO Mod Amount | Hi/Lo | Combined to make 12 bit command |
| $1d-$1e | DCO PWM Amount | Hi/Lo | Combined to make 12 bit command |
| $1f | DCO Control | Complex | Multiple bit fields for DCO control |
| $20-$21 | Sub Level | Hi/Lo | Combined to make 12 bit command |
| $22-$23 | Noise Level | Hi/Lo | Combined to make 12 bit command |
| $24 | HPF Level | 000000xx | xx = 0-3 |
| $25-$26 | VCF Cutoff | Hi/Lo | Combined to make 12 bit command |
| $27-$28 | VCF Resonance | Hi/Lo | Combined to make 12 bit command |
| $29-$2a | VCF LFO Amount | Hi/Lo | Combined to make 12 bit command |
| $2b-$2c | VCF ENV Amount | Hi/Lo | Combined to make 12 bit command |
| $2d-$2e | VCF Key Amount | Hi/Lo | Combined to make 12 bit command |
| $2f-$30 | VCF Bend Mod Amount | Hi/Lo | Combined to make 12 bit command |
| $31 | VCF Control | 0000wxyz | Control bits for VCF |
| $32-$33 | Env 1 Attack | Hi/Lo | Combined to make 12 bit command |
| $34-$35 | Env 1 Decay | Hi/Lo | Combined to make 12 bit command |
| $36-$37 | Env 1 Sustain | Hi/Lo | Combined to make 12 bit command |
| $38-$39 | Env 1 Release | Hi/Lo | Combined to make 12 bit command |
| $3a-$3b | Env 2 Attack | Hi/Lo | Combined to make 12 bit command |
| $3c-$3d | Env 2 Decay | Hi/Lo | Combined to make 12 bit command |
| $3e-$3f | Env 2 Sustain | Hi/Lo | Combined to make 12 bit command |
| $40-$41 | Env 2 Release | Hi/Lo | Combined to make 12 bit command |
| $42 | Env Control | | Not used |
| $43 | LFO 1 Wave | 000000xxx | 000=Sine, 001=Triangle, 010=Square, 011=Saw, 100=Reverse Saw, 101=Random |
| $44-$45 | LFO 1 Rate | Hi/Lo | Combined to make 12 bit command |
| $46-$47 | LFO 1 Delay | Hi/Lo | Combined to make 12 bit command |
| $48 | LFO 2 Wave | 000000xxx | Same values as LFO 1 Wave |
| $49-$4a | LFO 2 Rate | Hi/Lo | Combined to make 12 bit command |
| $4b-$4c | LFO 2 Delay | Hi/Lo | Combined to make 12 bit command |
| $4d | LFO1 Control | 00xxxxxz | z=LFO1 Mode, xxxxx=Sync options |
| $4e | Chorus Control | 000000xx | 00=off, 01=Type 1, 10=type 2 |
| $4f-$50 | VCA Level | Hi/Lo | Combined to make 12 bit command |
| $51-$52 | VCA LFO Mod Amount | Hi/Lo | Combined to make 12 bit command |
| $53 | VCA Control | 000v0xyz | Control bits for VCA |
| $54-$55 | Portamento Rate | Hi/Lo | Combined to make 12 bit command |
| $56 | Portamento Control | 0000000x | x = 0=Off 1=On |
| $57 | Load Sequence | 0000xxxx | Seq number to load (0-8) |
| $58 | Load Pattern | 0000xxxx | Pattern number to load (0-8) |
| $59 | Voice Mode | 00000xxx | Voice mode selection |
| $5a-$5b | Voice Detune Amount | Hi/Lo | Combined to make 12 bit command |
| $5c | Detune Control | 0000000x | Detune mode |
| $5d | Arp Control | 00yyy0zz | Arp settings |
| $5e | AT Control | 00000xyz | Aftertouch control |
| $5f | MW Control | 00000xyz | Mod wheel control |
| $60 | Midi Control | 0000wxyz | MIDI control settings |
| $61 | Patch Clock Tempo | Complex | Clock tempo override |
| $63 | Arp Clock Divide | 0000yyyy | Arp clock divider |
| $64 | Seq Control | 000vwxyz | Sequence control bits |
| $65 | Seq Transpose | 0-36 | Sequence transpose |
| $66 | Dynamics Control | 0000yyzz | Dynamics settings |
| $67 | LFO2 Control | 00xxxxxz | LFO2 control similar to LFO1 |
| $68 | Seq Clock Divide | 0000yyyy | Seq clock divider |
| $69-$7f | Not used | $00 | All set to $00 |

### $05 Request Patch Dump
- **Data:** Bank Number + Patch Number
- **Bank Number:** 000000xx (0=Patches 1-128, 1=129-256, 2=257-384, 3=385-512)
- **Patch Number:** 0xxxxxxx (0-127)
- **Response:** Juno-106 transmits a $06 command

### $06 Transmit/Receive Patch Dump
- **Data:** Bank + Patch + 128 data bytes (same format as $04 command)

### $07 Request Pattern Dump
- **Data:** Pattern Number (0000xxxx, x = 0-7 for pattern 1-8)
- **Response:** Juno-106 transmits a $08 command

### $08 Transmit/Receive Pattern Dump
- **Data:** Pattern Number + 29 data bytes

| Bytes | Parameter | Description |
|-------|-----------|-------------|
| $00-$13 | Pattern Name | Ascii Bytes |
| $14 | Pattern Byte 1 | 0000wxyz (Pattern sections 16-13) |
| $15 | Pattern Byte 2 | 0000wxyz (Pattern sections 12-9) |
| $16 | Pattern Byte 3 | 0000wxyz (Pattern sections 8-5) |
| $17 | Pattern Byte 4 | 0000wxyz (Pattern sections 4-1) |
| $18-$1b | Not Used | |
| $1c | Pattern Length | 0000xxxx (xxxx = 1-15 for 2-16) |

### $09 Request Seq Dump
- **Data:** Sequence Number (0000xxxx, x = 0-7 for Sequence 1-8)
- **Response:** Juno-106 transmits a $0a command

### $0a Transmit/Receive Seq Dump
- **Data:** Seq Number + 1800 data bytes

| Bytes | Parameter | Description |
|-------|-----------|-------------|
| $00-$13 | Seq Name | 20 Ascii Bytes |
| $14 | Seq Length | 0xxxxxxx (x = 0=No Seq, 1-124=Steps) |
| $15-$2e | Reserved | 26 bytes for future expansion |
| $2f-$67b | Seq Steps | 124 x 13 bytes per step |

**Sequence Step Format (13 bytes per step):**
- Bytes 1-6: Note numbers (32-96, $00 if not used)
- Byte 7: Tie bits 1-6 (set if tie set)
- Bytes 8-13: Voice 1-6 Level (0-127)

### $0b Request Patch Name
- **Data:** No data
- **Response:** Juno-106 transmits a $0c command

### $0c Transmit/Receive Patch Name
- **Data:** 20 data bytes (Ascii patch name)
- **Note:** This only affects the edit buffer. Patch must be saved or changes will be lost.

### $0d Request Edit Buffer Patch Parameter
- **Data:** Parameter Number (Data Position from $04 format)
- **Response:** Juno-106 transmits a $0e command

### $0e Transmit/Receive Edit Buffer Patch Parameter
- **Data:** 2 data bytes
  - Byte 1: Parameter Number (Data Position)
  - Byte 2: Parameter Value (Hi) - $00 for non-12 bit parameters
  - Byte 3: Parameter Value (Lo)

### $0f Request Global Parameter
- **Data:** Global Parameter Number (Data Position from $02 format)
- **Response:** Juno-106 transmits a $10 command

### $10 Transmit/Receive Global Parameter
- **Data:** 2 data bytes (same format as $0e)

### $11 Request Pattern Edit Buffer Dump
- **Data:** No Data
- **Response:** Juno-106 transmits a $12 command

### $12 Transmit/Receive Edit Pattern Dump
- **Data:** Null + 29 data bytes (same format as $08 with 0 Pattern Number)

### $13 Request Sequence Edit Buffer Dump
- **Data:** No Data
- **Response:** Juno-106 transmits a $14 command

### $14 Transmit/Receive Sequence Edit Buffer Dump
- **Data:** 892 data bytes (same format as $0a with 0 Sequence Number)

### $15 Request Edit Buffer Seq Step
- **Data:** Sequence step (0xxxxxxx, x = 0-124 for step)
- **Response:** Juno-106 transmits a $16 command

### $16 Transmit/Receive Edit Buffer Seq Step
- **Data:** Seq Step + 14 data bytes
  - Sequence step number
  - Seq Length
  - 13-byte step data (same format as in $0a)

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
| $01 | Half Note (48 Clocks/Step) |
| $02 | Quarter note (24 Clocks/Step) |
| $03 | 8th note (12 Clocks/Step) |
| $04 | 8th note, half swing (14,10 Clocks/Step) |
| $05 | 8th note, full swing (16,8 Clocks/Step) |
| $06 | 8th note triplets (8 Clocks/Step) |
| $07 | 16th note (6 Clocks/Step) |
| $08 | 16th note, half swing (7,5 Clocks/Step) |
| $09 | 16th note, full swing (8,4 Clocks/Step) |
| $10 | 16th note triplets (4 Clocks/Step) |
| $11 | 32nd note (3 Clocks/Step) |
| $12 | 32nd note triplets (2 Clocks/Step) |
| $13 | 64th note triplets (1 Clocks/Step) |

## Notes

- `$nn` = Hexadecimal Data - Decimal data in brackets e.g. $0a (10)
- Hi & Lo bytes are combined: 000xxxxx + 0yyyyyyy = 0000xxxx xyyyyyyy
- All SysEx messages must include proper header and footer
- Device ID should match the Juno-106's configured device ID (1-16)
- When playing type 2 or 6 dumps into the 106, need 500mS delay between each sysex message