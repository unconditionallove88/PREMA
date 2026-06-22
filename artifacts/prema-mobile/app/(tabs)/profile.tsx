import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Phase, useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const PHASE_CONFIG: { id: Phase; en: string; de: string; color: string; icon: React.ComponentProps<typeof Feather>["name"] }[] = [
  { id: "before", en: "Intention", de: "Intention", color: "#F59E0B", icon: "target" },
  { id: "during", en: "Action", de: "Action", color: "#10B981", icon: "zap" },
  { id: "recovery", en: "Attention", de: "Attention", color: "#8B5CF6", icon: "moon" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, setLang, phase, setPhase, resetSession } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: topPad + 24, paddingBottom: botPad + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.card, borderColor: colors.primary + "40" },
          ]}
        >
          <Feather name="heart" size={40} color={colors.primary} />
        </View>
        <View
          style={[styles.avatarGlow, { backgroundColor: colors.primary + "15" }]}
        />
        <Text style={[styles.avatarTitle, { color: colors.foreground }]}>
          {lang === "de" ? "Mein Kreis" : "My Circle"}
        </Text>
        <Text style={[styles.avatarSub, { color: colors.mutedForeground }]}>
          {lang === "de" ? "Präsent. Bewusst. Verantwortlich." : "Present. Aware. Responsible."}
        </Text>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "SPRACHE" : "LANGUAGE"}
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="globe" size={16} color={colors.mutedForeground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>
                {lang === "de" ? "Deutsch" : "English"}
              </Text>
            </View>
            <Switch
              value={lang === "de"}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setLang(v ? "de" : "en");
              }}
              trackColor={{ false: colors.muted, true: colors.primary + "80" }}
              thumbColor={lang === "de" ? colors.primary : colors.mutedForeground}
            />
          </View>
        </View>
      </View>

      {/* Current Phase */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "AKTUELLE PHASE" : "CURRENT PHASE"}
        </Text>
        <View style={styles.phaseGrid}>
          {PHASE_CONFIG.map((p) => {
            const active = phase === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPhase(p.id);
                }}
                style={({ pressed }) => [
                  styles.phaseCard,
                  {
                    backgroundColor: active ? p.color + "18" : colors.card,
                    borderColor: active ? p.color + "50" : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Feather name={p.icon} size={18} color={active ? p.color : colors.mutedForeground} />
                <Text
                  style={[
                    styles.phaseLabel,
                    { color: active ? p.color : colors.mutedForeground },
                  ]}
                >
                  {lang === "de" ? p.de : p.en}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Reset */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "SESSION" : "SESSION"}
        </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            resetSession();
          }}
          style={({ pressed }) => [
            styles.resetBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Feather name="refresh-cw" size={15} color={colors.mutedForeground} />
          <Text style={[styles.resetLabel, { color: colors.foreground }]}>
            {lang === "de" ? "Session zurücksetzen" : "Reset Session"}
          </Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          PREMA · {lang === "de" ? "Mit Liebe" : "With Love"} · v1.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 36,
    position: "relative",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    zIndex: 1,
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  avatarGlow: {
    position: "absolute",
    top: 0,
    width: 88,
    height: 88,
    borderRadius: 44,
    transform: [{ scale: 1.8 }],
    zIndex: 0,
  },
  avatarTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  avatarSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  phaseGrid: {
    flexDirection: "row",
    gap: 10,
  },
  phaseCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
  },
  phaseLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  resetLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
  },
});
