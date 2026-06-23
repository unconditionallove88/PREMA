import { Text as RNText, StyleSheet, type TextProps } from "react-native";

/**
 * App-wide Text. Defaults to Nunito and forces lowercase rendering everywhere
 * (user preference: no uppercase wording anywhere). The default font goes first
 * so per-instance weights still win; the lowercase transform goes last so it
 * always wins. TextInput is intentionally not wrapped so typed input keeps its
 * original casing.
 */
const styles = StyleSheet.create({
  base: { fontFamily: "Nunito_400Regular" },
  lowercase: { textTransform: "lowercase" },
});

export function Text({ style, ...props }: TextProps) {
  return <RNText {...props} style={[styles.base, style, styles.lowercase]} />;
}
