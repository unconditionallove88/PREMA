import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const COMBOS = [
  { a: "MDMA", b: "Alcohol", risk: "HIGH", en: "Increases dehydration and cardiac strain. Avoid combining.", de: "Erhöht Dehydrierung und Herzbelastung. Nicht kombinieren." },
  { a: "Cocaine", b: "Alcohol", risk: "HIGH", en: "Forms cocaethylene in the liver — toxic and cardiotoxic.", de: "Bildet Kokaetylen in der Leber — toxisch und kardiotoxisch." },
  { a: "MDMA", b: "MAOI", risk: "DANGER", en: "Life-threatening serotonin syndrome. Never combine.", de: "Lebensbedrohliches Serotonin-Syndrom. Niemals kombinieren." },
  { a: "Stimulants", b: "Cocaine", risk: "HIGH", en: "Severe cardiovascular overload. High risk of cardiac event.", de: "Schwere kardiovaskuläre Überlastung. Hohes Herzinfarktrisiko." },
  { a: "Alcohol", b: "Benzodiazepines", risk: "DANGER", en: "CNS depression — respiratory failure risk. Never combine.", de: "ZNS-Depression — Atemversagen möglich. Niemals kombinieren." },
  { a: "Psychedelics", b: "Lithium", risk: "HIGH", en: "Risk of seizures. Avoid if taking mood stabilizers.", de: "Krampfrisiko. Vermeiden wenn Stimmungsstabilisatoren genommen." },
];

const BREATH_PHASES = [
  { label: { en: "Breathe In Love", de: "Einatmen Liebe" }, duration: 4000, color: "#10B981" },
  { label: { en: "Hold", de: "Halten" }, duration: 4000, color: "#F59E0B" },
  { label: { en: "Breathe Out Love", de: "Ausatmen Liebe" }, duration: 6000, color: "#A78BFA" },
  { label: { en: "Rest", de: "Ruhen" }, duration: 2000, color: "#38BDF8" },
];

function PulsingAura({ colors }: { colors: ReturnType<typeof useColors> }) {
  const r1 = useRef(new Animated.Value(1)).current;
  const r2 = useRef(new Animated.Value(1)).current;
  const r3 = useRef(new Animated.Value(1)).current;
  const o1 = useRef(new Animated.Value(0.5)).current;
  const o2 = useRef(new Animated.Value(0.3)).current;
  const o3 = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const makeLoop = (s: Animated.Value, o: Animated.Value, delay: number, baseOp: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(s, { toValue: 1.8, duration: 2500, useNativeDriver: true }),
            Animated.timing(o, { toValue: 0, duration: 2500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(s, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(o, { toValue: baseOp, duration: 0, useNativeDriver: true }),
          ]),
        ])
      );
    const a1 = makeLoop(r1, o1, 0, 0.5);
    const a2 = makeLoop(r2, o2, 600, 0.3);
    const a3 = makeLoop(r3, o3, 1200, 0.15);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [r1, r2, r3, o1, o2, o3]);

  return (
    <View style={styles.auraContainer}>
      {[{ s: r3, o: o3 }, { s: r2, o: o2 }, { s: r1, o: o1 }].map((a, i) => (
        <Animated.View
          key={i}
          style={[styles.auraRing, { backgroundColor: colors.primary + "25", transform: [{ scale: a.s }], opacity: a.o }]}
        />
      ))}
      <View style={[styles.auraCore, { backgroundColor: colors.card, borderColor: colors.primary + "50" }]}>
        <Feather name="zap" size={32} color={colors.primary} />
      </View>
    </View>
  );
}

function BreathModal({ visible, onClose, lang, colors }: { visible: boolean; onClose: () => void; lang: string; colors: ReturnType<typeof useColors> }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [cycles, setCycles] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (!visible) { setPhaseIdx(0); setCycles(0); return; }
    let idx = 0;
    let running = true;
    const run = () => {
      if (!running) return;
      const ph = BREATH_PHASES[idx];
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: ph.duration * 0.6, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: ph.duration * 0.4, useNativeDriver: true }),
      ]).start();
      setPhaseIdx(idx);
      setTimeout(() => {
        if (!running) return;
        idx = (idx + 1) % BREATH_PHASES.length;
        if (idx === 0) setCycles((c) => c + 1);
        run();
      }, ph.duration);
    };
    run();
    return () => { running = false; };
  }, [visible, scaleAnim]);

  const ph = BREATH_PHASES[phaseIdx];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: ph.color + "F0" }]}>
        <Pressable style={styles.modalClose} onPress={onClose}>
          <Feather name="x" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.breathTitle}>{lang === "de" ? "Atem der Liebe" : "Love Breath"}</Text>
        <Text style={styles.breathCycles}>{lang === "de" ? `Zyklus ${cycles + 1}` : `Cycle ${cycles + 1}`}</Text>
        <Animated.View style={[styles.breathOrb, { backgroundColor: "#ffffff20", transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.breathOrbInner, { borderColor: "#ffffff60" }]}>
            <Feather name="wind" size={36} color="#fff" />
          </View>
        </Animated.View>
        <Text style={styles.breathPhaseLabel}>{ph.label[lang === "de" ? "de" : "en"]}</Text>
        <Text style={styles.breathHint}>{lang === "de" ? "Atme ruhig und natürlich" : "Breathe calmly and naturally"}</Text>
      </View>
    </Modal>
  );
}

function QuickNoteModal({ visible, onClose, onSave, lang, colors }: { visible: boolean; onClose: () => void; onSave: (note: string) => void; lang: string; colors: ReturnType<typeof useColors> }) {
  const [text, setText] = useState("");
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.noteOverlay, { backgroundColor: colors.background + "F8" }]}>
        <View style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.noteHeader}>
            <Text style={[styles.noteTitle, { color: colors.foreground }]}>
              {lang === "de" ? "Liebesbrief" : "Love Letter"}
            </Text>
            <Pressable onPress={onClose}><Feather name="x" size={20} color={colors.mutedForeground} /></Pressable>
          </View>
          <TextInput
            style={[styles.noteInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
            placeholder={lang === "de" ? "Was spürst du gerade..." : "What do you feel right now..."}
            placeholderTextColor={colors.mutedForeground}
            multiline
            autoFocus
            value={text}
            onChangeText={setText}
          />
          <Pressable
            onPress={() => { if (text.trim()) { onSave(text.trim()); setText(""); onClose(); } }}
            style={[styles.noteSaveBtn, { backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.4 }]}
          >
            <Text style={[styles.noteSaveBtnText, { color: colors.primaryForeground }]}>
              {lang === "de" ? "Speichern" : "Save"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function ActionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, careAlarms, quickNotes, addQuickNote } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [breathOpen, setBreathOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);
  const [combosOpen, setCombosOpen] = useState(false);

  const [loggedUnits, setLoggedUnits] = useState(0);
  const [lastDoseMin, setLastDoseMin] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (lastDoseMin === null) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() / 60000) - lastDoseMin));
    }, 30000);
    setElapsed(0);
    return () => clearInterval(interval);
  }, [lastDoseMin]);

  const logDose = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoggedUnits((u) => u + 1);
    setLastDoseMin(Date.now() / 60000);
  }, []);

  const reachedLimit = loggedUnits >= careAlarms.intakeLimit;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <BreathModal visible={breathOpen} onClose={() => setBreathOpen(false)} lang={lang} colors={colors} />
      <QuickNoteModal visible={noteOpen} onClose={() => setNoteOpen(false)} onSave={addQuickNote} lang={lang} colors={colors} />

      {/* Combos Modal */}
      <Modal visible={combosOpen} transparent animationType="slide" onRequestClose={() => setCombosOpen(false)}>
        <View style={[styles.comboOverlay, { backgroundColor: colors.background + "FA" }]}>
          <View style={styles.comboHeader}>
            <Text style={[styles.comboHeaderTitle, { color: colors.foreground }]}>
              {lang === "de" ? "Etwas zu bedenken" : "Something to Remember"}
            </Text>
            <Pressable onPress={() => setCombosOpen(false)}><Feather name="x" size={22} color={colors.mutedForeground} /></Pressable>
          </View>
          <ScrollView contentContainerStyle={{ gap: 10, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            {COMBOS.map((c, i) => (
              <View key={i} style={[styles.comboCard, { backgroundColor: c.risk === "DANGER" ? "#EF444415" : "#F59E0B15", borderColor: c.risk === "DANGER" ? "#EF444440" : "#F59E0B40" }]}>
                <View style={styles.comboTop}>
                  <Text style={[styles.comboPair, { color: c.risk === "DANGER" ? "#EF4444" : "#F59E0B" }]}>{c.a} + {c.b}</Text>
                  <View style={[styles.riskBadge, { backgroundColor: c.risk === "DANGER" ? "#EF444425" : "#F59E0B25" }]}>
                    <Text style={[styles.riskText, { color: c.risk === "DANGER" ? "#EF4444" : "#F59E0B" }]}>{c.risk}</Text>
                  </View>
                </View>
                <Text style={[styles.comboBody, { color: colors.mutedForeground }]}>{lang === "de" ? c.de : c.en}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: topPad + 24, paddingBottom: botPad + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "PHASE 2 · ACTION" : "PHASE 2 · ACTION"}
        </Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          {lang === "de" ? "Grounding Tool" : "Grounding Tool"}
        </Text>

        {/* ── PULSE AURA + 3 TOOLS ── */}
        <View style={styles.pulseZone}>
          {/* Love Breath — left */}
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBreathOpen(true); }}
            style={[styles.orbTool, { backgroundColor: "#10B98115", borderColor: "#10B98130" }]}
          >
            <Feather name="wind" size={20} color="#10B981" />
            <Text style={[styles.orbToolLabel, { color: "#10B981" }]}>{lang === "de" ? "Atem" : "Breath"}</Text>
          </Pressable>

          <PulsingAura colors={colors} />

          {/* Love Letters — right */}
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setNoteOpen(true); }}
            style={[styles.orbTool, { backgroundColor: "#EC489915", borderColor: "#EC489930" }]}
          >
            <Feather name="edit-3" size={20} color="#EC4899" />
            <Text style={[styles.orbToolLabel, { color: "#EC4899" }]}>{lang === "de" ? "Brief" : "Letter"}</Text>
          </Pressable>
        </View>

        {/* Quick notes count */}
        {quickNotes.length > 0 && (
          <Text style={[styles.notesCount, { color: colors.mutedForeground }]}>
            {quickNotes.length} {lang === "de" ? "Briefe gespeichert" : "letters saved"} ·{" "}
            {lang === "de" ? "Öffne Aufmerksamkeit zum Lesen" : "Open Attention to read"}
          </Text>
        )}

        {/* ── THE SET — LABORATORY ── */}
        <View style={styles.divider} />
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "DAS SET · LABOR" : "THE SET · LABORATORY"}
        </Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          {lang === "de" ? "Dein Log" : "Your Log"}
        </Text>

        <View style={[styles.setCard, { backgroundColor: colors.card, borderColor: reachedLimit ? "#EF444440" : colors.border }]}>
          <View style={styles.setTop}>
            <View>
              <Text style={[styles.setUnitsLabel, { color: colors.mutedForeground }]}>
                {lang === "de" ? "LOGGED UNITS" : "LOGGED UNITS"}
              </Text>
              <View style={styles.setUnitsRow}>
                <Text style={[styles.setUnitsValue, { color: reachedLimit ? "#EF4444" : colors.foreground }]}>
                  {loggedUnits}
                </Text>
                <Text style={[styles.setUnitsMax, { color: colors.mutedForeground }]}>
                  / {careAlarms.intakeLimit}
                </Text>
              </View>
            </View>
            {lastDoseMin !== null && (
              <View style={[styles.timerBadge, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
                <Feather name="clock" size={13} color={colors.primary} />
                <Text style={[styles.timerText, { color: colors.primary }]}>
                  {elapsed}m {lang === "de" ? "seit letzter Dosis" : "since last dose"}
                </Text>
              </View>
            )}
          </View>

          {reachedLimit ? (
            <View style={[styles.limitWarning, { backgroundColor: "#EF444412", borderColor: "#EF444430" }]}>
              <Feather name="alert-triangle" size={14} color="#EF4444" />
              <Text style={[styles.limitText, { color: "#EF4444" }]}>
                {lang === "de" ? "Du hast dein Limit erreicht. Pause und Wasser." : "You've reached your limit. Rest and hydrate."}
              </Text>
            </View>
          ) : (
            <Pressable
              onPress={logDose}
              style={({ pressed }) => [styles.logBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            >
              <Feather name="plus" size={18} color={colors.primaryForeground} />
              <Text style={[styles.logBtnText, { color: colors.primaryForeground }]}>
                {lang === "de" ? "Einheit loggen" : "Log Unit"}
              </Text>
            </Pressable>
          )}

          {careAlarms.breathingBreak > 0 && lastDoseMin !== null && (
            <Text style={[styles.redoseTip, { color: colors.mutedForeground }]}>
              {lang === "de"
                ? `Empfohlene Pause: ${careAlarms.breathingBreak} min`
                : `Recommended interval: ${careAlarms.breathingBreak} min`}
            </Text>
          )}
        </View>

        <Pressable
          onPress={() => setCombosOpen(true)}
          style={[styles.combosBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="book-open" size={16} color={colors.mutedForeground} />
          <Text style={[styles.combosBtnText, { color: colors.foreground }]}>
            {lang === "de" ? "Etwas zu bedenken — Kombinationen" : "Something to Remember — Combinations"}
          </Text>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </Pressable>

        {/* ── FRIENDS PULSE ── */}
        <View style={styles.divider} />
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "FRIENDS PULSE · KREIS DER LIEBE" : "FRIENDS PULSE · CIRCLE OF LOVE"}
        </Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          {lang === "de" ? "Pulse senden" : "Send a Pulse"}
        </Text>
        <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
          {lang === "de"
            ? "Teile deinen Status mit deinem Kreis"
            : "Share your presence with your circle"}
        </Text>

        <View style={styles.pulseButtons}>
          {[
            { label: { en: "I am present", de: "Ich bin präsent" }, icon: "heart" as const, color: "#10B981" },
            { label: { en: "I am here", de: "Ich bin da" }, icon: "map-pin" as const, color: "#38BDF8" },
            { label: { en: "Thinking of you", de: "Denke an dich" }, icon: "star" as const, color: "#F472B6" },
          ].map((btn, i) => (
            <Pressable
              key={i}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }}
              style={({ pressed }) => [
                styles.pulseBtn,
                { backgroundColor: btn.color + "12", borderColor: btn.color + "35", opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name={btn.icon} size={20} color={btn.color} />
              <Text style={[styles.pulseBtnText, { color: btn.color }]}>
                {lang === "de" ? btn.label.de : btn.label.en}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 },
  screenTitle: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5, marginBottom: 4 },
  screenSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 16 },
  divider: { height: 1, backgroundColor: "transparent", marginVertical: 28 },
  pulseZone: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 8 },
  auraContainer: { width: 140, height: 140, alignItems: "center", justifyContent: "center" },
  auraRing: { position: "absolute", width: 140, height: 140, borderRadius: 70 },
  auraCore: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, alignItems: "center", justifyContent: "center", shadowColor: "#10B981", shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  orbTool: { width: 80, height: 80, borderRadius: 20, borderWidth: 1.5, alignItems: "center", justifyContent: "center", gap: 6 },
  orbToolLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1 },
  notesCount: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", marginBottom: 4, fontStyle: "italic" },
  setCard: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 14, marginBottom: 12 },
  setTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  setUnitsLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 },
  setUnitsRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  setUnitsValue: { fontSize: 48, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  setUnitsMax: { fontSize: 18, fontFamily: "Inter_400Regular" },
  timerBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1, marginTop: 4 },
  timerText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  limitWarning: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 14, borderWidth: 1 },
  limitText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1, lineHeight: 19 },
  logBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 16 },
  logBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  redoseTip: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", fontStyle: "italic" },
  combosBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  combosBtnText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  pulseButtons: { gap: 10 },
  pulseBtn: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, borderRadius: 18, borderWidth: 1 },
  pulseBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  modalOverlay: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  modalClose: { position: "absolute", top: 56, right: 24, padding: 12, backgroundColor: "#ffffff20", borderRadius: 20 },
  breathTitle: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.5, marginBottom: 4 },
  breathCycles: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#ffffff80", marginBottom: 48, letterSpacing: 1.5, textTransform: "uppercase" },
  breathOrb: { width: 160, height: 160, borderRadius: 80, alignItems: "center", justifyContent: "center", marginBottom: 36 },
  breathOrbInner: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  breathPhaseLabel: { fontSize: 28, fontFamily: "Inter_700Bold", color: "#fff", letterSpacing: -0.5, textAlign: "center", marginBottom: 12 },
  breathHint: { fontSize: 12, fontFamily: "Inter_400Regular", color: "#ffffff70", textAlign: "center", letterSpacing: 0.5 },
  noteOverlay: { flex: 1, justifyContent: "flex-end" },
  noteCard: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, padding: 24, gap: 16 },
  noteHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  noteInput: { borderRadius: 16, borderWidth: 1, padding: 16, fontSize: 15, fontFamily: "Inter_400Regular", minHeight: 120, textAlignVertical: "top" },
  noteSaveBtn: { height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  noteSaveBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  comboOverlay: { flex: 1, padding: 20, paddingTop: 60 },
  comboHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  comboHeaderTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  comboCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 8 },
  comboTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  comboPair: { fontSize: 15, fontFamily: "Inter_700Bold" },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  riskText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.5 },
  comboBody: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
