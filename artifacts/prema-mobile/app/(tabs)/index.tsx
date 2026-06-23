import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { CircleOfLove } from "@/components/CircleOfLove";
import { useTabBarVisibility } from "@/context/TabBarVisibility";
import { useThemePreference } from "@/context/SessionContext";

/**
 * Circle of Love — the dashboard centrepiece: a living aura field that breathes,
 * glows and shimmers as a "mirror of the soul".
 *
 * Adaptive "Light-Void" background:
 * - DARK: a "Deep Cosmic Void" — a near-black navy/charcoal gradient that adds
 *   depth so the screen never looks flat, with a subtle rose/gold auric glow
 *   making the circle feel like it illuminates the room.
 * - LIGHT: a "Pure Spiritual Void" — soft paper-grey, with a delicate pastel
 *   pink/lavender prism glow for a weightless, morning-light sanctuary.
 *
 * Total immersion: three seconds after landing, the bottom tab bar slowly fades
 * and slides away, leaving the user alone with their radiant circle. Touching
 * anywhere gently reveals the UI again; after five seconds of stillness it
 * dissolves once more. Re-focusing resets the cycle.
 */

const VOID = {
  dark: { top: "#080810", bottom: "#030305" },
  light: { top: "#FCFBFE", bottom: "#F4F3F8" },
};

export default function CircleOfLoveScreen() {
  const tabBar = useTabBarVisibility();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { width, height } = useWindowDimensions();
  const vibe = useThemePreference();
  const isDark = vibe === "dark";
  const v = isDark ? VOID.dark : VOID.light;
  const GLOW = Math.max(width, height) * 1.3;

  // A slow auric breath for the ambient glow — tied to the circle's own pulse.
  const glow = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [glow]);
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? [0.7, 1] : [0.6, 0.92],
  });
  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.06] });

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
    <Pressable style={[styles.root, { backgroundColor: v.bottom }]} onPressIn={reveal}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={[v.top, v.bottom]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Dynamic auric glow — the circle's colours bleed into the void */}
      <Animated.View
        pointerEvents="none"
        style={[styles.glowWrap, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
      >
        <Svg width={GLOW} height={GLOW}>
          <Defs>
            <RadialGradient id="ambient" cx="50%" cy="50%" r="50%">
              {isDark
                ? [
                    <Stop key="0" offset="0%" stopColor="#F7C8DA" stopOpacity="0.16" />,
                    <Stop key="1" offset="30%" stopColor="#F6D58A" stopOpacity="0.1" />,
                    <Stop key="2" offset="60%" stopColor="#C9A7F0" stopOpacity="0.05" />,
                    <Stop key="3" offset="100%" stopColor="#C9A7F0" stopOpacity="0" />,
                  ]
                : [
                    <Stop key="0" offset="0%" stopColor="#F7B8D6" stopOpacity="0.12" />,
                    <Stop key="1" offset="34%" stopColor="#D9C2F2" stopOpacity="0.08" />,
                    <Stop key="2" offset="64%" stopColor="#C9A7F0" stopOpacity="0.04" />,
                    <Stop key="3" offset="100%" stopColor="#C9A7F0" stopOpacity="0" />,
                  ]}
            </RadialGradient>
          </Defs>
          <Circle cx={GLOW / 2} cy={GLOW / 2} r={GLOW / 2} fill="url(#ambient)" />
        </Svg>
      </Animated.View>

      <CircleOfLove />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glowWrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
});
