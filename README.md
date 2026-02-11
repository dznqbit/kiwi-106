# kiwi-106
Web-based programmer for the [Kiwi106](https://kiwitechnics.com/kiwi-106.htm). 

So many of the Kiwi's most powerful features are hidden behind arcane sysex commands. This web app allows us to access these features, and more easily program the Kiwi106.

## Installation
```
npm install
```

## Running locally
```
npm run dev
```

## Project Dependencies
This entire project hinges on the [Web MIDI API spec](https://www.w3.org/TR/webmidi/) and these packages

- [webmidi](https://webmidijs.org)
- [React](https://react.dev)
- [Mantine](https://mantine.dev)

### Browser Compatibility
According to [caniuse.com](https://caniuse.com/?search=webmidi)

| Browser | WebMidi | Tested |
|-|-|-|
| Firefox | ✅ | ✅ |
| Chrome | ✅ | ❌ | 
| Opera | ✅ | ❌ | 
| Edge | ✅ | ❌ | 
| Safari | ❌ | ❌ |
| Internet Explorer | ❌ | ❌ |

### Fonts
- [Retro Computer](https://www.dafont.com/retro-computer.font)
- [Librestile](https://github.com/ocelothe/Librestile)

## How to Contribute
If you notice a bug, or want a feature implemented, you have three options.
- File an issue via [Github Issues](https://github.com/dznqbit/kiwi-106/issues).
- Open a pull request. We have basic branch protection in place and I think I'm the only one who can YOLO merge, so please, I would love help completing this editor.
- Fork the project, fix it yourself, and carry on. I would prefer to keep this project up to date, but maybe I get hit by a bus tomorrow. Go nuts.
