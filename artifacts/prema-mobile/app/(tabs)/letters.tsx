import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession, useThemePreference } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const CONTENT = {
  en: {
    title: "Love Letters",
    sub: "A note to your future self",
    prompt: "What does your heart want to remember?",
    placeholder: "Dear me, when you read this…",
    seal: "Seal with Love",
    sealed: "Your letter is sealed",
    sealedSub: "Carry it gently through the night.",
    writeAnother: "Write another",
    past: "Sealed Letters",
    empty: "No letters yet. Write the first one above.",
  },
  de: {
    title: "Liebesbriefe",
    sub: "Eine Notiz an dein zukünftiges Ich",
    prompt: "Woran soll sich dein Herz erinnern?",
    placeholder: "Liebes Ich, wenn du das liest…",
    seal: "Mit Liebe versiegeln",
    sealed: "Dein Brief ist versiegelt",
    sealedSub: "Trage ihn sanft durch die Nacht.",
    writeAnother: "Noch einen schreiben",
    past: "Versiegelte Briefe",
    empty: "Noch keine Briefe. Schreibe oben den ersten.",
  },
};

const STORAGE_KEY = "prema_love_letters";

type Letter = { id: string; text: string; ts: number };

export default function LoveLettersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const vibe = useThemePreference();
  const accent = vibe === "dark" ? "#3DB879" : "#EC4899";

  const t = CONTENT[lang] || CONTENT.en;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const tabPad = Platform.OS === "web" ? 84 : insets.bottom + 64;

  const [text, setText] = useState("");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [justSealed, setJustSealed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setLetters(parsed);
        }
      } catch {}
    })();
  }, []);

  const handleSeal = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const next: Letter[] = [
      { id: String(Date.now()), text: trimmed, ts: Date.now() },
      ...letters,
    ];
    setLetters(next);
    setText("");
    setJustSealed(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.container, { paddingTop: topPad + 8, paddingBottom: tabPad + 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <View style={[styles.iconBadge, { backgroundColor: accent + "1A", borderColor: accent + "33" }]}>
              <Feather name="mail" size={26} color={accent} />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>{t.title}</Text>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>{t.sub}</Text>
          </View>

          {justSealed ? (
            <View style={[styles.sealedCard, { backgroundColor: accent + "14", borderColor: accent }]}>
              <Feather name="check-circle" size={30} color={accent} />
              <Text style={[styles.sealedTitle, { color: colors.foreground }]}>{t.sealed}</Text>
              <Text style={[styles.sealedSub, { color: colors.mutedForeground }]}>{t.sealedSub}</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setJustSealed(false);
                }}
                style={({ pressed }) => [
                  styles.ghostBtn,
                  { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Feather name="edit-3" size={14} color={colors.foreground} />
                <Text style={[styles.ghostBtnText, { color: colors.foreground }]}>{t.writeAnother}</Text>
              </Pressable>
            </View>
          ) : (
            <View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.prompt, { color: accent }]}>{t.prompt}</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder={t.placeholder}
                placeholderTextColor={colors.mutedForeground}
                multiline
                style={[styles.input, { color: colors.foreground }]}
                textAlignVertical="top"
              />
              <Pressable
                onPress={handleSeal}
                disabled={!text.trim()}
                style={({ pressed }) => [
                  styles.sealBtn,
                  {
                    backgroundColor: text.trim() ? accent : colors.muted,
                    opacity: pressed && text.trim() ? 0.88 : 1,
                  },
                ]}
              >
                <Feather name="heart" size={16} color={text.trim() ? "#FFFFFF" : colors.mutedForeground} />
                <Text
                  style={[
                    styles.sealBtnText,
                    { color: text.trim() ? "#FFFFFF" : colors.mutedForeground },
                  ]}
                >
                  {t.seal}
                </Text>
              </Pressable>
            </View>
          )}

          <Text style={[styles.pastTitle, { color: colors.mutedForeground }]}>{t.past.toUpperCase()}</Text>
          {letters.length === 0 ? (
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>{t.empty}</Text>
          ) : (
            <View style={styles.lettersList}>
              {letters.map((l) => (
                <View
                  key={l.id}
                  style={[styles.letterCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Text style={[styles.letterDate, { color: accent }]}>{formatDate(l.ts)}</Text>
                  <Text style={[styles.letterText, { color: colors.foreground }]}>{l.text}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerSection: { alignItems: "center", marginBottom: 22, gap: 8 },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: { fontSize: 22, fontFamily: "Nunito_700Bold", letterSpacing: -0.5 },
  sub: { fontSize: 12, fontFamily: "Nunito_500Medium", letterSpacing: 0.3 },
  composer: { borderRadius: 24, borderWidth: 1, padding: 20, gap: 16, marginBottom: 28 },
  prompt: { fontSize: 13, fontFamily: "Nunito_600SemiBold", letterSpacing: 0.3 },
  input: {
    minHeight: 140,
    fontSize: 15,
    fontFamily: "Nunito_500Medium",
    lineHeight: 23,
  },
  sealBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 999,
  },
  sealBtnText: { fontSize: 14, fontFamily: "Nunito_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  sealedCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 28,
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  sealedTitle: { fontSize: 18, fontFamily: "Nunito_700Bold", textAlign: "center" },
  sealedSub: { fontSize: 13, fontFamily: "Nunito_500Medium", textAlign: "center" },
  ghostBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginTop: 8,
  },
  ghostBtnText: { fontSize: 13, fontFamily: "Nunito_600SemiBold" },
  pastTitle: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 2, marginBottom: 12 },
  empty: { fontSize: 13, fontFamily: "Nunito_500Medium", fontStyle: "italic" },
  lettersList: { gap: 12 },
  letterCard: { borderRadius: 18, borderWidth: 1, padding: 18, gap: 8 },
  letterDate: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  letterText: { fontSize: 14, fontFamily: "Nunito_500Medium", lineHeight: 22 },
});
