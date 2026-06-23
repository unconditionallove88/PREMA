import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession, useThemePreference } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const CONTENT = {
  en: {
    title: "Love Breath",
    sub: "Breathe in love · breathe out tension",
    inhale: "Breathe In Love",
    exhale: "Breathe Out Tension",
    affirmations: [
      "Love heals",
      "Forgiveness frees",
      "Joy rises",
      "Acceptance unites",
      "Presence holds me",
    ],
  },
  de: {
    title: "Atem der Liebe",
    sub: "Atme Liebe ein · atme Anspannung aus",
    inhale: "Atme Liebe ein",
    exhale: "Atme Anspannung aus",
    affirmations: [
      "Liebe heilt",
      "Vergebung befreit",
      "Freude steigt",
      "Akzeptanz verbindet",
      "Präsenz hält mich",
    ],
  },
};

export default function LoveBreathScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const vibe = useThemePreference();
  const accent = vibe === "dark" ? "#3DB879" : "#EC4899";

  const t = CONTENT[lang] || CONTENT.en;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const tabPad = Platform.OS === "web" ? 84 : insets.bottom + 64;

  const breath = useRef(new Animated.Value(0)).current;
  const inhaleOpacity = useRef(new Animated.Value(0)).current;
  const exhaleOpacity = useRef(new Animated.Value(0)).current;

  const [affirmIndex, setAffirmIndex] = useState(0);

  useEffect(() => {
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(breath, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    const inhaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(inhaleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(2600),
        Animated.timing(inhaleOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.delay(4000),
      ])
    );
    const exhaleLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(4000),
        Animated.timing(exhaleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(2600),
        Animated.timing(exhaleOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );

    breathLoop.start();
    inhaleLoop.start();
    exhaleLoop.start();

    const affirmTimer = setInterval(() => {
      setAffirmIndex((i) => (i + 1) % t.affirmations.length);
    }, 8000);

    return () => {
      breathLoop.stop();
      inhaleLoop.stop();
      exhaleLoop.stop();
      clearInterval(affirmTimer);
    };
  }, [breath, inhaleOpacity, exhaleOpacity, t.affirmations.length]);

  const scaleOuter = breath.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.25] });
  const scaleMid = breath.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] });
  const scaleCore = breath.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.1] });
  const glowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.title}</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
      </View>

      <View style={[styles.center, { paddingBottom: tabPad }]}>
        <View style={styles.orbWrap}>
          <Animated.View
            style={[
              styles.ring,
              styles.ringOuter,
              { backgroundColor: accent + "12", transform: [{ scale: scaleOuter }], opacity: glowOpacity },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringMid,
              { backgroundColor: accent + "20", transform: [{ scale: scaleMid }] },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringCore,
              {
                backgroundColor: colors.card,
                borderColor: accent + "55",
                shadowColor: accent,
                transform: [{ scale: scaleCore }],
              },
            ]}
          >
            <View style={[styles.coreDot, { backgroundColor: accent }]} />
          </Animated.View>
        </View>

        <View style={styles.textStage}>
          <Animated.Text style={[styles.breathText, { color: colors.foreground, opacity: inhaleOpacity }]}>
            {t.inhale}
          </Animated.Text>
          <Animated.Text
            style={[styles.breathText, styles.breathTextAbs, { color: accent, opacity: exhaleOpacity }]}
          >
            {t.exhale}
          </Animated.Text>
        </View>

        <Text style={[styles.affirmation, { color: colors.mutedForeground }]}>
          {t.affirmations[affirmIndex]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 8,
    gap: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
  },
  orbWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: { width: 260, height: 260, borderRadius: 130 },
  ringMid: { width: 180, height: 180, borderRadius: 90 },
  ringCore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  coreDot: { width: 56, height: 56, borderRadius: 28, opacity: 0.85 },
  textStage: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  breathText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  breathTextAbs: { position: "absolute" },
  affirmation: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
