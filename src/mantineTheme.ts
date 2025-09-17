import {
  Button,
  createTheme,
  defaultVariantColorsResolver,
  Modal,
  parseThemeColor,
} from "@mantine/core";
import buttonStyles from "./theme/Button.module.css";

// Base Red: #de2245
const red = [
  "#faf1f4",
  "#f5e3e8",
  "#f0d5dc",
  "#ebc7d0",
  "#e6b9c4",
  "#df3355",
  "#de2245",
  "#c41e3e",
  "#aa1a37",
  "#901630",
] as const;

// Base Blue: #78b9d9
const blue = [
  "#f5fafc",
  "#ebf5f9",
  "#e1f0f6",
  "#d7ebf3",
  "#cde6f0",
  "#c3e1ed",
  "#78b9d9",
  "#6ba7c8",
  "#5e95b7",
  "#5183a6",
] as const;

// Base Orange: #ffbb53
const orange = [
  "#fffbf7",
  "#fff7ef",
  "#fff3e7",
  "#ffefdf",
  "#ffebd7",
  "#ffc960",
  "#ffbb53",
  "#e6a74b",
  "#cc9343",
  "#b37f3b",
] as const;

// Base Beige: #e6e2c6;
const beige = [
  "#fbfaf7",
  "#f7f5f0",
  "#f3f0e9",
  "#efebe2",
  "#ebe6db",
  "#e7e1d4",
  "#e6e2c6",
  "#d0ccb2",
  "#bab69e",
  "#a4a08a",
] as const;

export const mantineTheme = createTheme({
  colors: {
    red,
    blue,
    orange,
    beige,
  },

  fontFamily: "Helvetica, Arial, sans-serif;",

  headings: {
    fontFamily: "Helvetica, Arial, sans-serif;",

    sizes: {
      h1: {
        fontSize: "4rem",
      },

      h2: {
        fontSize: "1.625rem",
      },

      h5: {
        fontSize: "0.875rem",
      },

      h6: {
        fontSize: "0.6rem",
      },
    },
  },

  components: {
    Button: Button.extend({
      classNames: buttonStyles,
      vars: (_theme, props) => {
        if (props.variant !== "juno") {
          return { root: {} };
        }

        // We're going to pin Juno button height but leave width variable for different cases:
        // no content, icons, words, etc.
        const junoButtonMeasurements = (size: number) => {
          return {
            root: {
              "--button-height": `36px`,
              "--button-padding-x": `${0.31 * size}px`,
            },
          };
        };
        switch (props.size) {
          case "sm":
            return junoButtonMeasurements(24);

          case "md":
            return junoButtonMeasurements(36);

          case "lg":
            return junoButtonMeasurements(80);

          default:
            return junoButtonMeasurements(36);
        }
      },
    }),

    Modal: Modal.extend({
      styles: {
        close: {
           marginTop: -5,
        },
        title: {
          fontWeight: "bold",
          fontSize: "1.625rem",
          lineHeight: 0.8,
        }
      }
    })
  },

  variantColorResolver: (input) => {
    const defaultResolvedColors = defaultVariantColorsResolver(input);
    const parsedColor = parseThemeColor({
      color: input.color || input.theme.primaryColor,
      theme: input.theme,
    });

    if (input.variant === "juno") {
      // Mantine acting weird when we have variant X color
      const colors = {
        red,
        blue,
        orange,
        beige,
      };

      const colorName: string = parsedColor.color;
      if (Object.keys(colors).includes(colorName)) {
        // @ts-expect-error Sorry being lazy about indexing into the record
        const spectrum = colors[colorName];
        if (!spectrum) {
          return defaultResolvedColors;
        }

        const colorIndex = spectrum.indexOf(parsedColor.value);
        const background = spectrum[colorIndex];
        const hoverColor = spectrum[colorIndex - 1];

        return {
          background,
          hover: hoverColor,
          color: "black",
          border: "none",
        };
      }
    }

    return defaultResolvedColors;
  },
});
