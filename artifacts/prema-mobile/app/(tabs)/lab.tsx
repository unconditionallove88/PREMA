import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession, useThemePreference } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const SUBSTANCES = [
  "Alcohol",
  "MDMA",
  "3-MMC",
  "Cannabis",
  "Ketamine",
  "LSD",
  "Cocaine",
  "Psilocybin",
  "Speed",
];

const CONTENT = {
  en: {
    title: "Laboratory",
    sub: "Know what you take · know when",
    sinceLabel: "Time since last intake",
    none: "Nothing logged yet",
    logTitle: "Log an intake",
    amount: "Amount (optional)",
    amountPh: "e.g. 1 pill, 100mg, half",
    add: "Log intake",
    history: "Intake Log",
    emptyHistory: "Your intake timeline will appear here.",
    clear: "Clear log",
    ago: "ago",
    mixingBtn: "Mixing Wisdom",
    mixingSub: "Tap anytime — combining changes the risk",
    mixingTitle: "Mixing Wisdom",
    mixingIntro:
      "Mixing substances multiplies risk in ways that are hard to predict. When unsure, don't mix.",
    close: "Close",
    principles: "Core principles",
    principleList: [
      "Start low and go slow — wait 90+ minutes before redosing.",
      "Hydrate ~500ml of water per hour when dancing — sip, don't gulp.",
      "One substance at a time is always the safest path.",
      "Test your substances before the night when you can.",
    ],
    combos: [
      {
        title: "Depressant + Depressant",
        items: "Alcohol · GHB · Ketamine · Opioids · Benzos",
        risk: "High risk",
        note: "Slows breathing and can cause blackout or overdose. Avoid combining.",
      },
      {
        title: "Stimulant + Stimulant",
        items: "MDMA · Cocaine · Speed · 3-MMC",
        risk: "High risk",
        note: "Strains the heart and raises body temperature. Risk of overheating.",
      },
      {
        title: "MDMA + Alcohol",
        items: "",
        risk: "Caution",
        note: "Heavy dehydration and strain on liver and kidneys. Sip water, not alcohol.",
      },
      {
        title: "MDMA + Antidepressants",
        items: "SSRIs · MAOIs",
        risk: "Dangerous",
        note: "Can trigger serotonin syndrome. Research carefully before mixing.",
      },
      {
        title: "Psychedelics + Stimulants",
        items: "LSD · Psilocybin + Speed/Coke",
        risk: "Caution",
        note: "Amplifies anxiety and can overwhelm. Lower the dose if you do.",
      },
    ],
  },
  de: {
    title: "Labor",
    sub: "Wisse was du nimmst · und wann",
    sinceLabel: "Zeit seit letzter Einnahme",
    none: "Noch nichts erfasst",
    logTitle: "Einnahme erfassen",
    amount: "Menge (optional)",
    amountPh: "z.B. 1 Pille, 100mg, halbe",
    add: "Einnahme erfassen",
    history: "Einnahme-Verlauf",
    emptyHistory: "Dein Verlauf erscheint hier.",
    clear: "Verlauf löschen",
    ago: "her",
    mixingBtn: "Misch-Wissen",
    mixingSub: "Jederzeit antippen — Mischen ändert das Risiko",
    mixingTitle: "Misch-Wissen",
    mixingIntro:
      "Das Mischen von Substanzen erhöht das Risiko unvorhersehbar. Im Zweifel: nicht mischen.",
    close: "Schließen",
    principles: "Grundregeln",
    principleList: [
      "Niedrig anfangen, langsam steigern — 90+ Minuten vor Nachdosieren warten.",
      "~500ml Wasser pro Stunde beim Tanzen — schluckweise, nicht stürzen.",
      "Eine Substanz nach der anderen ist immer am sichersten.",
      "Teste deine Substanzen vorher, wenn möglich.",
    ],
    combos: [
      {
        title: "Dämpfer + Dämpfer",
        items: "Alkohol · GHB · Ketamin · Opioide · Benzos",
        risk: "Hohes Risiko",
        note: "Verlangsamt die Atmung, kann Blackout oder Überdosis verursachen. Vermeiden.",
      },
      {
        title: "Stimulans + Stimulans",
        items: "MDMA · Kokain · Speed · 3-MMC",
        risk: "Hohes Risiko",
        note: "Belastet das Herz und erhöht die Körpertemperatur. Überhitzungsgefahr.",
      },
      {
        title: "MDMA + Alkohol",
        items: "",
        risk: "Vorsicht",
        note: "Starke Dehydrierung, belastet Leber und Nieren. Wasser trinken, kein Alkohol.",
      },
      {
        title: "MDMA + Antidepressiva",
        items: "SSRI · MAOI",
        risk: "Gefährlich",
        note: "Kann Serotonin-Syndrom auslösen. Vorher sorgfältig informieren.",
      },
      {
        title: "Psychedelika + Stimulanzien",
        items: "LSD · Psilocybin + Speed/Koks",
        risk: "Vorsicht",
        note: "Verstärkt Angst und kann überfordern. Dosis senken.",
      },
    ],
  },
};

const STORAGE_KEY = "prema_intake_log";

type Intake = { id: string; substance: string; amount?: string; ts: number };

const RISK_COLOR: Record<string, string> = {
  "High risk": "#EF4444",
  Dangerous: "#EF4444",
  Caution: "#F59E0B",
  "Hohes Risiko": "#EF4444",
  Gefährlich: "#EF4444",
  Vorsicht: "#F59E0B",
};

export default function LaboratoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const vibe = useThemePreference();
  const accent = vibe === "dark" ? "#3DB879" : "#EC4899";

  const t = CONTENT[lang] || CONTENT.en;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const tabPad = Platform.OS === "web" ? 84 : insets.bottom + 64;

  const [log, setLog] = useState<Intake[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [now, setNow] = useState(Date.now());
  const [mixingOpen, setMixingOpen] = useState(false);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setLog(parsed);
        }
      } catch {}
    })();
    tick.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, []);

  const persist = async (next: Intake[]) => {
    setLog(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleAdd = () => {
    if (!selected) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const entry: Intake = {
      id: String(Date.now()),
      substance: selected,
      amount: amount.trim() || undefined,
      ts: Date.now(),
    };
    persist([entry, ...log]);
    setSelected(null);
    setAmount("");
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    persist([]);
  };

  const formatElapsed = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  const formatClock = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString(lang === "de" ? "de-DE" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const last = log[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingTop: topPad + 8, paddingBottom: tabPad + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>{t.title}</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>{t.sub}</Text>
        </View>

        {/* Time since last intake */}
        <View style={[styles.timerCard, { backgroundColor: colors.card, borderColor: accent + "55" }]}>
          <Text style={[styles.timerLabel, { color: colors.mutedForeground }]}>
            {t.sinceLabel.toUpperCase()}
          </Text>
          {last ? (
            <>
              <Text style={[styles.timerValue, { color: accent }]}>
                {formatElapsed(now - last.ts)}
              </Text>
              <Text style={[styles.timerMeta, { color: colors.foreground }]}>
                {last.substance}
                {last.amount ? ` · ${last.amount}` : ""} · {formatClock(last.ts)}
              </Text>
            </>
          ) : (
            <Text style={[styles.timerNone, { color: colors.mutedForeground }]}>{t.none}</Text>
          )}
        </View>

        {/* Mixing Wisdom — always accessible, highlighted */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setMixingOpen(true);
          }}
          style={({ pressed }) => [
            styles.mixingBtn,
            { backgroundColor: accent + "18", borderColor: accent, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <View style={[styles.mixingIcon, { backgroundColor: accent + "26" }]}>
            <Feather name="alert-triangle" size={20} color={accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.mixingTitle, { color: colors.foreground }]}>{t.mixingBtn}</Text>
            <Text style={[styles.mixingSub, { color: colors.mutedForeground }]}>{t.mixingSub}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={accent} />
        </Pressable>

        {/* Log an intake */}
        <View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.composerTitle, { color: colors.foreground }]}>{t.logTitle}</Text>
          <View style={styles.chips}>
            {SUBSTANCES.map((s) => {
              const active = selected === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelected(active ? null : s);
                  }}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? accent : colors.background,
                      borderColor: active ? accent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? "#FFFFFF" : colors.foreground },
                    ]}
                  >
                    {s}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder={t.amountPh}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.amountInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <Pressable
            onPress={handleAdd}
            disabled={!selected}
            style={({ pressed }) => [
              styles.addBtn,
              {
                backgroundColor: selected ? accent : colors.muted,
                opacity: pressed && selected ? 0.88 : 1,
              },
            ]}
          >
            <Feather name="plus" size={16} color={selected ? "#FFFFFF" : colors.mutedForeground} />
            <Text style={[styles.addBtnText, { color: selected ? "#FFFFFF" : colors.mutedForeground }]}>
              {t.add}
            </Text>
          </Pressable>
        </View>

        {/* History */}
        <View style={styles.historyHeader}>
          <Text style={[styles.historyTitle, { color: colors.mutedForeground }]}>{t.history.toUpperCase()}</Text>
          {log.length > 0 && (
            <Pressable onPress={handleClear} hitSlop={10}>
              <Text style={[styles.clearText, { color: colors.mutedForeground }]}>{t.clear}</Text>
            </Pressable>
          )}
        </View>

        {log.length === 0 ? (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>{t.emptyHistory}</Text>
        ) : (
          <View style={styles.historyList}>
            {log.map((item) => (
              <View
                key={item.id}
                style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.dot, { backgroundColor: accent }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: colors.foreground }]}>
                    {item.substance}
                    {item.amount ? ` · ${item.amount}` : ""}
                  </Text>
                  <Text style={[styles.itemTime, { color: colors.mutedForeground }]}>
                    {formatClock(item.ts)} · {formatElapsed(now - item.ts)} {t.ago}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Mixing Wisdom modal */}
      <Modal
        visible={mixingOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setMixingOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Feather name="alert-triangle" size={20} color={accent} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t.mixingTitle}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
              <Text style={[styles.modalIntro, { color: colors.mutedForeground }]}>{t.mixingIntro}</Text>

              {t.combos.map((c, i) => (
                <View
                  key={i}
                  style={[styles.comboCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={styles.comboTop}>
                    <Text style={[styles.comboTitle, { color: colors.foreground }]}>{c.title}</Text>
                    <View style={[styles.riskTag, { backgroundColor: (RISK_COLOR[c.risk] || accent) + "22" }]}>
                      <Text style={[styles.riskText, { color: RISK_COLOR[c.risk] || accent }]}>{c.risk}</Text>
                    </View>
                  </View>
                  {!!c.items && (
                    <Text style={[styles.comboItems, { color: colors.mutedForeground }]}>{c.items}</Text>
                  )}
                  <Text style={[styles.comboNote, { color: colors.foreground }]}>{c.note}</Text>
                </View>
              ))}

              <Text style={[styles.principlesTitle, { color: accent }]}>{t.principles.toUpperCase()}</Text>
              {t.principleList.map((p, i) => (
                <View key={i} style={styles.principleRow}>
                  <Feather name="check" size={14} color={accent} />
                  <Text style={[styles.principleText, { color: colors.foreground }]}>{p}</Text>
                </View>
              ))}
            </ScrollView>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setMixingOpen(false);
              }}
              style={({ pressed }) => [
                styles.closeBtn,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.closeBtnText, { color: colors.foreground }]}>{t.close}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerSection: { alignItems: "center", marginBottom: 20, gap: 6 },
  title: { fontSize: 22, fontFamily: "Nunito_700Bold", letterSpacing: -0.5 },
  sub: { fontSize: 12, fontFamily: "Nunito_500Medium", letterSpacing: 0.3 },
  timerCard: { borderRadius: 24, borderWidth: 2, padding: 24, alignItems: "center", gap: 8, marginBottom: 16 },
  timerLabel: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 2 },
  timerValue: { fontSize: 44, fontFamily: "Nunito_700Bold", letterSpacing: -1 },
  timerMeta: { fontSize: 13, fontFamily: "Nunito_600SemiBold" },
  timerNone: { fontSize: 16, fontFamily: "Nunito_500Medium", fontStyle: "italic", marginTop: 4 },
  mixingBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 20,
    borderWidth: 2,
    padding: 16,
    marginBottom: 24,
  },
  mixingIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  mixingTitle: { fontSize: 15, fontFamily: "Nunito_700Bold" },
  mixingSub: { fontSize: 11, fontFamily: "Nunito_500Medium", marginTop: 2 },
  composer: { borderRadius: 24, borderWidth: 1, padding: 20, gap: 16, marginBottom: 24 },
  composerTitle: { fontSize: 15, fontFamily: "Nunito_700Bold" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Nunito_600SemiBold" },
  amountInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Nunito_500Medium",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 999,
  },
  addBtnText: { fontSize: 14, fontFamily: "Nunito_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  historyTitle: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 2 },
  clearText: { fontSize: 11, fontFamily: "Nunito_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  empty: { fontSize: 13, fontFamily: "Nunito_500Medium", fontStyle: "italic" },
  historyList: { gap: 10 },
  historyItem: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 16, borderWidth: 1, padding: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  itemName: { fontSize: 14, fontFamily: "Nunito_600SemiBold" },
  itemTime: { fontSize: 11, fontFamily: "Nunito_500Medium", marginTop: 3 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: "88%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9993",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  modalTitle: { fontSize: 20, fontFamily: "Nunito_700Bold" },
  modalIntro: { fontSize: 13, fontFamily: "Nunito_500Medium", lineHeight: 20, marginBottom: 18 },
  comboCard: { borderRadius: 18, borderWidth: 1, padding: 16, gap: 8, marginBottom: 12 },
  comboTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  comboTitle: { fontSize: 14, fontFamily: "Nunito_700Bold", flex: 1 },
  riskTag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  riskText: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 0.5, textTransform: "uppercase" },
  comboItems: { fontSize: 11, fontFamily: "Nunito_600SemiBold", letterSpacing: 0.3 },
  comboNote: { fontSize: 13, fontFamily: "Nunito_500Medium", lineHeight: 20 },
  principlesTitle: { fontSize: 11, fontFamily: "Nunito_700Bold", letterSpacing: 2, marginTop: 10, marginBottom: 12 },
  principleRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  principleText: { flex: 1, fontSize: 13, fontFamily: "Nunito_500Medium", lineHeight: 20 },
  closeBtn: {
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  closeBtnText: { fontSize: 14, fontFamily: "Nunito_700Bold", letterSpacing: 1, textTransform: "uppercase" },
});
