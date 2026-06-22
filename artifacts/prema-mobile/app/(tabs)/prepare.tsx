import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const INTENTIONS = [
  { key: "present", en: "Be Here Now", de: "Im Hier Sein" },
  { key: "acceptance", en: "Self-Acceptance", de: "Selbst-Akzeptanz" },
  { key: "honesty", en: "Honesty", de: "Ehrlichkeit" },
  { key: "respect", en: "Respect", de: "Respekt" },
  { key: "gratitude", en: "Gratitude", de: "Dankbarkeit" },
];

const ESSENTIALS = [
  { key: "phone", icon: "smartphone" as const, tint: "#10B981", en: { title: "Phone (100% Charged)", body: "Your lifeline to your Circle of Love" }, de: { title: "Handy (100% geladen)", body: "Deine Verbindung zu deinem Kreis der Liebe" } },
  { key: "straws", icon: "minus" as const, tint: "#3B82F6", en: { title: "Single-Use Straws", body: "Prevents cross-contamination — never share" }, de: { title: "Einweg-Trinkhalme", body: "Verhindert Kreuzkontamination — niemals teilen" } },
  { key: "zinc", icon: "activity" as const, tint: "#F59E0B", en: { title: "Zinc (15–30 mg)", body: "Supports immune & neurotransmitter balance" }, de: { title: "Zink (15–30 mg)", body: "Unterstützt Immunsystem & Neurotransmitter-Balance" } },
  { key: "magnesium", icon: "heart" as const, tint: "#EC4899", en: { title: "Magnesium (200–400 mg)", body: "Reduces muscle tension, supports heart rhythm" }, de: { title: "Magnesium (200–400 mg)", body: "Reduziert Muskelspannung, unterstützt Herzrhythmus" } },
  { key: "electrolytes", icon: "droplet" as const, tint: "#38BDF8", en: { title: "Electrolytes", body: "Maintains hydration and mineral balance" }, de: { title: "Elektrolyte", body: "Hält Hydratation und Mineralstoffbalance aufrecht" } },
  { key: "wipes", icon: "wind" as const, tint: "#A78BFA", en: { title: "Disinfecting Wipes", body: "Clean surfaces before use" }, de: { title: "Desinfektionstücher", body: "Oberflächen vor Gebrauch reinigen" } },
  { key: "plates", icon: "credit-card" as const, tint: "#34D399", en: { title: "Credit-Card Plates (×2)", body: "Use dedicated clean surfaces, never banknotes" }, de: { title: "Kreditkarten-Platten (×2)", body: "Saubere Oberflächen verwenden, niemals Geldscheine" } },
  { key: "condoms", icon: "shield" as const, tint: "#F472B6", en: { title: "Condoms & Lubricant", body: "Protection and comfort during intimacy" }, de: { title: "Kondome & Gleitmittel", body: "Schutz und Komfort bei Intimität" } },
];

type AlarmKey = "intakeLimit" | "departureHour" | "breathingBreak" | "hydrationSync";

export default function IntentionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, intention, setIntention, careAlarms, setCareAlarms } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [essentialsDone, setEssentialsDone] = useState<Record<string, boolean>>({});

  const toggleEssential = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEssentialsDone((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const doneCount = Object.values(essentialsDone).filter(Boolean).length;

  const adjustAlarm = (key: AlarmKey, delta: number, min: number, max: number) => {
    Haptics.selectionAsync();
    setCareAlarms((prev) => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, (prev[key] as number) + delta)),
    }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPad + 24, paddingBottom: botPad + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
      {/* ── PREMA — SET YOUR INTENTION ── */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        {lang === "de" ? "PHASE 1 · INTENTION" : "PHASE 1 · INTENTION"}
      </Text>
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>
        {lang === "de" ? "Prema" : "Prema"}
      </Text>
      <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
        {lang === "de"
          ? "Setze einen bewussten Anker für diese Nacht"
          : "Set a conscious anchor for tonight"}
      </Text>

      <View style={styles.intentionGrid}>
        {INTENTIONS.map((item) => {
          const active = intention === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIntention(active ? null : item.key);
              }}
              style={({ pressed }) => [
                styles.intentionBtn,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              {active && (
                <Feather name="check" size={12} color={colors.primaryForeground} />
              )}
              <Text
                style={[
                  styles.intentionText,
                  { color: active ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {lang === "de" ? item.de : item.en}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {intention && (
        <View style={[styles.intentionConfirm, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <Feather name="anchor" size={14} color={colors.primary} />
          <Text style={[styles.intentionConfirmText, { color: colors.primary }]}>
            {lang === "de" ? "Deine Absicht" : "Your intention"}{" "}
            <Text style={{ fontFamily: "Inter_700Bold" }}>
              {INTENTIONS.find((i) => i.key === intention)?.[lang === "de" ? "de" : "en"]}
            </Text>{" "}
            {lang === "de" ? "ist gesetzt." : "is set."}
          </Text>
        </View>
      )}

      {/* ── ESSENTIALS KIT ── */}
      <View style={styles.divider} />
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {lang === "de" ? "ESSENTIALS KIT" : "ESSENTIALS KIT"}
          </Text>
          <Text style={[styles.screenTitle, { color: colors.foreground }]}>
            {lang === "de" ? "Dein Pack" : "Your Pack"}
          </Text>
        </View>
        <View style={[styles.progressPill, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
          <Text style={[styles.progressText, { color: colors.primary }]}>
            {doneCount}/{ESSENTIALS.length}
          </Text>
        </View>
      </View>

      <View style={styles.essentialsList}>
        {ESSENTIALS.map((item) => {
          const done = essentialsDone[item.key];
          const label = lang === "de" ? item.de : item.en;
          return (
            <Pressable
              key={item.key}
              onPress={() => toggleEssential(item.key)}
              style={({ pressed }) => [
                styles.essentialCard,
                {
                  backgroundColor: done ? item.tint + "10" : colors.card,
                  borderColor: done ? item.tint + "40" : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.essentialIcon, { backgroundColor: item.tint + "20" }]}>
                <Feather
                  name={done ? "check" : item.icon}
                  size={16}
                  color={done ? item.tint : colors.mutedForeground}
                />
              </View>
              <View style={styles.essentialContent}>
                <Text style={[styles.essentialTitle, { color: done ? item.tint : colors.foreground }]}>
                  {label.title}
                </Text>
                <Text style={[styles.essentialBody, { color: colors.mutedForeground }]}>
                  {label.body}
                </Text>
              </View>
              <View style={[styles.checkbox, { backgroundColor: done ? item.tint : "transparent", borderColor: done ? item.tint : colors.border }]}>
                {done && <Feather name="check" size={11} color="#fff" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ── NURTURE ALARMS ── */}
      <View style={styles.divider} />
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        {lang === "de" ? "FÜRSORGE-ALARME" : "NURTURE ALARMS"}
      </Text>
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>
        {lang === "de" ? "Deine Einstellungen" : "Your Settings"}
      </Text>
      <Text style={[styles.screenSub, { color: colors.mutedForeground, marginBottom: 20 }]}>
        {lang === "de"
          ? "Konfiguriere Benachrichtigungen für die Nacht"
          : "Configure care notifications for the night"}
      </Text>

      <View style={styles.alarmsList}>
        {[
          {
            key: "intakeLimit" as AlarmKey,
            icon: "layers" as const,
            tint: "#F59E0B",
            en: { label: "INTAKE LIMIT", unit: "units", min: 1, max: 20, step: 1 },
            de: { label: "EINNAHME-LIMIT", unit: "Einheiten", min: 1, max: 20, step: 1 },
          },
          {
            key: "departureHour" as AlarmKey,
            icon: "clock" as const,
            tint: "#10B981",
            en: { label: "TARGET DEPARTURE", unit: ":00", min: 0, max: 23, step: 1 },
            de: { label: "ZIEL-ABFAHRTSZEIT", unit: ":00", min: 0, max: 23, step: 1 },
          },
          {
            key: "breathingBreak" as AlarmKey,
            icon: "wind" as const,
            tint: "#38BDF8",
            en: { label: "BREATHING BREAKS", unit: "min", min: 15, max: 120, step: 15 },
            de: { label: "ATEMÜBUNGEN", unit: "min", min: 15, max: 120, step: 15 },
          },
          {
            key: "hydrationSync" as AlarmKey,
            icon: "droplet" as const,
            tint: "#A78BFA",
            en: { label: "HYDRATION SYNC", unit: "min", min: 15, max: 90, step: 15 },
            de: { label: "HYDRATIONS-SYNC", unit: "min", min: 15, max: 90, step: 15 },
          },
        ].map((alarm) => {
          const lbl = lang === "de" ? alarm.de : alarm.en;
          const val = careAlarms[alarm.key] as number;
          return (
            <View
              key={alarm.key}
              style={[styles.alarmCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.alarmIcon, { backgroundColor: alarm.tint + "18" }]}>
                <Feather name={alarm.icon} size={16} color={alarm.tint} />
              </View>
              <View style={styles.alarmContent}>
                <Text style={[styles.alarmLabel, { color: colors.mutedForeground }]}>
                  {lbl.label}
                </Text>
                <Text style={[styles.alarmValue, { color: colors.foreground }]}>
                  {alarm.key === "departureHour"
                    ? `${String(val).padStart(2, "0")}:00`
                    : `${val} ${lbl.unit}`}
                </Text>
              </View>
              <View style={styles.alarmControls}>
                <Pressable
                  onPress={() => adjustAlarm(alarm.key, -lbl.step, lbl.min, lbl.max)}
                  style={[styles.alarmBtn, { backgroundColor: alarm.tint + "15", borderColor: alarm.tint + "30" }]}
                >
                  <Feather name="minus" size={14} color={alarm.tint} />
                </Pressable>
                <Pressable
                  onPress={() => adjustAlarm(alarm.key, lbl.step, lbl.min, lbl.max)}
                  style={[styles.alarmBtn, { backgroundColor: alarm.tint + "15", borderColor: alarm.tint + "30" }]}
                >
                  <Feather name="plus" size={14} color={alarm.tint} />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 },
  screenTitle: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5, marginBottom: 4 },
  screenSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 20 },
  intentionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  intentionBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5 },
  intentionText: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  intentionConfirm: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 4 },
  intentionConfirmText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 19 },
  divider: { height: 1, backgroundColor: "transparent", marginVertical: 28 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  progressPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  progressText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  essentialsList: { gap: 10, marginBottom: 4 },
  essentialCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 18, borderWidth: 1 },
  essentialIcon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  essentialContent: { flex: 1, gap: 2 },
  essentialTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.2 },
  essentialBody: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  alarmsList: { gap: 10 },
  alarmCard: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 18, borderWidth: 1 },
  alarmIcon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  alarmContent: { flex: 1, gap: 3 },
  alarmLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 2, textTransform: "uppercase" },
  alarmValue: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.5 },
  alarmControls: { flexDirection: "row", gap: 8 },
  alarmBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
