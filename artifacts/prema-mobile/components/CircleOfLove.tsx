import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

import { useColors } from "@/hooks/useColors";

/**
 * The "Circle of Love" — the app's central tool.
 *
 * A heart-less, gently pulsating aura: two expanding ripple rings around a
 * softly breathing core filled with a subtle tint (defaults to the theme's
 * green). Used on the landing and welcome screens.
 */
export function CircleOfLove({ size = 230, color }: { size?: number; color?: string }) {
  const colors = useColors();
  const tint = color ?? colors.primary;

  const core = useRef(new Animated.Value(0)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(core, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(core, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ]),
    );
    const mkRipple = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 3000, useNativeDriver: true }),
        ]),
      );
    breathe.start();
    const r1 = mkRipple(ripple1, 0);
    const r2 = mkRipple(ripple2, 1500);
    r1.start();
    r2.start();
    return () => {
      breathe.stop();
      r1.stop();
      r2.stop();
    };
  }, []);

  const coreScale = core.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.07] });
  const coreOpacity = core.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0.9] });

  const rippleTransform = (v: Animated.Value) => ({
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1.5] }) }],
    opacity: v.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.4, 0] }),
  });

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: tint + "55" },
          rippleTransform(ripple1),
        ]}
      />
      <Animated.View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2, borderColor: tint + "55" },
          rippleTransform(ripple2),
        ]}
      />
      <Animated.View
        style={[
          styles.fill,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: size * 0.4,
            backgroundColor: tint + "1F",
            transform: [{ scale: coreScale }],
            opacity: coreOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.fill,
          {
            width: size * 0.52,
            height: size * 0.52,
            borderRadius: size * 0.26,
            backgroundColor: tint + "33",
            transform: [{ scale: coreScale }],
          },
        ]}
      />
      <View
        style={[
          styles.fill,
          {
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: size * 0.15,
            backgroundColor: tint + "4D",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: "absolute", borderWidth: 1.5 },
  fill: { position: "absolute" },
});
