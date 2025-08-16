export const formatHex = (num: number) => {
  return `0x${num.toString(16).toUpperCase().padStart(2, "0")}`;
};
