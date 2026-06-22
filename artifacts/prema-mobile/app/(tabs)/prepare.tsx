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

const CONTENT = {
  en: {
    label: "HYDRATION",
    title: "Water",
    sub: "Stay steadily fuelled throughout your experience",
    glassesToday: "glasses today",
    logBtn: "I drank a glass",
    lastDrink: "Last drink",
    nextReminder: "Next reminder",
    minutesAgo: "m ago",
    justNow: "just now",
    minutesLeft: "m",
    tips: [
      "Sip water steadily — not all at once",
      "Aim for one glass every 30–45 min",
      "Watch for signs of thirst — act early",
    ],
    goal: "daily goal",
  },
  de: {
    label: "HYDRATION",
    title: "Wasser",
    sub: "Bleib gleichmäßig hydriert während deiner Erfahrung",
    glassesToday: "Gläser heute",
    logBtn: "Ich habe ein Glas getrunken",
    lastDrink: "Letzter Schluck",
    nextReminder: "Nächste Erinnerung",
    minutesAgo: "min her",
    justNow: "gerade eben",
    minutesLeft: "min",
    tips: [
      "Trinke gleichmäßig — nicht alles auf einmal",
      "Ziel: ein Glas alle 30–45 Minuten",
      "Achte früh auf Durstgefühl",
    ],
    goal: "Tagesziel",
  },
};

const GOAL = 8;

export default function WaterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, careAlarms } = useSession();
  const t = CONTENT[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [glassCount, setGlassCount] = useState(0);
  const [lastDrinkTs, setLastDrinkTs] = useState<number | null>(null);
  const [minutesSince, setMinutesSince] = useState(0);
  const [minutesUntil, setMinutesUntil] = useState(careAlarms.hydrationSync);
  const [alarmVisible, setAlarmVisible] = useState(false);
  const alarmFired = useRef(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastDrinkTs) {
        const elapsed = Math.floor((Date.now() - lastDrinkTs) / 60000);
        setMinutesSince(elapsed);
        const remaining = careAlarms.hydrationSync - elapsed;
        setMinutesUntil(Math.max(0, remaining));
        if (elapsed >= careAlarms.hydrationSync && !alarmFired.current) {
          alarmFired.current = true;
          setAlarmVisible(true);
        }
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [lastDrinkTs, careAlarms.hydrationSync]);

  const logGlass = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setGlassCount((p) => p + 1);
    setLastDrinkTs(Date.now());
    setMinutesSince(0);
    setMinutesUntil(careAlarms.hydrationSync);
    alarmFired.current = false;

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const progressPct = Math.min(1, glassCount / GOAL);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: topPad + 24, paddingBottom: botPad + 110, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{t.label}</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>{t.title}</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>{t.sub}</Text>

        {/* Big glass button */}
        <View style={styles.centreSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPress={logGlass}
              style={[styles.glassBtn, { backgroundColor: colors.card, borderColor: "#38BDF850" }]}
            >
              <View style={[styles.glassGlow, { backgroundColor: "#38BDF815" }]} />
              <Feather name="droplet" size={52} color="#38BDF8" />
            </Pressable>
          </Animated.View>

          <Text style={[styles.glassCount, { color: colors.foreground }]}>
            {glassCount}
          </Text>
          <Text style={[styles.glassLabel, { color: colors.mutedForeground }]}>
            {t.glassesToday}
          </Text>

          {/* Progress bar */}
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPct * 100}%` as any, backgroundColor: "#38BDF8" },
              ]}
            />
          </View>
          <Text style={[styles.goalText, { color: colors.mutedForeground }]}>
            {glassCount} / {GOAL} {t.goal}
          </Text>
        </View>

        {/* Log button */}
        <Pressable
          onPress={logGlass}
          style={({ pressed }) => [
            styles.logBtn,
            { backgroundColor: "#38BDF8", opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="droplet" size={18} color="#fff" />
          <Text style={styles.logBtnText}>{t.logBtn}</Text>
        </Pressable>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="clock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t.lastDrink}</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {lastDrinkTs
                ? minutesSince === 0
                  ? t.justNow
                  : `${minutesSince}${t.minutesAgo}`
                : "—"}
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="bell" size={14} color={colors.mutedForeground} />
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t.nextReminder}</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {lastDrinkTs ? `${minutesUntil}${t.minutesLeft}` : `${careAlarms.hydrationSync}${t.minutesLeft}`}
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {t.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipDot, { backgroundColor: "#38BDF8" }]} />
              <Text style={[styles.tipText, { color: colors.mutedForeground }]}>{tip}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <AlarmOverlay
        visible={alarmVisible}
        type="water"
        lang={lang}
        onDone={() => {
          setAlarmVisible(false);
          alarmFired.current = false;
          setLastDrinkTs(Date.now());
          setMinutesSince(0);
          setMinutesUntil(careAlarms.hydrationSync);
          setGlassCount((p) => p + 1);
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
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  sub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    marginBottom: 32,
  },
  centreSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  glassBtn: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#38BDF8",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  glassGlow: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  glassCount: {
    fontSize: 64,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    marginTop: 20,
    lineHeight: 72,
  },
  glassLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    marginBottom: 16,
  },
  progressBar: {
    width: "70%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  goalText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
  },
  logBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: 29,
    marginBottom: 20,
  },
  logBtnText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  tipsCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
});
