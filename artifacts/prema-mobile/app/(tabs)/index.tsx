import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { CircleOfLove } from "@/components/CircleOfLove";
import { useTabBarVisibility } from "@/context/TabBarVisibility";

// A deep midnight / charcoal field so the rose-gold aura perforates the dark.
const SACRED_BG = "#070A14";
const SACRED_BG_EDGE = "#04050B";

/**
 * Circle of Love — the dashboard centrepiece: a living aura field that breathes,
 * glows and shimmers as a "mirror of the soul".
 *
 * Total immersion: three seconds after landing, the bottom tab bar slowly fades
 * and slides away, leaving the user alone with their radiant circle. Touching
 * anywhere gently reveals the UI again; after five seconds of stillness it
 * dissolves once more. Re-focusing resets the cycle.
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: SACRED_BG },
});
