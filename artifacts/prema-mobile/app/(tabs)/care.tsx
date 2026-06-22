import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
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

const SURVEY_QUESTIONS = [
  {
    key: "q1",
    en: "How did Prema support you during your experience?",
    de: "Wie hat Prema dich während deiner Erfahrung unterstützt?",
  },
  {
    key: "q2",
    en: "What tool did you find most helpful tonight?",
    de: "Welches Tool war heute Nacht am hilfreichsten für dich?",
  },
  {
    key: "q3",
    en: "What would you like to see next in Prema?",
    de: "Was möchtest du als nächstes in Prema sehen?",
  },
  {
    key: "q4",
    en: "One word to describe your night?",
    de: "Ein Wort für deine Nacht?",
  },
];

export default function AttentionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, quickNotes, addQuickNote, journalEntries, addJournalEntry } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [journalText, setJournalText] = useState("");
  const [journalExpanded, setJournalExpanded] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [surveySubmitted, setSurveySubmitted] = useState(false);
  const [featureVote, setFeatureVote] = useState<string | null>(null);

  const saveJournalEntry = () => {
    if (!journalText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addJournalEntry(journalText.trim());
    setJournalText("");
    setJournalExpanded(false);
  };

  const submitSurvey = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSurveySubmitted(true);
  };

  const allEntries = [
    ...quickNotes.map((n) => ({ text: n.text, ts: n.ts, type: "quick" as const })),
    ...journalEntries.map((e) => ({ text: e.text, ts: e.ts, type: "journal" as const })),
  ].sort((a, b) => b.ts - a.ts);

  const FEATURE_OPTIONS = [
    { key: "heartrate", en: "Heart Rate Monitor", de: "Herzfrequenz-Monitor" },
    { key: "map", en: "Venue Map", de: "Veranstaltungsort-Karte" },
    { key: "lab", en: "Lab Testing Locator", de: "Labor-Test-Finder" },
    { key: "chat", en: "Love Circle Chat", de: "Kreis-der-Liebe-Chat" },
    { key: "integration", en: "Wearable Integration", de: "Wearable-Integration" },
  ];

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
      {/* ── PHASE LABEL ── */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        {lang === "de" ? "PHASE 3 · ATTENTION" : "PHASE 3 · ATTENTION"}
      </Text>
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>
        {lang === "de" ? "Liebesbriefe" : "Love Letters"}
      </Text>
      <Text style={[styles.screenSub, { color: colors.mutedForeground }]}>
        {lang === "de"
          ? "Halte fest, was du gespürt und gelernt hast"
          : "Record what you felt and learned"}
      </Text>

      {/* ── NEW ENTRY ── */}
      {!journalExpanded ? (
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setJournalExpanded(true); }}
          style={[styles.newEntryBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="edit-3" size={18} color={colors.mutedForeground} />
          <Text style={[styles.newEntryPlaceholder, { color: colors.mutedForeground }]}>
            {lang === "de" ? "Neue Reflexion schreiben..." : "Write a new reflection..."}
          </Text>
        </Pressable>
      ) : (
        <View style={[styles.editorCard, { backgroundColor: colors.card, borderColor: colors.primary + "40" }]}>
          <TextInput
            style={[styles.editorInput, { color: colors.foreground }]}
            placeholder={lang === "de" ? "Was bewegte dich heute Nacht..." : "What moved you tonight..."}
            placeholderTextColor={colors.mutedForeground}
            multiline
            autoFocus
            value={journalText}
            onChangeText={setJournalText}
          />
          <View style={styles.editorActions}>
            <Pressable onPress={() => { setJournalExpanded(false); setJournalText(""); }} style={styles.editorCancel}>
              <Text style={[styles.editorCancelText, { color: colors.mutedForeground }]}>
                {lang === "de" ? "Abbrechen" : "Cancel"}
              </Text>
            </Pressable>
            <Pressable
              onPress={saveJournalEntry}
              style={[styles.editorSave, { backgroundColor: colors.primary, opacity: journalText.trim() ? 1 : 0.4 }]}
            >
              <Feather name="heart" size={14} color={colors.primaryForeground} />
              <Text style={[styles.editorSaveText, { color: colors.primaryForeground }]}>
                {lang === "de" ? "Speichern" : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ── ENTRIES LIST ── */}
      {allEntries.length > 0 && (
        <View style={styles.entriesList}>
          {allEntries.map((entry, i) => (
            <View
              key={i}
              style={[
                styles.entryCard,
                {
                  backgroundColor: entry.type === "quick" ? colors.card : colors.primary + "08",
                  borderColor: entry.type === "quick" ? colors.border : colors.primary + "25",
                },
              ]}
            >
              <View style={styles.entryHeader}>
                <Feather
                  name={entry.type === "quick" ? "zap" : "book-open"}
                  size={12}
                  color={entry.type === "quick" ? colors.mutedForeground : colors.primary}
                />
                <Text style={[styles.entryMeta, { color: colors.mutedForeground }]}>
                  {entry.type === "quick"
                    ? lang === "de" ? "Schnellnotiz" : "Quick note"
                    : lang === "de" ? "Reflexion" : "Reflection"}{" "}
                  · {new Date(entry.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
              <Text style={[styles.entryText, { color: colors.foreground }]}>{entry.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── CREATE / YOU SPEAK ── */}
      <View style={styles.divider} />
      <View style={[styles.createHeader, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }]}>
        <Feather name="message-circle" size={18} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.createTitle, { color: colors.foreground }]}>
            {lang === "de" ? "Du sprichst" : "You Speak"}
          </Text>
          <Text style={[styles.createSub, { color: colors.mutedForeground }]}>
            {lang === "de"
              ? "Deine Stimme hilft uns zu wachsen. Diese Daten unterstützen unsere Master-Thesis-Forschung über bewusstes Nachtleben."
              : "Your voice helps us grow. This data supports our Master's Thesis research on conscious nightlife."}
          </Text>
        </View>
      </View>

      {!surveySubmitted ? (
        <>
          <View style={styles.surveyList}>
            {SURVEY_QUESTIONS.map((q) => (
              <View key={q.key} style={styles.surveyItem}>
                <Text style={[styles.surveyQuestion, { color: colors.foreground }]}>
                  {lang === "de" ? q.de : q.en}
                </Text>
                <TextInput
                  style={[styles.surveyInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
                  placeholder={lang === "de" ? "Deine Antwort..." : "Your answer..."}
                  placeholderTextColor={colors.mutedForeground}
                  value={answers[q.key] || ""}
                  onChangeText={(t) => setAnswers((prev) => ({ ...prev, [q.key]: t }))}
                  multiline
                />
              </View>
            ))}
          </View>

          <Text style={[styles.voteLabel, { color: colors.mutedForeground }]}>
            {lang === "de" ? "WAS MÖCHTEST DU ALS NÄCHSTES SEHEN?" : "WHAT DO YOU WANT TO SEE NEXT?"}
          </Text>
          <View style={styles.voteGrid}>
            {FEATURE_OPTIONS.map((opt) => {
              const active = featureVote === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => { Haptics.selectionAsync(); setFeatureVote(active ? null : opt.key); }}
                  style={[
                    styles.voteBtn,
                    {
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.voteBtnText, { color: active ? colors.primaryForeground : colors.foreground }]}>
                    {lang === "de" ? opt.de : opt.en}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={submitSurvey}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="send" size={16} color={colors.primaryForeground} />
            <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>
              {lang === "de" ? "Feedback senden" : "Send Feedback"}
            </Text>
          </Pressable>
        </>
      ) : (
        <View style={[styles.thankYouCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "25" }]}>
          <Feather name="check-circle" size={32} color={colors.primary} />
          <Text style={[styles.thankYouTitle, { color: colors.foreground }]}>
            {lang === "de" ? "Danke schön" : "Thank you"}
          </Text>
          <Text style={[styles.thankYouBody, { color: colors.mutedForeground }]}>
            {lang === "de"
              ? "Deine Stimme hilft uns, Prema für alle zu verbessern."
              : "Your voice helps us make Prema better for everyone."}
          </Text>
        </View>
      )}
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 },
  screenTitle: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.5, marginBottom: 4 },
  screenSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, marginBottom: 20 },
  divider: { height: 1, backgroundColor: "transparent", marginVertical: 28 },
  newEntryBtn: { flexDirection: "row", alignItems: "center", gap: 12, padding: 18, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  newEntryPlaceholder: { fontSize: 14, fontFamily: "Inter_400Regular" },
  editorCard: { borderRadius: 20, borderWidth: 1.5, padding: 16, gap: 12, marginBottom: 16 },
  editorInput: { fontSize: 15, fontFamily: "Inter_400Regular", minHeight: 120, lineHeight: 24, textAlignVertical: "top" },
  editorActions: { flexDirection: "row", gap: 10, justifyContent: "flex-end" },
  editorCancel: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  editorCancelText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  editorSave: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  editorSaveText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  entriesList: { gap: 10, marginBottom: 4 },
  entryCard: { padding: 16, borderRadius: 18, borderWidth: 1, gap: 8 },
  entryHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  entryMeta: { fontSize: 11, fontFamily: "Inter_400Regular", letterSpacing: 0.3 },
  entryText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 21 },
  createHeader: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
  createTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  createSub: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  surveyList: { gap: 16, marginBottom: 24 },
  surveyItem: { gap: 8 },
  surveyQuestion: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  surveyInput: { borderRadius: 14, borderWidth: 1, padding: 14, fontSize: 14, fontFamily: "Inter_400Regular", minHeight: 70, textAlignVertical: "top" },
  voteLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 12 },
  voteGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  voteBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, borderWidth: 1.5 },
  voteBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 54, borderRadius: 16 },
  submitBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  thankYouCard: { alignItems: "center", padding: 32, borderRadius: 24, borderWidth: 1, gap: 12 },
  thankYouTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  thankYouBody: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
});
