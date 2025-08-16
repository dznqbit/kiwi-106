import { Button, createTheme } from "@mantine/core";
import buttonStyles from './theme/Button.module.css';

// Button blue: #78b9d9
// Button orange: #ffbb53
// Button beige: #e6e2c6;
// Label red: #de2245

export const mantineTheme = createTheme({
  fontFamily: "Helvetica, Arial, sans-serif;",

  components: {
    Button: Button.extend({ classNames: buttonStyles })
  }
});
