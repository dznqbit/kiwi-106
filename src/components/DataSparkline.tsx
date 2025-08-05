interface DataSparklineParams {
  data: number[];
}

export const DataSparkline = ({ data }: DataSparklineParams) => {
  const bytesPerRow = 64;
  const cellSize = 10;

  const width = bytesPerRow * cellSize;
  const height = Math.ceil(data.length / bytesPerRow) * cellSize;

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const x = (i % bytesPerRow) * cellSize;
        const y = Math.floor(i / bytesPerRow) * cellSize;

        return (
          <rect
            key={`sparkline-${i}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={`#${mapColor(d)}`}
          />
        );
      })}
    </svg>
  );
};

function mapColor(byte: number) {
  // Convert byte to HSL (hue, saturation, lightness)
  const hue = Math.floor((byte / 255) * 360); // 0-360 degrees around color wheel
  const saturation = 100; // Full saturation
  const lightness = 50; // Medium lightness

  // Convert HSL to RGB
  const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lightness / 100 - c / 2;

  let r, g, b;
  if (hue < 60) {
    [r, g, b] = [c, x, 0];
  } else if (hue < 120) {
    [r, g, b] = [x, c, 0];
  } else if (hue < 180) {
    [r, g, b] = [0, c, x];
  } else if (hue < 240) {
    [r, g, b] = [0, x, c];
  } else if (hue < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert RGB to hex
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}
