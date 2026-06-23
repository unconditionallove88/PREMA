import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { Text } from "@/components/Text";
import { useSession, useThemePreference } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

type IconName = React.ComponentProps<typeof Feather>["name"];

// When the survey (e.g. a Typeform) link is ready, drop it here and the survey
// card turns into an active "open survey" button automatically.
const SURVEY_URL = "";

const SECTIONS: { key: string; icon: IconName }[] = [
  { key: "cocreate", icon: "feather" },
  { key: "feedback", icon: "message-circle" },
  { key: "survey", icon: "clipboard" },
];

const CONTENT = {
  en: {
    title: "Create",
    sub: "Shape prema with us",
    soon: "Coming soon",
    openSurvey: "Open survey",
    cocreate: {
      title: "Co-create",
      body: "Have an idea for a feature or a resource the community needs? This is where you'll help shape what prema becomes.",
    },
    feedback: {
      title: "Feedback",
      body: "Tell us how prema feels to use — what soothes, what's missing, what could be gentler. Your words guide the next steps.",
    },
    survey: {
      title: "The prema survey",
      body: "A short, anonymous questionnaire about your experience. It helps us understand the community and care better.",
    },
  },
  de: {
    title: "Mitgestalten",
    sub: "Gestalte prema mit uns",
    soon: "Bald verfügbar",
    openSurvey: "Umfrage öffnen",
    cocreate: {
      title: "Mitgestalten",
      body: "Hast du eine Idee für eine Funktion oder eine Ressource, die die Community braucht? Hier hilfst du, prema zu formen.",
    },
    feedback: {
      title: "Feedback",
      body: "Erzähl uns, wie sich prema anfühlt — was guttut, was fehlt, was sanfter sein könnte. Dein Wort leitet die nächsten Schritte.",
    },
    survey: {
      title: "Die prema-Umfrage",
      body: "Ein kurzer, anonymer Fragebogen über deine Erfahrung. Er hilft uns, die Community und Fürsorge besser zu verstehen.",
    },
  },
};

export default function CreateScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const vibe = useThemePreference();
  const accent = vibe === "dark" ? "#3DB879" : "#EC4899";
  const t = CONTENT[lang] || CONTENT.en;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const tabPad = Platform.OS === "web" ? 84 : insets.bottom + 64;

  const surveyReady = SURVEY_URL.length > 0;
  const openSurvey = () => {
    if (!surveyReady) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(SURVEY_URL);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingTop: topPad + 8, paddingBottom: tabPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.foreground }]}>{t.title}</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>{t.sub}</Text>
        </View>

        {SECTIONS.map((s) => {
          const copy = t[s.key as "cocreate" | "feedback" | "survey"];
          const isSurvey = s.key === "survey";
          const active = isSurvey && surveyReady;
          return (
            <View key={s.key} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={[styles.cardIcon, { backgroundColor: accent + "1A" }]}>
                  <Feather name={s.icon} size={20} color={accent} />
                </View>
                {!active && (
                  <View style={[styles.soonTag, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.soonText, { color: colors.mutedForeground }]}>{t.soon}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>{copy.title}</Text>
              <Text style={[styles.cardBody, { color: colors.mutedForeground }]}>{copy.body}</Text>

              {isSurvey && (
                <Pressable
                  onPress={openSurvey}
                  disabled={!active}
                  style={({ pressed }) => [
                    styles.surveyBtn,
                    {
                      backgroundColor: active ? accent : colors.muted,
                      opacity: pressed && active ? 0.88 : 1,
                    },
                  ]}
                >
                  <Feather name="external-link" size={15} color={active ? "#FFFFFF" : colors.mutedForeground} />
                  <Text style={[styles.surveyBtnText, { color: active ? "#FFFFFF" : colors.mutedForeground }]}>
                    {t.openSurvey}
                  </Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  headerSection: { alignItems: "center", marginBottom: 20, gap: 6 },
  title: { fontSize: 22, fontFamily: "Nunito_700Bold", letterSpacing: -0.5 },
  sub: { fontSize: 12, fontFamily: "Nunito_500Medium", letterSpacing: 0.3 },
  card: { borderRadius: 24, borderWidth: 1, padding: 20, marginBottom: 16, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  soonTag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 },
  soonText: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 0.5, textTransform: "uppercase" },
  cardTitle: { fontSize: 16, fontFamily: "Nunito_700Bold" },
  cardBody: { fontSize: 13, fontFamily: "Nunito_500Medium", lineHeight: 20 },
  surveyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 999,
    marginTop: 6,
  },
  surveyBtnText: { fontSize: 13, fontFamily: "Nunito_700Bold", letterSpacing: 1, textTransform: "uppercase" },
});
