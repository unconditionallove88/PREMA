import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";

import { Text } from "@/components/Text";
import { useSession } from "@/context/SessionContext";

/**
 * Breath of Love — a premium guided coherent-breathing experience.
 *
 * A full-screen, minimal meditation: three healing colour environments
 * (soft blue → pale green → soft rose pink) cross-fade continuously behind a
 * luminous pink-blue breathing orb. The orb expands on a 5s inhale and
 * contracts on a 5s exhale (6 breaths / minute), surrounded by a gentle
 * heart-coherence field. All motion is transform/opacity based (native
 * driver) for 60fps.
 */

const HOLD = 16000; // each colour stays ~16s
const TRANS = 5000; // crossfade ~5s
const INHALE = 5000;
const EXHALE = 5000;

// Soft, luminous healing gradients (light pastels — never neon).
const BLUE = ["#d7e8ff", "#a9c8f2", "#c4dbf7"] as const;
const GREEN = ["#d6efdb", "#aed5b8", "#dcefe0"] as const;
const PINK = ["#ffdcea", "#f7bcd6", "#ffe4ef"] as const;

const TEXT_PRIMARY = "#473C5C";
const TEXT_SOFT = "rgba(71, 60, 92, 0.72)";
const TEXT_FAINT = "rgba(71, 60, 92, 0.55)";

type ParticleCfg = {
  left: number;
  top: number;
  size: number;
  drift: number;
  duration: number;
  delay: number;
};

function Particle({ cfg }: { cfg: ParticleCfg }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(cfg.delay),
        Animated.timing(t, {
          toValue: 1,
          duration: cfg.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: cfg.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, cfg.delay, cfg.duration]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [cfg.drift, -cfg.drift] });
  const opacity = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.12, 0.5, 0.18] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: cfg.left,
        top: cfg.top,
        width: cfg.size,
        height: cfg.size,
        borderRadius: cfg.size / 2,
        backgroundColor: "#FFFFFF",
        shadowColor: "#FFFFFF",
        shadowOpacity: 0.8,
        shadowRadius: cfg.size,
        shadowOffset: { width: 0, height: 0 },
        opacity,
        transform: [{ translateY }],
      }}
    />
  );
}

const CONTENT = {
  en: {
    title: "breath of love",
    coherent: "coherent (resonant) breathing",
    inhale: "inhale",
    exhale: "exhale",
    inhaleSub: "breathe in love",
    exhaleSub: "release and soften",
    guide: [
      "synchronize your heart, mind, and breath",
      "breathe gently through your nose",
      "inhale for 5 seconds · exhale for 5 seconds",
      "maintain a smooth, effortless rhythm",
    ],
  },
  de: {
    title: "atem der liebe",
    coherent: "kohärente (resonante) atmung",
    inhale: "einatmen",
    exhale: "ausatmen",
    inhaleSub: "atme liebe ein",
    exhaleSub: "loslassen und weich werden",
    guide: [
      "synchronisiere herz, geist und atem",
      "atme sanft durch die nase",
      "5 sekunden einatmen · 5 sekunden ausatmen",
      "halte einen sanften, mühelosen rhythmus",
    ],
  },
};

export default function BreathOfLoveScreen() {
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const t = CONTENT[lang] || CONTENT.en;
  const { width, height } = useWindowDimensions();

  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const tabPad = Platform.OS === "web" ? 96 : insets.bottom + 72;

  const ORB = Math.min(width * 0.46, 196);
  const GLOW = ORB * 2.3;
  const ringInner = ORB * 1.5;
  const ringOuter = ORB * 2.0;

  // Background crossfade values (blue is the always-on base layer).
  const green = useRef(new Animated.Value(0)).current;
  const pink = useRef(new Animated.Value(0)).current;

  // Breathing + phase-text values.
  const breath = useRef(new Animated.Value(0)).current;
  const inhaleOpacity = useRef(new Animated.Value(1)).current;
  const exhaleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ease = Easing.inOut(Easing.quad);

    const greenLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(HOLD), // blue showing
        Animated.timing(green, { toValue: 1, duration: TRANS, easing: ease, useNativeDriver: true }),
        Animated.delay(HOLD), // green showing
        Animated.delay(TRANS), // pink fades in over green
        Animated.delay(HOLD), // pink showing
        Animated.timing(green, { toValue: 0, duration: TRANS, easing: ease, useNativeDriver: true }),
      ]),
    );
    const pinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(HOLD),
        Animated.delay(TRANS),
        Animated.delay(HOLD),
        Animated.timing(pink, { toValue: 1, duration: TRANS, easing: ease, useNativeDriver: true }),
        Animated.delay(HOLD),
        Animated.timing(pink, { toValue: 0, duration: TRANS, easing: ease, useNativeDriver: true }),
      ]),
    );

    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: INHALE,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: EXHALE,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const inhaleTextLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(inhaleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(INHALE - 1300),
        Animated.timing(inhaleOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.delay(EXHALE),
      ]),
    );
    const exhaleTextLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(INHALE),
        Animated.timing(exhaleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(EXHALE - 1300),
        Animated.timing(exhaleOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    );

    greenLoop.start();
    pinkLoop.start();
    breathLoop.start();
    inhaleTextLoop.start();
    exhaleTextLoop.start();
    return () => {
      greenLoop.stop();
      pinkLoop.stop();
      breathLoop.stop();
      inhaleTextLoop.stop();
      exhaleTextLoop.stop();
    };
  }, [green, pink, breath, inhaleOpacity, exhaleOpacity]);

  const orbScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.12] });
  const glowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] });
  const ringInnerScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.78, 1.18] });
  const ringOuterScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.32] });
  const ringInnerOpacity = breath.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.12, 0.4, 0.12] });
  const ringOuterOpacity = breath.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.05, 0.24, 0.05] });

  const particles = useMemo<ParticleCfg[]>(() => {
    return Array.from({ length: 10 }, () => ({
      left: Math.random() * width,
      top: Math.random() * height,
      size: 2 + Math.random() * 4,
      drift: 8 + Math.random() * 14,
      duration: 2600 + Math.random() * 2600,
      delay: Math.random() * 2400,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  return (
    <View style={styles.root}>
      {/* Healing colour environments (blue base, green + pink crossfade above) */}
      <LinearGradient colors={BLUE} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: green }]}>
        <LinearGradient colors={GREEN} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: pink }]}>
        <LinearGradient colors={PINK} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Subtle floating light particles */}
      {particles.map((cfg, i) => (
        <Particle key={i} cfg={cfg} />
      ))}

      <View style={[styles.content, { paddingTop: topPad + 12, paddingBottom: tabPad }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.coherent}>{t.coherent}</Text>
        </View>

        {/* Breathing orb + heart-coherence field */}
        <View style={styles.stage}>
          <View style={{ width: GLOW, height: GLOW, alignItems: "center", justifyContent: "center" }}>
            {/* outer ambient bloom */}
            <Animated.View style={[styles.center, { opacity: glowOpacity }]}>
              <Svg width={GLOW} height={GLOW}>
                <Defs>
                  <RadialGradient id="bloom" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%" stopColor="#FFC6E0" stopOpacity="0.5" />
                    <Stop offset="45%" stopColor="#B9C4F5" stopOpacity="0.22" />
                    <Stop offset="100%" stopColor="#B9C4F5" stopOpacity="0" />
                  </RadialGradient>
                </Defs>
                <Circle cx={GLOW / 2} cy={GLOW / 2} r={GLOW / 2} fill="url(#bloom)" />
              </Svg>
            </Animated.View>

            {/* heart-coherence rings */}
            <Animated.View
              style={[
                styles.center,
                styles.ring,
                {
                  width: ringOuter,
                  height: ringOuter,
                  borderRadius: ringOuter / 2,
                  opacity: ringOuterOpacity,
                  transform: [{ scale: ringOuterScale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.center,
                styles.ring,
                {
                  width: ringInner,
                  height: ringInner,
                  borderRadius: ringInner / 2,
                  opacity: ringInnerOpacity,
                  transform: [{ scale: ringInnerScale }],
                },
              ]}
            />

            {/* luminous breathing orb */}
            <Animated.View style={[styles.center, { transform: [{ scale: orbScale }] }]}>
              <Svg width={ORB} height={ORB}>
                <Defs>
                  <RadialGradient id="orb" cx="50%" cy="38%" r="65%">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                    <Stop offset="28%" stopColor="#FFD2E6" stopOpacity="0.96" />
                    <Stop offset="64%" stopColor="#E0A6E8" />
                    <Stop offset="100%" stopColor="#8FB6F0" />
                  </RadialGradient>
                </Defs>
                <Circle cx={ORB / 2} cy={ORB / 2} r={ORB / 2} fill="url(#orb)" />
              </Svg>
            </Animated.View>
          </View>
        </View>

        {/* Breathing phase cue */}
        <View style={styles.phase}>
          <View style={styles.phaseStage}>
            <Animated.Text style={[styles.phaseWord, { opacity: inhaleOpacity }]}>
              {t.inhale}
            </Animated.Text>
            <Animated.Text style={[styles.phaseWord, styles.phaseAbs, { opacity: exhaleOpacity }]}>
              {t.exhale}
            </Animated.Text>
          </View>
          <View style={styles.phaseSubStage}>
            <Animated.Text style={[styles.phaseSub, { opacity: inhaleOpacity }]}>
              {t.inhaleSub}
            </Animated.Text>
            <Animated.Text style={[styles.phaseSub, styles.phaseAbs, { opacity: exhaleOpacity }]}>
              {t.exhaleSub}
            </Animated.Text>
          </View>
        </View>

        {/* Guidance text */}
        <View style={styles.guide}>
          {t.guide.map((line, i) => (
            <Text key={i} style={styles.guideLine}>
              {line}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#c4dbf7" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
  },
  header: { alignItems: "center", gap: 6 },
  title: {
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
    letterSpacing: 1,
    color: TEXT_PRIMARY,
  },
  coherent: {
    fontFamily: "Nunito_500Medium",
    fontSize: 12,
    letterSpacing: 1.5,
    color: TEXT_SOFT,
  },
  stage: { flex: 1, alignItems: "center", justifyContent: "center" },
  center: { position: "absolute", alignItems: "center", justifyContent: "center" },
  ring: {
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  phase: { alignItems: "center", gap: 6 },
  phaseStage: { height: 42, alignItems: "center", justifyContent: "center" },
  phaseSubStage: { height: 22, alignItems: "center", justifyContent: "center" },
  phaseWord: {
    fontFamily: "Nunito_700Bold",
    fontSize: 30,
    letterSpacing: 4,
    color: TEXT_PRIMARY,
    textTransform: "lowercase",
    textShadowColor: "rgba(255,255,255,0.6)",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 1 },
  },
  phaseAbs: { position: "absolute" },
  phaseSub: {
    fontFamily: "Nunito_500Medium",
    fontSize: 14,
    letterSpacing: 1,
    color: TEXT_SOFT,
    textTransform: "lowercase",
  },
  guide: { alignItems: "center", gap: 7 },
  guideLine: {
    fontFamily: "Nunito_500Medium",
    fontSize: 12.5,
    letterSpacing: 0.6,
    lineHeight: 18,
    textAlign: "center",
    color: TEXT_FAINT,
  },
});
