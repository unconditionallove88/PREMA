import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

const CONTENT = {
  en: {
    title: "Preparation",
    subtitle: "Radiate from within",
    affirmation: '"Prepare with love"',
    button: "I am prepared",
    sections: {
      testing: "Lab Testing",
      essentials: "Essentials Kit",
      nutrition: "Physical Intention",
      rest: "Nervous System",
      alarms: "Nurture",
    },
    testing: {
      sub: "Before anything else — safety first",
      title: "Test Your Substances",
      desc: "Anonymous lab testing is the most important step you can take. Know exactly what you're consuming before your session.",
      cta: "Book Anonymous Lab Test",
      skip: "I have already tested my substances",
      confirmed: "Substances confirmed",
    },
    essentials: {
      sub: "Your care protocol",
      title: "Essentials Kit",
      items: [
        { name: "Phone (100% Charged)", why: "Your lifeline to your Circle of Love" },
        { name: "Single-Use Straws", why: "Prevents cross-contamination — never share" },
        { name: "Zinc Supplement", dose: "15–30 mg", why: "Supports immune & neurotransmitter balance" },
        { name: "Magnesium Supplement", dose: "200–400 mg", why: "Reduces muscle tension, supports heart rhythm" },
        { name: "Electrolytes", dose: "As needed", why: "Maintains hydration and mineral balance" },
        { name: "Disinfecting Wipes", why: "Clean surfaces before use" },
        { name: "Credit-Card Plates (×2)", why: "Use dedicated clean surfaces — never banknotes" },
        { name: "Condoms", why: "Protection during intimacy" },
        { name: "Lubricant", why: "Reduces friction, enhances comfort" },
      ],
      done: "Kit confirmed",
    },
    nutrition: {
      sub: "Steady fuel for your journey",
      title: "Physical Intention",
      advice: [
        "Eat a balanced meal 3–4 hours before you head out",
        "Choose complex carbohydrates and lean protein",
        "Avoid heavy, greasy, or processed foods",
        "A light snack 1 hour before is fine",
        "Stay hydrated — sip water steadily throughout the day",
      ],
      done: "Nutrition confirmed",
    },
    rest: {
      sub: "Rest as preparation",
      title: "Nervous System Support",
      advice: [
        "Prioritise restful sleep the night before",
        "Aim to be in bed before 23:00",
        "Entering rest early optimises your hormonal balance",
        "Your body stores energy during deep sleep",
        "If short on sleep, a 20-minute nap helps",
      ],
      done: "Rest protocol confirmed",
    },
    alarms: {
      sub: "Connected to Pulse Guardian",
      title: "Nurture",
      limit: "Intake Limit",
      limitSub: "Total logged units",
      limitUnit: "units",
      leave: "Departure Time",
      leaveSub: "Target leave time",
      rest: "Rest Intervals",
      restSub: "Breathing break frequency",
      water: "Hydration Sync",
      waterSub: "Water reminder frequency",
      confirm: "Activate care alarms",
      done: "Care alarms activated",
    },
    allComplete: "All steps complete",
  },
  de: {
    title: "Vorbereitung",
    subtitle: "Von innen heraus strahlen",
    affirmation: '"Bereite dich mit Liebe vor"',
    button: "Ich bin bereit",
    sections: {
      testing: "Labor-Check",
      essentials: "Essentials Kit",
      nutrition: "Physische Resonanz",
      rest: "Nervensystem",
      alarms: "Nurture",
    },
    testing: {
      sub: "Erst die Sicherheit — dann alles andere",
      title: "Teste deine Substanzen",
      desc: "Anonymes Labor-Testing ist der wichtigste Schritt. Wisse genau, was du konsumierst, bevor deine Session beginnt.",
      cta: "Anonymen Lab-Test buchen",
      skip: "Ich habe meine Substanzen bereits getestet",
      confirmed: "Substanzen bestätigt",
    },
    essentials: {
      sub: "Dein Pflege-Protokoll",
      title: "Essentials Kit",
      items: [
        { name: "Handy (100 % geladen)", why: "Deine Lebensader zu deinem Circle of Love" },
        { name: "Einweg-Röhrchen", why: "Verhindert Kreuzkontamination — niemals teilen" },
        { name: "Zink-Supplement", dose: "15–30 mg", why: "Stärkt Immunfunktion und Neurotransmitter" },
        { name: "Magnesium-Supplement", dose: "200–400 mg", why: "Reduziert Verspannungen, stützt Herzrhythmus" },
        { name: "Elektrolyte", dose: "Nach Bedarf", why: "Erhält Hydration und Mineralbalance" },
        { name: "Desinfektionstücher", why: "Oberflächen vor dem Gebrauch reinigen" },
        { name: "Kreditkarten-Platten (×2)", why: "Dedizierte, saubere Oberflächen verwenden" },
        { name: "Kondome", why: "Schutz bei Intimität" },
        { name: "Gleitmittel", why: "Komfort und Schutz" },
      ],
      done: "Kit bestätigt",
    },
    nutrition: {
      sub: "Stabiler Treibstoff für deine Reise",
      title: "Physische Resonanz",
      advice: [
        "Iss 3–4 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit",
        "Wähle komplexe Kohlenhydrate und mageres Protein",
        "Vermeide schwere, fettige oder verarbeitete Speisen",
        "Ein leichter Snack 1 Stunde vorher ist in Ordnung",
        "Bleib hydratisiert — trinke den ganzen Tag über gleichmäßig",
      ],
      done: "Ernährung bestätigt",
    },
    rest: {
      sub: "Ruhe als Vorbereitung",
      title: "Nervensystem-Unterstützung",
      advice: [
        "Priorisiere erholsamen Schlaf in der Nacht zuvor",
        "Sei vor 23:00 Uhr im Bett",
        "Frühes Einschlafen optimiert dein Hormongleichgewicht",
        "Dein Körper speichert Energie im Tiefschlaf",
        "Bei wenig Schlaf hilft ein 20-minütiges Nickerchen",
      ],
      done: "Erholungsprotokoll bestätigt",
    },
    alarms: {
      sub: "Verbunden mit dem Pulse Guardian",
      title: "Nurture",
      limit: "Limit",
      limitSub: "Gesamte Einheiten",
      limitUnit: "Einheiten",
      leave: "Abfahrtzeit",
      leaveSub: "Geplante Abfahrt",
      rest: "Pausen Intervalle",
      restSub: "Atempausen-Frequenz",
      water: "Hydration",
      waterSub: "Wasser-Erinnerung",
      confirm: "Alarme aktivieren",
      done: "Alarme aktiviert",
    },
    allComplete: "Alle Schritte abgeschlossen",
  },
};

type Section = "testing" | "essentials" | "nutrition" | "rest" | "alarms";
const SECTION_ORDER: Section[] = ["testing", "essentials", "nutrition", "rest", "alarms"];

const SECTION_META: { id: Section; icon: React.ComponentProps<typeof Feather>["name"]; color: string }[] = [
  { id: "testing", icon: "search", color: "#1B4D3E" },
  { id: "essentials", icon: "shield", color: "#F59E0B" },
  { id: "nutrition", icon: "coffee", color: "#10B981" },
  { id: "rest", icon: "moon", color: "#8B5CF6" },
  { id: "alarms", icon: "bell", color: "#06B6D4" },
];

const STORAGE_KEY = "prema_before_checklist";

type StoredState = {
  completed: Record<Section, boolean>;
  essentials: string[];
};

const DEFAULT_COMPLETED: Record<Section, boolean> = {
  testing: false,
  essentials: false,
  nutrition: false,
  rest: false,
  alarms: false,
};

export default function BeforeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, careAlarms } = useSession();
  const t = CONTENT[lang] || CONTENT.en;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const [activeSection, setActiveSection] = useState<Section>("testing");
  const [completed, setCompleted] = useState<Record<Section, boolean>>(DEFAULT_COMPLETED);
  const [essChecked, setEssChecked] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: StoredState = JSON.parse(raw);
          if (parsed.completed) setCompleted({ ...DEFAULT_COMPLETED, ...parsed.completed });
          if (Array.isArray(parsed.essentials)) setEssChecked(parsed.essentials);
        }
      } catch {}
      setHydrated(true);
    })();
  }, []);

  const persist = (next: Partial<StoredState>) => {
    const merged: StoredState = {
      completed,
      essentials: essChecked,
      ...next,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  const markComplete = (section: Section, next?: Section) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompleted((prev) => {
      const updated = { ...prev, [section]: true };
      persist({ completed: updated });
      return updated;
    });
    if (next) setTimeout(() => setActiveSection(next), 400);
  };

  const toggleEss = (name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEssChecked((prev) => {
      const updated = prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name];
      persist({ essentials: updated });
      return updated;
    });
  };

  const allComplete = SECTION_ORDER.every((s) => completed[s]);
  const showPrepared = allComplete || activeSection === "alarms";

  const departure = `${String(careAlarms.departureHour).padStart(2, "0")}:00`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={18} color={colors.mutedForeground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.title}</Text>
          <Text style={[styles.headerSub, { color: colors.primary }]}>{t.subtitle}</Text>
        </View>
        <View style={styles.dots}>
          {SECTION_ORDER.map((s) => (
            <View
              key={s}
              style={[
                styles.dot,
                {
                  backgroundColor: completed[s] ? colors.primary : colors.border,
                  transform: [{ scale: completed[s] ? 1.25 : 1 }],
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Section selector */}
      <View style={[styles.selectorRow, { borderBottomColor: colors.border }]}>
        {SECTION_META.map((m) => {
          const isActive = activeSection === m.id;
          const isDone = completed[m.id];
          return (
            <Pressable
              key={m.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveSection(m.id);
              }}
              style={styles.selectorItem}
            >
              <View
                style={[
                  styles.selectorCircle,
                  {
                    backgroundColor: isActive ? m.color + "20" : colors.card,
                    borderColor: isActive ? m.color : colors.border,
                  },
                ]}
              >
                <Feather
                  name={isDone ? "check" : m.icon}
                  size={16}
                  color={isActive ? m.color : isDone ? colors.primary : colors.mutedForeground}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: botPad + (showPrepared ? 160 : 40) }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.affirmation, { color: colors.primary }]}>{t.affirmation}</Text>

        {/* Testing */}
        {activeSection === "testing" && (
          <View style={styles.sectionBody}>
            <SectionHeading colors={colors} sub={t.testing.sub} title={t.testing.title} tint="#1B4D3E" />
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{t.testing.desc}</Text>
            {completed.testing ? (
              <DoneBanner colors={colors} tint={colors.primary} label={t.testing.confirmed} />
            ) : (
              <View style={{ gap: 10 }}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/laboratory-test");
                  }}
                  style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                >
                  <Feather name="thermometer" size={16} color={colors.primaryForeground} />
                  <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>{t.testing.cta}</Text>
                </Pressable>
                <Pressable
                  onPress={() => markComplete("testing", "essentials")}
                  style={[styles.outlineBtn, { borderColor: colors.border }]}
                >
                  <Text style={[styles.outlineBtnText, { color: colors.mutedForeground }]}>{t.testing.skip}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Essentials */}
        {activeSection === "essentials" && (
          <View style={styles.sectionBody}>
            <SectionHeading colors={colors} sub={t.essentials.sub} title={t.essentials.title} tint="#F59E0B" />
            <View style={{ gap: 8 }}>
              {t.essentials.items.map((item: any) => {
                const isChecked = essChecked.includes(item.name);
                return (
                  <Pressable
                    key={item.name}
                    onPress={() => toggleEss(item.name)}
                    style={[
                      styles.essItem,
                      { backgroundColor: isChecked ? "#F59E0B15" : colors.card, borderColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isChecked ? "#F59E0B" : "transparent",
                          borderColor: isChecked ? "#F59E0B" : colors.border,
                        },
                      ]}
                    >
                      {isChecked && <Feather name="check" size={12} color="#FFFFFF" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.essName, { color: colors.foreground }]}>
                        {item.name}
                        {item.dose ? <Text style={[styles.essDose, { color: colors.mutedForeground }]}>{`  · ${item.dose}`}</Text> : null}
                      </Text>
                      <Text style={[styles.essWhy, { color: colors.mutedForeground }]}>{item.why}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            {completed.essentials ? (
              <DoneBanner colors={colors} tint="#F59E0B" label={t.essentials.done} />
            ) : (
              <Pressable
                disabled={essChecked.length < t.essentials.items.length}
                onPress={() => markComplete("essentials", "nutrition")}
                style={[
                  styles.confirmBtn,
                  essChecked.length >= t.essentials.items.length
                    ? { backgroundColor: "#F59E0B" }
                    : { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, opacity: 0.5 },
                ]}
              >
                <Text
                  style={[
                    styles.confirmBtnText,
                    { color: essChecked.length >= t.essentials.items.length ? "#FFFFFF" : colors.mutedForeground },
                  ]}
                >
                  {t.essentials.done}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Nutrition */}
        {activeSection === "nutrition" && (
          <AdviceSection
            colors={colors}
            sub={t.nutrition.sub}
            title={t.nutrition.title}
            advice={t.nutrition.advice}
            tint="#10B981"
            done={completed.nutrition}
            doneText={t.nutrition.done}
            onConfirm={() => markComplete("nutrition", "rest")}
          />
        )}

        {/* Rest */}
        {activeSection === "rest" && (
          <AdviceSection
            colors={colors}
            sub={t.rest.sub}
            title={t.rest.title}
            advice={t.rest.advice}
            tint="#8B5CF6"
            done={completed.rest}
            doneText={t.rest.done}
            onConfirm={() => markComplete("rest", "alarms")}
          />
        )}

        {/* Alarms summary */}
        {activeSection === "alarms" && (
          <View style={styles.sectionBody}>
            <SectionHeading colors={colors} sub={t.alarms.sub} title={t.alarms.title} tint="#06B6D4" />
            <AlarmRow colors={colors} icon="zap-off" tint="#F59E0B" label={t.alarms.limit} sub={t.alarms.limitSub} value={`${careAlarms.intakeLimit} ${t.alarms.limitUnit}`} />
            <AlarmRow colors={colors} icon="clock" tint="#3B82F6" label={t.alarms.leave} sub={t.alarms.leaveSub} value={departure} />
            <AlarmRow colors={colors} icon="heart" tint="#E0556A" label={t.alarms.rest} sub={t.alarms.restSub} value={`${careAlarms.breathingBreak} min`} />
            <AlarmRow colors={colors} icon="droplet" tint="#06B6D4" label={t.alarms.water} sub={t.alarms.waterSub} value={`${careAlarms.hydrationSync} min`} />
            {completed.alarms ? (
              <DoneBanner colors={colors} tint="#06B6D4" label={t.alarms.done} />
            ) : (
              <Pressable
                onPress={() => markComplete("alarms")}
                style={[styles.confirmBtn, { backgroundColor: "#06B6D4" }]}
              >
                <Text style={[styles.confirmBtnText, { color: "#FFFFFF" }]}>{t.alarms.confirm}</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* I am prepared footer */}
      {showPrepared && hydrated && (
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.card, borderTopColor: colors.primary + "30", paddingBottom: botPad + 20 },
          ]}
        >
          {allComplete && (
            <View style={styles.footerStatus}>
              <Feather name="check-circle" size={14} color={colors.primary} />
              <Text style={[styles.footerStatusText, { color: colors.primary }]}>{t.allComplete}</Text>
            </View>
          )}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/during");
            }}
            style={[styles.primaryBtn, { backgroundColor: colors.primary, height: 56 }]}
          >
            <Text style={[styles.primaryBtnText, { color: colors.primaryForeground, fontSize: 14 }]}>{t.button}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SectionHeading({ colors, sub, title, tint }: { colors: ReturnType<typeof useColors>; sub: string; title: string; tint: string }) {
  return (
    <View style={{ gap: 4 }}>
      <Text style={[styles.sectionSub, { color: tint }]}>{sub}</Text>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );
}

function DoneBanner({ colors, tint, label }: { colors: ReturnType<typeof useColors>; tint: string; label: string }) {
  return (
    <View style={[styles.doneBanner, { backgroundColor: tint + "15", borderColor: tint + "40" }]}>
      <Feather name="check-circle" size={18} color={tint} />
      <Text style={[styles.doneBannerText, { color: tint }]}>{label} ✓</Text>
    </View>
  );
}

function AdviceSection({
  colors,
  sub,
  title,
  advice,
  tint,
  done,
  doneText,
  onConfirm,
}: {
  colors: ReturnType<typeof useColors>;
  sub: string;
  title: string;
  advice: string[];
  tint: string;
  done: boolean;
  doneText: string;
  onConfirm: () => void;
}) {
  return (
    <View style={styles.sectionBody}>
      <SectionHeading colors={colors} sub={sub} title={title} tint={tint} />
      <View style={{ gap: 2 }}>
        {advice.map((tip, i) => (
          <View key={i} style={styles.adviceRow}>
            <View style={[styles.adviceBullet, { backgroundColor: tint }]} />
            <Text style={[styles.adviceText, { color: colors.foreground }]}>{tip}</Text>
          </View>
        ))}
      </View>
      {done ? (
        <DoneBanner colors={colors} tint={tint} label={doneText} />
      ) : (
        <Pressable onPress={onConfirm} style={[styles.confirmBtn, { backgroundColor: tint }]}>
          <Text style={[styles.confirmBtnText, { color: "#FFFFFF" }]}>{doneText}</Text>
        </Pressable>
      )}
    </View>
  );
}

function AlarmRow({
  colors,
  icon,
  tint,
  label,
  sub,
  value,
}: {
  colors: ReturnType<typeof useColors>;
  icon: React.ComponentProps<typeof Feather>["name"];
  tint: string;
  label: string;
  sub: string;
  value: string;
}) {
  return (
    <View style={[styles.alarmRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.alarmIcon, { backgroundColor: tint + "18" }]}>
        <Feather name={icon} size={18} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.alarmLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.alarmSub, { color: colors.mutedForeground }]}>{sub}</Text>
      </View>
      <Text style={[styles.alarmValue, { color: tint }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  headerSub: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 3, textTransform: "uppercase" },
  dots: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  selectorItem: { alignItems: "center" },
  selectorCircle: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20, paddingTop: 18 },
  affirmation: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 4, textTransform: "uppercase", textAlign: "center", marginBottom: 18 },
  sectionBody: { gap: 16 },
  sectionSub: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 4, textTransform: "uppercase" },
  sectionTitle: { fontSize: 20, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3 },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 23 },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 18,
  },
  primaryBtnText: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1.5, textTransform: "uppercase" },
  outlineBtn: { height: 48, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  outlineBtnText: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1, textTransform: "uppercase" },
  essItem: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 14, borderRadius: 16, borderWidth: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: "center", justifyContent: "center", marginTop: 1 },
  essName: { fontSize: 14, fontFamily: "Inter_500Medium" },
  essDose: { fontSize: 12, fontFamily: "Inter_400Regular" },
  essWhy: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 16 },
  confirmBtn: { height: 50, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  confirmBtnText: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1.5, textTransform: "uppercase" },
  adviceRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, paddingVertical: 10, paddingHorizontal: 4 },
  adviceBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7, opacity: 0.6 },
  adviceText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  alarmRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16, borderRadius: 18, borderWidth: 1 },
  alarmIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  alarmLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  alarmSub: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
  alarmValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  doneBanner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 18, borderWidth: 1 },
  doneBannerText: { fontSize: 13, fontFamily: "Inter_700Bold", letterSpacing: 0.5, textTransform: "uppercase" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  footerStatus: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 },
  footerStatusText: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 3, textTransform: "uppercase" },
});
