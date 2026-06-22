import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
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

const TIPS = [
  {
    en: { title: "Prioritise restful sleep", body: "The night before sets the foundation for your whole experience." },
    de: { title: "Erholsamen Schlaf priorisieren", body: "Die Nacht zuvor legt das Fundament für deine Erfahrung." },
  },
  {
    en: { title: "A 20-minute nap helps", body: "If short on sleep, a brief nap restores clarity and calm." },
    de: { title: "Ein 20-Minuten-Nickerchen hilft", body: "Bei wenig Schlaf stellt ein kurzes Nickerchen Klarheit wieder her." },
  },
  {
    en: { title: "Find stillness", body: "Even 5 minutes of quiet stillness helps your nervous system regulate." },
    de: { title: "Stille finden", body: "Schon 5 Minuten ruhige Stille helfen deinem Nervensystem." },
  },
  {
    en: { title: "Body scan", body: "Close your eyes. Notice tension. Breathe into the tight spots." },
    de: { title: "Körperscan", body: "Schließe die Augen. Bemerke Spannungen. Atme in die engen Stellen." },
  },
];

const NAP_DURATION = 20 * 60;

const CONTENT = {
  en: {
    label: "REST",
    title: "Rest",
    sub: "Stillness is not lost time — it is preparation",
    napTitle: "20-min nap timer",
    napStart: "Start nap timer",
    napPause: "Pause",
    napResume: "Resume",
    napReset: "Reset",
    napDone: "Rest complete",
    tipsTitle: "Rest guidance",
  },
  de: {
    label: "RUHE",
    title: "Ruhe",
    sub: "Stille ist keine verlorene Zeit — sie ist Vorbereitung",
    napTitle: "20-Min Nickerchen-Timer",
    napStart: "Timer starten",
    napPause: "Pause",
    napResume: "Fortfahren",
    napReset: "Zurücksetzen",
    napDone: "Ruhe abgeschlossen",
    tipsTitle: "Ruhe-Guidance",
  },
};

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function RestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, careAlarms } = useSession();
  const t = CONTENT[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [napRunning, setNapRunning] = useState(false);
  const [napSecs, setNapSecs] = useState(NAP_DURATION);
  const [napDone, setNapDone] = useState(false);
  const [alarmVisible, setAlarmVisible] = useState(false);
  const alarmFired = useRef(false);
  const lastRestTs = useRef<number>(Date.now());
  const napInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startNap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNapRunning(true);
    setNapDone(false);
    napInterval.current = setInterval(() => {
      setNapSecs((s) => {
        if (s <= 1) {
          clearInterval(napInterval.current!);
          setNapRunning(false);
          setNapDone(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const pauseNap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNapRunning(false);
    if (napInterval.current) clearInterval(napInterval.current);
  };

  const resetNap = () => {
    Haptics.selectionAsync();
    setNapRunning(false);
    setNapDone(false);
    setNapSecs(NAP_DURATION);
    if (napInterval.current) clearInterval(napInterval.current);
  };

  useEffect(() => {
    return () => { if (napInterval.current) clearInterval(napInterval.current); };
  }, []);

  // Rest alarm interval check
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastRestTs.current) / 60000);
      if (elapsed >= careAlarms.breathingBreak && !alarmFired.current) {
        alarmFired.current = true;
        setAlarmVisible(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [careAlarms.breathingBreak]);

  const napPct = 1 - napSecs / NAP_DURATION;

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

        {/* Nap timer */}
        <View style={[styles.napCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.napTitle, { color: colors.foreground }]}>{t.napTitle}</Text>

          <View style={styles.timerWrap}>
            <View style={[styles.timerRing, { borderColor: colors.border }]}>
              <View
                style={[
                  styles.timerFill,
                  { borderColor: "#A78BFA", width: `${napPct * 100}%` as any },
                ]}
              />
              <View style={styles.timerCenter}>
                <Text style={[styles.timerText, { color: napDone ? "#A78BFA" : colors.foreground }]}>
                  {napDone ? t.napDone : formatTime(napSecs)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.napBtns}>
            {!napRunning && !napDone && (
              <Pressable
                onPress={startNap}
                style={({ pressed }) => [
                  styles.napBtn,
                  { backgroundColor: "#A78BFA", opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather name="moon" size={16} color="#fff" />
                <Text style={styles.napBtnText}>{napSecs === NAP_DURATION ? t.napStart : t.napResume}</Text>
              </Pressable>
            )}
            {napRunning && (
              <Pressable
                onPress={pauseNap}
                style={({ pressed }) => [
                  styles.napBtn,
                  { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1.5, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Feather name="pause" size={16} color={colors.foreground} />
                <Text style={[styles.napBtnText, { color: colors.foreground }]}>{t.napPause}</Text>
              </Pressable>
            )}
            {(napDone || napSecs < NAP_DURATION) && (
              <Pressable onPress={resetNap} style={styles.resetBtn}>
                <Feather name="refresh-cw" size={13} color={colors.mutedForeground} />
                <Text style={[styles.resetBtnText, { color: colors.mutedForeground }]}>{t.napReset}</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Tips */}
        <Text style={[styles.tipsTitle, { color: colors.foreground }]}>{t.tipsTitle}</Text>
        <View style={styles.tipsList}>
          {TIPS.map((tip, i) => {
            const c = lang === "de" ? tip.de : tip.en;
            return (
              <View key={i} style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.tipDot, { backgroundColor: "#A78BFA" }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tipTitle, { color: colors.foreground }]}>{c.title}</Text>
                  <Text style={[styles.tipBody, { color: colors.mutedForeground }]}>{c.body}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <AlarmOverlay
        visible={alarmVisible}
        type="rest"
        lang={lang}
        onDone={() => {
          setAlarmVisible(false);
          alarmFired.current = false;
          lastRestTs.current = Date.now();
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
    marginBottom: 28,
  },
  napCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    marginBottom: 28,
    gap: 20,
  },
  napTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  timerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  timerFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    backgroundColor: "#A78BFA20",
  },
  timerCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  napBtns: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  napBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
  },
  napBtnText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resetBtnText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  tipsTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  tipsList: {
    gap: 10,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  tipTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  tipBody: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
