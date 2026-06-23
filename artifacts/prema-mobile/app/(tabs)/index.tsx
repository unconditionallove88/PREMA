import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { GradientBackground } from "@/components/GradientBackground";
import { useThemePreference } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

/**
 * Circle of Love — a calm heartbeat that pulses from the inside, spreads a wave
 * of light across the whole screen, and flashes the vibe colour on every beat
 * (pink in bright mode, green in dark mode). No BPM, anchor or affirmations.
 */
function HeartbeatCircle() {
  const vibe = useThemePreference();
  const flashColor = vibe === "dark" ? "#3DB879" : "#EC4899";
  const { width, height } = useWindowDimensions();
  const screenMax = Math.max(width, height);

  const core = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Calm heartbeat: a soft "lub", a stronger "dub" with a full-screen flash,
    // then a resting pause (~60 bpm).
    const beat = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(core, { toValue: 1.1, duration: 130, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.7, duration: 130, useNativeDriver: true }),
        ]),
        Animated.timing(core, { toValue: 1, duration: 130, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(core, { toValue: 1.2, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(flash, { toValue: 0.16, duration: 150, useNativeDriver: true }),
            Animated.timing(flash, { toValue: 0, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(core, { toValue: 1, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.35, duration: 220, useNativeDriver: true }),
        ]),
        Animated.delay(820),
      ])
    );

    // Light spreading outward to fill the whole screen.
    const wave = Animated.loop(
      Animated.timing(ripple, {
        toValue: 1,
        duration: 2600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );

    beat.start();
    wave.start();
    return () => {
      beat.stop();
      wave.stop();
    };
  }, [core, flash, ripple, glow]);

  const rippleScale = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, (screenMax / 150) * 2.4],
  });
  const rippleOpacity = ripple.interpolate({
    inputRange: [0, 0.12, 1],
    outputRange: [0, 0.4, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: flashColor, opacity: flash }]}
      />
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.wave,
            { borderColor: flashColor, transform: [{ scale: rippleScale }], opacity: rippleOpacity },
          ]}
        />
        <Animated.View
          style={[
            styles.aura,
            { backgroundColor: flashColor + "22", opacity: glow, transform: [{ scale: core }] },
          ]}
        />
        <Animated.View
          style={[
            styles.core,
            { backgroundColor: flashColor + "33", borderColor: flashColor, shadowColor: flashColor, transform: [{ scale: core }] },
          ]}
        >
          <Animated.View
            style={[styles.coreInner, { backgroundColor: flashColor, opacity: glow }]}
          />
        </Animated.View>
      </View>
    </View>
  );
}

export default function CircleOfLoveScreen() {
  const colors = useColors();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <HeartbeatCircle />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  wave: { position: "absolute", width: 150, height: 150, borderRadius: 75, borderWidth: 2 },
  aura: { position: "absolute", width: 250, height: 250, borderRadius: 125 },
  core: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  coreInner: { width: 92, height: 92, borderRadius: 46 },
});
