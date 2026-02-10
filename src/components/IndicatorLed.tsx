import { forwardRef } from "react";
import { Box, Flex } from "@mantine/core";
import classes from "./IndicatorLed.module.css";

type IndicatorLedStatus = "init" | "enabled" | "error" | "selected" | "warning";

interface IndicatorLedProps {
  size?: "sm" | "md" | "lg";
  status?: IndicatorLedStatus;
}

export const IndicatorLed = forwardRef<HTMLDivElement, IndicatorLedProps>(
  ({ size = "md", status }, ref) => {
    const ledSize = {
      sm: 6,
      md: 8,
      lg: 10,
    }[size];

    const classNames: string = [
      classes.indicator,
      status ? classes[`--${status}`] : "",
    ].join(" ");

    return (
      <Flex
        ref={ref}
        className={classNames}
        style={{
          margin: "8px 0 4px 0",
          width: ledSize,
          height: ledSize,
          borderRadius: "50%",
          transition: "all 0.15s ease",
        }}
      >
        <Box className={classes.twinkle} />
      </Flex>
    );
  },
);
