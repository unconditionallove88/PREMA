import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmOverlay } from "@/components/AlarmOverlay";
import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const PHASES = [
  {
    en: "Breathe In",
    de: "Einatmen",
    duration: 4000,
    color: "#10B981",
    scale: 1.35,
  },
  {
    en: "Hold",
    de: "Halten",
    duration: 4000,
    color: "#F59E0B",
    scale: 1.35,
  },
  {
    en: "Breathe Out",
    de: "Ausatmen",
    duration: 6000,
    color: "#A78BFA",
    scale: 1.0,
  },
  {
    en: "Rest",
    de: "Ruhen",
    duration: 2000,
    color: "#38BDF8",
    scale: 1.0,
  },
];

const CONTENT = {
  en: {
    label: "BREATHING",
    title: "Breathe",
    sub: "Box breathing — 4 · 4 · 6 · 2 rhythm",
    start: "Begin breathing",
    pause: "Pause",
    resume: "Resume",
    cycles: "cycles",
    cyclesDone: "completed",
    tip: "Focus on the rhythm. Each full cycle takes about 16 seconds.",
  },
  de: {
    label: "ATEMÜBUNG",
    title: "Atmen",
    sub: "Box-Breathing — 4 · 4 · 6 · 2 Rhythmus",
    start: "Atemübung beginnen",
    pause: "Pause",
    resume: "Fortfahren",
    cycles: "Zyklen",
    cyclesDone: "abgeschlossen",
    tip: "Konzentriere dich auf den Rhythmus. Jeder Zyklus dauert ca. 16 Sekunden.",
  },
};

export default function BreatheScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, careAlarms } = useSession();
  const t = CONTENT[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [running, setRunning] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [alarmVisible, setAlarmVisible] = useState(false);
  const alarmFired = useRef(false);
  const lastBreakTs = useRef<number>(Date.now());

  const circleScale = useRef(new Animated.Value(1)).current;
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef = useRef(0);
  const cyclesRef = useRef(0);

  const currentPhase = PHASES[phaseIdx];

  const runPhase = (idx: number) => {
    phaseRef.current = idx;
    const phase = PHASES[idx];

    Animated.timing(circleScale, {
      toValue: phase.scale,
      duration: phase.duration * 0.85,
      useNativeDriver: true,
    }).start();

    phaseTimer.current = setTimeout(() => {
      const next = (idx + 1) % PHASES.length;
      if (next === 0) {
        cyclesRef.current += 1;
        setCycles(cyclesRef.current);
      }
      setPhaseIdx(next);
      runPhase(next);
    }, phase.duration);
  };

  const start = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRunning(true);
    setPhaseIdx(0);
    lastBreakTs.current = Date.now();
    alarmFired.current = false;
    runPhase(0);
  };

  const pause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRunning(false);
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
    Animated.timing(circleScale, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  useEffect(() => {
    return () => {
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
    };
  }, []);

  // Alarm interval check
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastBreakTs.current) / 60000);
      if (elapsed >= careAlarms.breathingBreak && !alarmFired.current) {
        alarmFired.current = true;
        if (running) pause();
        setAlarmVisible(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [careAlarms.breathingBreak, running]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: topPad + 24,
          paddingBottom: botPad + 110,
          paddingHorizontal: 20,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{t.label}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{t.title}</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>{t.sub}</Text>

        {/* Breathing circle */}
        <View style={styles.circleWrap}>
          <Animated.View
            style={[
              styles.circleOuter,
              {
                transform: [{ scale: circleScale }],
                backgroundColor: (running ? currentPhase.color : colors.primary) + "15",
                borderColor: (running ? currentPhase.color : colors.primary) + "40",
              },
            ]}
          />
          <View
            style={[
              styles.circleInner,
              {
                backgroundColor: colors.card,
                borderColor: (running ? currentPhase.color : colors.primary) + "30",
              },
            ]}
          >
            {running ? (
              <>
                <Text style={[styles.phaseLabel, { color: running ? currentPhase.color : colors.primary }]}>
                  {lang === "de" ? currentPhase.de : currentPhase.en}
                </Text>
              </>
            ) : (
              <Feather name="wind" size={32} color={colors.primary} />
            )}
          </View>
        </View>

        {/* Cycle count */}
        {cycles > 0 && (
          <Text style={[styles.cyclesText, { color: colors.mutedForeground }]}>
            {cycles} {t.cyclesDone}
          </Text>
        )}

        {/* Control button */}
        <Pressable
          onPress={running ? pause : start}
          style={({ pressed }) => [
            styles.controlBtn,
            {
              backgroundColor: running ? colors.card : colors.primary,
              borderColor: running ? colors.border : colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather
            name={running ? "pause" : "play"}
            size={20}
            color={running ? colors.foreground : colors.primaryForeground}
          />
          <Text
            style={[
              styles.controlBtnText,
              { color: running ? colors.foreground : colors.primaryForeground },
            ]}
          >
            {running ? t.pause : cycles > 0 ? t.resume : t.start}
          </Text>
        </Pressable>

        {/* Tip */}
        <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.tipText, { color: colors.mutedForeground }]}>{t.tip}</Text>
        </View>

        {/* Phase guide */}
        <View style={styles.phaseGuide}>
          {PHASES.map((p, i) => (
            <View key={i} style={styles.phaseGuideItem}>
              <View
                style={[
                  styles.phaseGuideDot,
                  {
                    backgroundColor:
                      running && i === phaseIdx ? p.color : colors.border,
                  },
                ]}
              />
              <Text style={[styles.phaseGuideLabel, { color: colors.mutedForeground }]}>
                {(lang === "de" ? p.de : p.en)}
              </Text>
              <Text style={[styles.phaseGuideDuration, { color: colors.border }]}>
                {p.duration / 1000}s
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <AlarmOverlay
        visible={alarmVisible}
        type="breathe"
        lang={lang}
        onDone={() => {
          setAlarmVisible(false);
          alarmFired.current = false;
          lastBreakTs.current = Date.now();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  sub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 36,
    alignSelf: "flex-start",
  },
  circleWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  circleOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  circleInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseLabel: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  cyclesText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    marginBottom: 20,
  },
  controlBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    paddingHorizontal: 32,
    marginBottom: 24,
    width: "100%",
  },
  controlBtnText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    width: "100%",
    marginBottom: 20,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  phaseGuide: {
    width: "100%",
    gap: 10,
  },
  phaseGuideItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  phaseGuideDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  phaseGuideLabel: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  phaseGuideDuration: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
});
