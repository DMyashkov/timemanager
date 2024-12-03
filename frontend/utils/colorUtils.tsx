export function blendColors(
  color1: string,
  color2: string,
  ratio: number,
): string {
  const hexToRgb = (hex: string) => {
    const bigint = Number.parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const blendedRgb = {
    r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
    g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
    b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio),
  };

  return rgbToHex(blendedRgb.r, blendedRgb.g, blendedRgb.b);
}

export function hexWithOpacity(hex: string, opacity: number): string {
  if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex)) {
    throw new Error("Invalid hex color format. Use #RGB or #RRGGBB.");
  }

  // Ensure the hex is in 6-character format
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // Convert opacity (0.0 - 1.0) to a 2-digit hex value
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  return `${hex}${alpha}`;
}
