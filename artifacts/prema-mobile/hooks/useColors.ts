import colors from "@/constants/colors";
import { useThemePreference } from "@/context/SessionContext";

/**
 * Returns the design tokens for the active vibe-mode.
 *
 * The vibe is chosen by the user on the landing page (red rose = "dark",
 * white rose = "bright") and persisted via SessionContext. When used
 * outside of a SessionProvider, `useThemePreference` falls back to the
 * bright palette so the hook never throws.
 */
export function useColors() {
  const vibe = useThemePreference();
  const palette = vibe === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
