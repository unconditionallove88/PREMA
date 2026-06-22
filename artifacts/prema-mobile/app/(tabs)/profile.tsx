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

const CHECKLIST = [
  { en: "Tell someone I'm heading home", de: "Jemandem sagen, dass ich nach Hause gehe" },
  { en: "Have a charged phone", de: "Handy ist aufgeladen" },
  { en: "Know my route home", de: "Meinen Heimweg kennen" },
  { en: "Stay with a trusted person", de: "Bei einer vertrauenswürdigen Person bleiben" },
  { en: "Have water for the journey", de: "Wasser für den Weg haben" },
];

const CONTENT = {
  en: {
    label: "DEPARTURE",
    title: "Depart",
    sub: "Plan your journey home with intention",
    countdownTitle: "Time until departure",
    countdownSub: "Based on your alarm setting",
    hoursLeft: "h left",
    minutesLeft: "m",
    headingHome: "I'm heading home",
    headingHomeDone: "Journey started — travel well",
    checklistTitle: "Before you leave",
    hours: "h",
    mins: "m",
    noAlarm: "No departure time set",
    noAlarmSub: "Set one in onboarding or next time",
  },
  de: {
    label: "ABFAHRT",
    title: "Abfahrt",
    sub: "Plane deine Heimreise mit Bewusstsein",
    countdownTitle: "Zeit bis zur Abfahrt",
    countdownSub: "Basierend auf deiner Alarm-Einstellung",
    hoursLeft: "h übrig",
    minutesLeft: "m",
    headingHome: "Ich gehe jetzt nach Hause",
    headingHomeDone: "Reise begonnen — komm gut an",
    checklistTitle: "Bevor du gehst",
    hours: "h",
    mins: "m",
    noAlarm: "Keine Abfahrtzeit gesetzt",
    noAlarmSub: "Beim nächsten Mal im Onboarding setzen",
  },
};

export default function DepartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, careAlarms } = useSession();
  const t = CONTENT[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [startTs] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [headingHome, setHeadingHome] = useState(false);
  const [alarmVisible, setAlarmVisible] = useState(false);
  const alarmFired = useRef(false);

  const departureMs = careAlarms.departureHour * 60 * 60 * 1000;
  const hasAlarm = careAlarms.departureHour > 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const el = Date.now() - startTs;
      setElapsed(el);
      if (hasAlarm && el >= departureMs && !alarmFired.current) {
        alarmFired.current = true;
        setAlarmVisible(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [startTs, departureMs, hasAlarm]);

  const remaining = Math.max(0, departureMs - elapsed);
  const remainingHrs = Math.floor(remaining / 3600000);
  const remainingMins = Math.floor((remaining % 3600000) / 60000);

  const pct = hasAlarm ? Math.min(1, elapsed / departureMs) : 0;

  const toggleItem = (i: number) => {
    Haptics.selectionAsync();
    setCheckedItems((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const handleHeadingHome = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setHeadingHome(true);
  };

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

        {/* Countdown card */}
        <View style={[styles.countdownCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.countdownHeader}>
            <Feather name="navigation" size={16} color="#F59E0B" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.countdownTitle, { color: colors.foreground }]}>{t.countdownTitle}</Text>
              <Text style={[styles.countdownSub, { color: colors.mutedForeground }]}>{t.countdownSub}</Text>
            </View>
          </View>

          {hasAlarm ? (
            <>
              <View style={styles.countdownDisplay}>
                <Text style={[styles.countdownValue, { color: remaining > 0 ? colors.foreground : "#F59E0B" }]}>
                  {remaining > 0
                    ? `${remainingHrs}${t.hours} ${remainingMins}${t.mins}`
                    : "Now"}
                </Text>
              </View>

              {/* Progress bar */}
              <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${pct * 100}%` as any, backgroundColor: "#F59E0B" },
                  ]}
                />
              </View>
            </>
          ) : (
            <View style={styles.noAlarmWrap}>
              <Text style={[styles.noAlarmText, { color: colors.foreground }]}>{t.noAlarm}</Text>
              <Text style={[styles.noAlarmSub, { color: colors.mutedForeground }]}>{t.noAlarmSub}</Text>
            </View>
          )}
        </View>

        {/* Heading home button */}
        {!headingHome ? (
          <Pressable
            onPress={handleHeadingHome}
            style={({ pressed }) => [
              styles.homeBtn,
              { backgroundColor: "#F59E0B", opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="navigation" size={20} color="#fff" />
            <Text style={styles.homeBtnText}>{t.headingHome}</Text>
          </Pressable>
        ) : (
          <View style={[styles.homeDone, { backgroundColor: "#F59E0B20", borderColor: "#F59E0B40" }]}>
            <Feather name="check-circle" size={20} color="#F59E0B" />
            <Text style={[styles.homeDoneText, { color: "#F59E0B" }]}>{t.headingHomeDone}</Text>
          </View>
        )}

        {/* Checklist */}
        <Text style={[styles.checklistTitle, { color: colors.foreground }]}>{t.checklistTitle}</Text>
        <View style={styles.checklistItems}>
          {CHECKLIST.map((item, i) => (
            <Pressable
              key={i}
              onPress={() => toggleItem(i)}
              style={[
                styles.checklistItem,
                {
                  backgroundColor: checkedItems[i] ? "#F59E0B10" : colors.card,
                  borderColor: checkedItems[i] ? "#F59E0B50" : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.checkBox,
                  {
                    backgroundColor: checkedItems[i] ? "#F59E0B" : "transparent",
                    borderColor: checkedItems[i] ? "#F59E0B" : colors.border,
                  },
                ]}
              >
                {checkedItems[i] && <Feather name="check" size={11} color="#fff" />}
              </View>
              <Text style={[styles.checkItemText, { color: colors.foreground }]}>
                {lang === "de" ? item.de : item.en}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <AlarmOverlay
        visible={alarmVisible}
        type="depart"
        lang={lang}
        onDone={() => {
          setAlarmVisible(false);
          alarmFired.current = false;
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
    marginBottom: 24,
  },
  countdownCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    gap: 16,
  },
  countdownHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  countdownTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  countdownSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  countdownDisplay: {
    alignItems: "center",
    paddingVertical: 8,
  },
  countdownValue: {
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  noAlarmWrap: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  noAlarmText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  noAlarmSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 64,
    borderRadius: 32,
    marginBottom: 28,
  },
  homeBtnText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  homeDone: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    marginBottom: 28,
  },
  homeDoneText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  checklistTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
    marginBottom: 12,
  },
  checklistItems: {
    gap: 10,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkItemText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    lineHeight: 18,
  },
});
