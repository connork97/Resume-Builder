const parseRgba = (rgbaString) => {
  if (!rgbaString || typeof rgbaString !== "string") {
    return null;
  }

  const matches = rgbaString.match(/[\d.]+/g);

  if (!matches || matches.length < 3) {
    return null;
  }

  const [r, g, b, a = 1] = matches.map(Number);

  return { r, g, b, a };
};

export const getContrastingColor = (
  rgbaString = "rgba(255, 255, 255, 1)",
  lightColor = "white",
  darkColor = "black"
) => {
  const rgba = parseRgba(rgbaString);

  if (!rgba) {
    return darkColor;
  }

  const { r, g, b, a } = rgba;

  if (a < 0.5) {
    return darkColor;
  }

  const brightness = r * 0.299 + g * 0.587 + b * 0.114;

  return brightness < 128 ? lightColor : darkColor;
};