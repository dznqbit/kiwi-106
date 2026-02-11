interface CheckBrowserResult {
  browserName: string;
  webMidiCapable: boolean;
}

const detectBrowserName = (ua: string): string => {
  const edge = ua.match(/Edg\/(\d+)/);
  if (edge) return `Edge ${edge[1]}`;

  const opera = ua.match(/OPR\/(\d+)/);
  if (opera) return `Opera ${opera[1]}`;

  const chrome = ua.match(/Chrome\/(\d+)/);
  if (chrome) return `Chrome ${chrome[1]}`;

  const firefox = ua.match(/Firefox\/(\d+)/);
  if (firefox) return `Firefox ${firefox[1]}`;

  const safari = ua.match(/Version\/(\d+).*Safari/);
  if (safari) return `Safari ${safari[1]}`;

  return "Unknown";
};

export const checkBrowser = (): CheckBrowserResult => {
  const browserName = detectBrowserName(navigator.userAgent);
  if (typeof navigator.requestMIDIAccess === "function") {
    return {
      browserName,
      webMidiCapable: true,
    };
  } else {
    return {
      browserName,
      webMidiCapable: false,
    };
  }
};
