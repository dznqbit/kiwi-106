import { useState } from "react";
import { Box } from "@mantine/core";
import { useRadialMove } from "@mantine/hooks";
import classes from "./Knob.module.css";

export function Knob() {
  const [value, setValue] = useState(115);
  const { ref } = useRadialMove(setValue);

  return (
    <Box
      className={classes.root}
      ref={ref}
      style={{ "--angle": `${value}deg` }}
    >
      <div className={classes.value}>{value}°</div>
      <div className={classes.thumb} />
    </Box>
  );
}
