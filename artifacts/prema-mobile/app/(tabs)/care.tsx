import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const TIPS = [
  {
    iconName: "phone" as const,
    tint: "#10B981",
    en: { title: "Emergency Contact", body: "Local emergency: 112 (EU) / 911 (US). Festival medical: check your festival map." },
    de: { title: "Notfallkontakt", body: "Lokaler Notfall: 112 (EU). Festival-Sanitäter: Festivalplan prüfen." },
  },
  {
    iconName: "droplet" as const,
    tint: "#38BDF8",
    en: { title: "Overheating Signs", body: "Hot dry skin, confusion, no sweating — move to shade, sip water, call for help." },
    de: { title: "Überhitzungszeichen", body: "Heiße trockene Haut, Verwirrung, kein Schwitzen — in den Schatten, Wasser trinken, Hilfe rufen." },
  },
  {
    iconName: "alert-triangle" as const,
    tint: "#F59E0B",
    en: { title: "Difficult Experience", body: "Find a quiet space. Slow breathing. Ground with 5-4-3-2-1 senses. Ask for a buddy." },
    de: { title: "Schwierige Erfahrung", body: "Einen ruhigen Ort finden. Langsam atmen. Geerdet mit 5-4-3-2-1 Sinnen. Einen Buddy bitten." },
  },
  {
    iconName: "users" as const,
    tint: "#A78BFA",
    en: { title: "Care Team", body: "Festival care workers are non-judgmental. Find their tent on the festival map." },
    de: { title: "Fürsorge-Team", body: "Festival-Fürsorge-Mitarbeiter sind nicht wertend. Ihr Zelt auf dem Festivalplan finden." },
  },
  {
    iconName: "moon" as const,
    tint: "#8B5CF6",
    en: { title: "Rest Protocol", body: "If exhausted — find shade, lie down, ask a friend to stay with you, drink water slowly." },
    de: { title: "Ruheprotokoll", body: "Bei Erschöpfung — Schatten finden, hinlegen, Freund bitten zu bleiben, langsam Wasser trinken." },
  },
];

export default function CareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const [sosPressed, setSosPressed] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSOS = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSosPressed(true);
    Alert.alert(
      lang === "de" ? "Hilfe anfordern?" : "Request Help?",
      lang === "de"
        ? "In einem echten Notfall ruf sofort 112. Soll diese App dein Netzwerk benachrichtigen?"
        : "In a real emergency call 112 immediately. Should this app notify your care network?",
      [
        { text: lang === "de" ? "Abbrechen" : "Cancel", style: "cancel", onPress: () => setSosPressed(false) },
        {
          text: lang === "de" ? "Hilfe senden" : "Send Help",
          style: "destructive",
          onPress: () => setSosPressed(false),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: topPad + 24, paddingBottom: botPad + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={[styles.screenLabel, { color: colors.mutedForeground }]}>
        {lang === "de" ? "FÜRSORGE" : "CARE"}
      </Text>
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>
        {lang === "de" ? "Du bist nicht allein" : "You are not alone"}
      </Text>

      {/* SOS Button */}
      <Pressable
        onPress={handleSOS}
        style={({ pressed }) => [
          styles.sosBtn,
          {
            backgroundColor: sosPressed ? "#EF4444" : "#EF444415",
            borderColor: "#EF444440",
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.97 : 1 }],
          },
        ]}
      >
        <View style={[styles.sosIcon, { backgroundColor: "#EF444420" }]}>
          <Feather name="alert-circle" size={28} color="#EF4444" />
        </View>
        <Text style={[styles.sosTitle, { color: sosPressed ? "#fff" : "#EF4444" }]}>
          {lang === "de" ? "Hilfe anfordern" : "Request Help"}
        </Text>
        <Text style={[styles.sosSub, { color: sosPressed ? "#fff" : "#EF444499" }]}>
          {lang === "de" ? "Notfall-Fürsorge aktivieren" : "Activate emergency care"}
        </Text>
      </Pressable>

      {/* Breath reminder */}
      <View
        style={[
          styles.breathCard,
          { backgroundColor: colors.primary + "10", borderColor: colors.primary + "25" },
        ]}
      >
        <Feather name="wind" size={20} color={colors.primary} />
        <Text style={[styles.breathText, { color: colors.primary }]}>
          {lang === "de"
            ? "Atme ein für 4 Zähler. Halte für 4. Atme aus für 6."
            : "Breathe in for 4 counts. Hold for 4. Out for 6."}
        </Text>
      </View>

      {/* Tips */}
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        {lang === "de" ? "FÜRSORGE-WISSEN" : "CARE KNOWLEDGE"}
      </Text>
      <View style={styles.tips}>
        {TIPS.map((tip, i) => {
          const label = lang === "de" ? tip.de : tip.en;
          return (
            <View
              key={i}
              style={[
                styles.tipCard,
                { backgroundColor: tip.tint + "0D", borderColor: tip.tint + "25" },
              ]}
            >
              <View
                style={[styles.tipIcon, { backgroundColor: tip.tint + "20" }]}
              >
                <Feather name={tip.iconName} size={16} color={tip.tint} />
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: tip.tint }]}>
                  {label.title}
                </Text>
                <Text style={[styles.tipBody, { color: colors.mutedForeground }]}>
                  {label.body}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  screenLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  sosBtn: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  sosIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  sosTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
  sosSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
  },
  breathCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 28,
  },
  breathText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 22,
    fontStyle: "italic",
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  tips: {
    gap: 10,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  tipContent: {
    flex: 1,
    gap: 4,
  },
  tipTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  tipBody: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
