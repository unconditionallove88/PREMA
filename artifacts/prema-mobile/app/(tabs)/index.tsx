import React from "react";
import { View } from "react-native";

import { CircleOfLove } from "@/components/CircleOfLove";
import { GradientBackground } from "@/components/GradientBackground";
import { useColors } from "@/hooks/useColors";

/**
 * Circle of Love — the dashboard centrepiece: a living aura field that breathes,
 * glows and shimmers as a visualisation of the user's energy and connection.
 */
export default function CircleOfLoveScreen() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <CircleOfLove />
    </View>
  );
}
