import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const CONTENT = {
  en: {
    back: "BACK",
    header: "Sovereign Lab Check",
    sub: "Test your drugs anonymously",
    desc: "I love and respect my body. Before the party, visit our contract laboratories for high-fidelity anonymous analysis.",
    labsTitle: "Contract Laboratories",
    btn: "Book Anonymous Check",
    confirm: "I value my health",
    anonCode: "Your Anonymous ID",
    steps: [
      "Select a laboratory partner",
      "Generate a zero-identity code",
      "Drop off sample anonymously",
      "View results in the private space",
    ],
    footer: "Created in harmony",
  },
  de: {
    back: "ZURÜCK",
    header: "Labor Check",
    sub: "Drogen anonym testen",
    desc: "Ich achte meinen Körper. Besuche vor der Party unsere Vertragslabore für eine hochpräzise, anonyme Analyse.",
    labsTitle: "Partner Laboratorien",
    btn: "Anonymen Check buchen",
    confirm: "Ich schätze meine Gesundheit",
    anonCode: "Deine anonyme ID",
    steps: [
      "Wähle einen Labor-Partner",
      "Erstelle einen anonymen Code",
      "Probe anonym abgeben",
      "Ergebnisse im privaten Raum sehen",
    ],
    footer: "In Harmonie erschaffen",
  },
};

const LABS = [
  { id: "mitte", name: "Prema Lab Mitte", address: "Torstraße, Berlin" },
  { id: "xberg", name: "Resonance Lab X-Berg", address: "Skalitzer Str, Berlin" },
];

const STORAGE_KEY = "prema_lab_logs";

export default function LaboratoryTestScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();

  const t = CONTENT[lang] || CONTENT.en;

  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const logs = JSON.parse(raw);
          if (Array.isArray(logs) && logs.length > 0) {
            const latest = logs[0];
            if (latest?.code) {
              setBookingCode(latest.code);
              setSelectedLab(latest.lab ?? null);
            }
          }
        }
      } catch {}
    })();
  }, []);

  const handleBook = () => {
    if (!selectedLab || isBooking) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsBooking(true);
    setTimeout(async () => {
      const code = "SAN-" + Math.random().toString(36).substring(7).toUpperCase();
      setBookingCode(code);
      setIsBooking(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const logs = raw ? JSON.parse(raw) : [];
        const next = [{ code, lab: selectedLab, ts: Date.now() }, ...(Array.isArray(logs) ? logs : [])];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
    }, 1500);
  };

  const handleComplete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      {/* Header with back button */}
      <View style={[styles.headerBar, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          hitSlop={10}
        >
          <Feather name="arrow-left" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>{t.back}</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingBottom: botPad + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primary + "1A", borderColor: colors.primary + "33" }]}>
            <Feather name="thermometer" size={30} color={colors.primary} />
          </View>
          <Text style={[styles.header, { color: colors.foreground }]}>{t.header}</Text>
          <Text style={[styles.sub, { color: colors.primary }]}>{t.sub.toUpperCase()}</Text>
        </View>

        {/* Description + steps card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.desc, { color: colors.mutedForeground }]}>"{t.desc}"</Text>
          <View style={styles.stepsList}>
            {t.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={[styles.stepNum, { backgroundColor: colors.primary + "33", borderColor: colors.primary + "4D" }]}>
                  <Text style={[styles.stepNumText, { color: colors.primary }]}>{i + 1}</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.mutedForeground }]}>{step}</Text>
              </View>
            ))}
          </View>
        </View>

        {!bookingCode ? (
          <View style={styles.bookingSection}>
            <Text style={[styles.labsTitle, { color: colors.mutedForeground }]}>{t.labsTitle.toUpperCase()}</Text>
            <View style={styles.labsList}>
              {LABS.map((lab) => {
                const active = selectedLab === lab.id;
                return (
                  <Pressable
                    key={lab.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedLab(lab.id);
                    }}
                    style={({ pressed }) => [
                      styles.labCard,
                      {
                        backgroundColor: active ? colors.primary + "14" : colors.card,
                        borderColor: active ? colors.primary : colors.border,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.labName, { color: colors.foreground }]}>{lab.name}</Text>
                      <Text style={[styles.labAddress, { color: colors.mutedForeground }]}>{lab.address.toUpperCase()}</Text>
                    </View>
                    {active && <Feather name="check-circle" size={20} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={handleBook}
              disabled={!selectedLab || isBooking}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: selectedLab ? colors.primary : colors.card,
                  borderColor: selectedLab ? colors.primary : colors.border,
                  opacity: pressed && selectedLab ? 0.88 : 1,
                },
              ]}
            >
              {isBooking ? (
                <ActivityIndicator color={selectedLab ? colors.primaryForeground : colors.mutedForeground} />
              ) : (
                <Text
                  style={[
                    styles.primaryBtnText,
                    { color: selectedLab ? colors.primaryForeground : colors.mutedForeground },
                  ]}
                >
                  {t.btn}
                </Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={styles.resultSection}>
            <View style={[styles.codeCard, { backgroundColor: colors.primary + "14", borderColor: colors.primary }]}>
              <Feather name="lock" size={30} color={colors.primary} />
              <Text style={[styles.anonLabel, { color: colors.primary }]}>{t.anonCode.toUpperCase()}</Text>
              <Text style={[styles.code, { color: colors.foreground }]}>{bookingCode}</Text>
            </View>
            <Pressable
              onPress={handleComplete}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.foreground }]}>{t.confirm}</Text>
            </Pressable>
          </View>
        )}

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>{t.footer.toUpperCase()}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBar: { paddingHorizontal: 20, paddingBottom: 8 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  backText: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 2 },
  container: { paddingHorizontal: 20, paddingTop: 8 },
  titleSection: { alignItems: "center", marginTop: 12, marginBottom: 24 },
  iconBadge: { width: 64, height: 64, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  header: { fontSize: 22, fontFamily: "Nunito_700Bold", textAlign: "center", letterSpacing: -0.5, marginBottom: 6 },
  sub: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 3, textAlign: "center" },
  infoCard: { borderRadius: 24, borderWidth: 1, padding: 22, marginBottom: 24, gap: 18 },
  desc: { fontSize: 13, fontFamily: "Nunito_500Medium", fontStyle: "italic", lineHeight: 21 },
  stepsList: { gap: 12 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepNum: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  stepNumText: { fontSize: 11, fontFamily: "Nunito_700Bold" },
  stepText: { flex: 1, fontSize: 11, fontFamily: "Nunito_600SemiBold", letterSpacing: 1.5, textTransform: "uppercase" },
  bookingSection: { gap: 18 },
  labsTitle: { fontSize: 9, fontFamily: "Nunito_600SemiBold", letterSpacing: 3, marginBottom: 2 },
  labsList: { gap: 12 },
  labCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 20, borderRadius: 18, borderWidth: 2 },
  labName: { fontSize: 14, fontFamily: "Nunito_700Bold", textTransform: "uppercase" },
  labAddress: { fontSize: 9, fontFamily: "Nunito_600SemiBold", letterSpacing: 1.5, marginTop: 4 },
  primaryBtn: { height: 64, borderRadius: 999, borderWidth: 1, alignItems: "center", justifyContent: "center", marginTop: 6 },
  primaryBtnText: { fontSize: 16, fontFamily: "Nunito_700Bold", letterSpacing: 2, textTransform: "uppercase" },
  resultSection: { gap: 24 },
  codeCard: { borderRadius: 28, borderWidth: 2, padding: 28, alignItems: "center", gap: 14 },
  anonLabel: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 4, textAlign: "center" },
  code: { fontSize: 34, fontFamily: "Nunito_700Bold", letterSpacing: -1, textAlign: "center" },
  footer: { fontSize: 8, fontFamily: "Nunito_700Bold", letterSpacing: 4, textAlign: "center", marginTop: 32 },
});
