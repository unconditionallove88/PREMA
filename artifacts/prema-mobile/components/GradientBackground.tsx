import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

/**
 * Full-screen radial-like gradient that mirrors the web version's
 * primary glow at the top of every screen.
 *
 * Place as the first child inside any screen's root View / ScrollView,
 * with absolute positioning so it sits behind all content.
 */
export function GradientBackground() {
  const colors = useColors();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top-left primary glow — mirrors web radial-gradient at 20% 10% */}
      <LinearGradient
        colors={[colors.primary + "28", colors.primary + "00"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 0.45 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
