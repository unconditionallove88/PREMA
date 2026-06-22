/**
 * Prema mobile color tokens — mirrored from the web version's CSS custom properties.
 *
 * Dark  → web dark-mode values (blue-dark background, warm cream text)
 * Light → web light-mode values (warm off-white background, deep foreground)
 * Primary follows the same emerald green used on web in each scheme.
 */
const colors = {
  dark: {
    text: "#F0EAD6",
    tint: "#3DB879",
    background: "#0C0F1D",
    foreground: "#F0EAD6",
    card: "#141827",
    cardForeground: "#F0EAD6",
    primary: "#3DB879",
    primaryForeground: "#FFFFFF",
    secondary: "#1C2238",
    secondaryForeground: "#F0EAD6",
    muted: "#1C2238",
    mutedForeground: "#969BAC",
    accent: "#3DB879",
    accentForeground: "#FFFFFF",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#25304A",
    input: "#25304A",
  },
  light: {
    text: "#0A0D1C",
    tint: "#2D7750",
    background: "#F4ECDE",
    foreground: "#0A0D1C",
    card: "#F8EFE3",
    cardForeground: "#0A0D1C",
    primary: "#2D7750",
    primaryForeground: "#FFFFFF",
    secondary: "#EAD9C4",
    secondaryForeground: "#0A0D1C",
    muted: "#EAD9C4",
    mutedForeground: "#38415A",
    accent: "#2D7750",
    accentForeground: "#FFFFFF",
    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",
    border: "#D5C3A8",
    input: "#D5C3A8",
  },
  radius: 16,
};

export default colors;
