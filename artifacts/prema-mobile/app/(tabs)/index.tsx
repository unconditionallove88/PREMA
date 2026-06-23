import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

import { CircleOfLove } from "@/components/CircleOfLove";
import { Text } from "@/components/Text";
import { useTabBarVisibility } from "@/context/TabBarVisibility";

// A deep midnight / charcoal field so the rose-gold aura perforates the dark.
const SACRED_BG = "#070A14";
const SACRED_BG_EDGE = "#04050B";
const LABEL = "rgba(240, 234, 214, 0.55)";
const VALUE = "rgba(255, 255, 255, 0.92)";

/**
 * Circle of Love — the dashboard centrepiece: a living aura field that breathes,
 * glows and shimmers as a "mirror of the soul".
 *
 * Total immersion: three seconds after landing, the bottom tab bar (and the copy
 * below the circle) slowly fade and slide away, leaving the user alone with their
 * radiant circle. Touching anywhere gently reveals the UI again; after five
 * seconds of stillness it dissolves once more. Re-focusing resets the cycle.
 */
export default function CircleOfLoveScreen() {
  const tabBar = useTabBarVisibility();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(
    (delay: number) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => tabBar?.hide(), delay);
    },
    [tabBar],
  );

  // Any touch brings the UI back, then restarts the 5s stillness countdown.
  const reveal = useCallback(() => {
    tabBar?.show();
    scheduleHide(5000);
  }, [tabBar, scheduleHide]);

  useFocusEffect(
    useCallback(() => {
      tabBar?.show();
      scheduleHide(3000);
      return () => {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        tabBar?.show();
      };
    }, [tabBar, scheduleHide]),
  );

  // Copy + immersion fade in lockstep with the tab bar (1 = visible, 0 = hidden).
  const uiOpacity = tabBar
    ? tabBar.translate.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })
    : 1;

  return (
    <Pressable style={styles.root} onPressIn={reveal}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={[SACRED_BG, SACRED_BG_EDGE]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <CircleOfLove />

      {/* Sacred copy — present only while the UI breathes into view */}
      <Animated.View style={[styles.caption, { opacity: uiOpacity }]} pointerEvents="none">
        <Text style={styles.label}>state of being</Text>
        <Text style={styles.value}>at peace</Text>
        <View style={styles.spacer} />
        <Text style={styles.label}>vibration</Text>
        <Text style={styles.value}>love & joy</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SACRED_BG },
  caption: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 132,
    alignItems: "center",
  },
  label: {
    fontFamily: "Nunito_300Light",
    fontSize: 11,
    letterSpacing: 2,
    color: LABEL,
  },
  value: {
    fontFamily: "Nunito_300Light",
    fontSize: 18,
    letterSpacing: 2,
    color: VALUE,
    marginTop: 4,
    textShadowColor: "rgba(255, 235, 245, 0.35)",
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  spacer: { height: 22 },
});
