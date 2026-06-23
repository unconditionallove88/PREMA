import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
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

const AFFIRMATIONS = {
  en: [
    "I respect myself",
    "I am love",
    "I accept myself fully",
    "Unity is presence",
    "Peace is now",
    "Love is everywhere",
    "I am exactly here",
    "Life is love",
  ],
  de: [
    "Ich respektiere mich",
    "Ich bin die Liebe",
    "Ich akzeptiere mich vollständig",
    "Einheit ist gegenwärtig",
    "Frieden ist jetzt",
    "Liebe ist überall",
    "Ich bin genau hier",
    "Leben ist Liebe",
  ],
};

const LOCATIONS = [
  { id: "berlin", name: "Berlin, DE", vibe: { en: "City Haven", de: "Stadt-Hafen" } },
  { id: "fusion", name: "Fusion Festival, DE", vibe: { en: "Gathering Resonance", de: "Versammlungs-Resonanz" } },
  { id: "london", name: "London, UK", vibe: { en: "City Haven", de: "Stadt-Hafen" } },
  { id: "ibiza", name: "Ibiza, ES", vibe: { en: "Island Resonance", de: "Insel-Resonanz" } },
  { id: "portugal", name: "Alentejo, PT", vibe: { en: "Nature Resonance", de: "Natur-Resonanz" } },
  { id: "lisbon", name: "Lisbon, PT", vibe: { en: "City Haven", de: "Stadt-Hafen" } },
];

function HeartStatusAura({ bpm }: { bpm: number }) {
  const colors = useColors();
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const beatMs = Math.max(450, 60000 / bpm);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.12, duration: beatMs * 0.35, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.75, duration: beatMs * 0.35, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: beatMs * 0.65, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.4, duration: beatMs * 0.65, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bpm, pulse, glow]);

  return (
    <View style={styles.auraWrap}>
      <Animated.View
        style={[
          styles.auraRing,
          { backgroundColor: colors.primary + "22", opacity: glow, transform: [{ scale: pulse }] },
        ]}
      />
      <Animated.View
        style={[
          styles.auraCore,
          {
            backgroundColor: colors.card,
            borderColor: colors.primary + "55",
            transform: [{ scale: pulse }],
          },
        ]}
      >
        <Feather name="heart" size={44} color={colors.primary} />
        <Text style={[styles.auraBpm, { color: colors.foreground }]}>{bpm}</Text>
        <Text style={[styles.auraBpmLabel, { color: colors.mutedForeground }]}>BPM</Text>
      </Animated.View>
    </View>
  );
}

type Tool = {
  label: { en: string; de: string };
  icon: React.ComponentProps<typeof Feather>["name"];
  tint: string;
  route: string;
};

const TOOLS: Tool[] = [
  { label: { en: "Access Guidance", de: "Zugangs-Leitfaden" }, icon: "sun", tint: "#3DB879", route: "/during" },
  { label: { en: "Supporter", de: "Unterstützer" }, icon: "compass", tint: "#10B981", route: "/(tabs)/phases" },
  { label: { en: "You Take", de: "Du nimmst" }, icon: "thermometer", tint: "#38BDF8", route: "/laboratory-test" },
  { label: { en: "Self-care", de: "Selbstfürsorge" }, icon: "wind", tint: "#8B5CF6", route: "/self-care" },
  { label: { en: "You See", de: "Du siehst" }, icon: "radio", tint: "#F59E0B", route: "/(tabs)/map" },
  { label: { en: "Circle of Love", de: "Kreis der Liebe" }, icon: "users", tint: "#EC4899", route: "/(tabs)/network" },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, userName, intention } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const [bpm] = useState(75);
  const [affirmation, setAffirmation] = useState("");
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [anchor, setAnchor] = useState(LOCATIONS[0]);
  const [distress, setDistress] = useState(false);

  const isDay = useMemo(() => {
    const h = new Date().getHours();
    return h >= 6 && h < 18;
  }, []);

  useEffect(() => {
    const pool = AFFIRMATIONS[lang];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => setDistress(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const name = userName || (lang === "de" ? "SEELE" : "HEART");

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingTop: topPad + 16, paddingBottom: botPad + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.shine, { color: colors.foreground }]} numberOfLines={1}>
              {lang === "de" ? `STRAHLE, ${name}` : `SHINE, ${name}`}
            </Text>
            <Feather name={isDay ? "sun" : "moon"} size={18} color={isDay ? "#FBBF24" : colors.mutedForeground} />
          </View>
          <Pressable
            onPress={() => router.push("/(tabs)/profile")}
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name="user" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Anchor */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAnchorOpen(true); }}
          style={[styles.anchorBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "33" }]}
        >
          <Feather name="map-pin" size={13} color={colors.primary} />
          <View>
            <Text style={[styles.anchorSub, { color: colors.mutedForeground }]}>
              {lang === "de" ? "Mesh Kontext" : "Mesh Context"}
            </Text>
            <Text style={[styles.anchorName, { color: colors.foreground }]}>{anchor.name}</Text>
          </View>
        </Pressable>

        {/* Collective Care distress alert */}
        {distress && (
          <View style={[styles.alert, { backgroundColor: colors.secondary + "1A", borderColor: colors.secondary }]}>
            <View style={[styles.alertIcon, { backgroundColor: colors.primary }]}>
              <Feather name="heart" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: colors.foreground }]}>
                {lang === "de" ? "Begleitung in der Nähe" : "Presence needed nearby"}
              </Text>
              <Text style={[styles.alertSub, { color: colors.primary }]}>
                {lang === "de" ? "Universelle Familie Mesh aktiv" : "Universal Family Mesh Active"}
              </Text>
            </View>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push("/(tabs)/map"); }}
              style={[styles.alertBtn, { backgroundColor: colors.card }]}
            >
              <Feather name="navigation" size={14} color={colors.primary} />
            </Pressable>
            <Pressable onPress={() => setDistress(false)} style={styles.alertClose} hitSlop={10}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        )}

        {/* Heart Status Aura */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/heart-status"); }}
          style={styles.auraSection}
        >
          <HeartStatusAura bpm={bpm} />
          {intention && (
            <View style={[styles.intentionBadge, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
              <Feather name="anchor" size={11} color={colors.primary} />
              <Text style={[styles.intentionText, { color: colors.primary }]}>{intention.replace("-", " ")}</Text>
            </View>
          )}
          <Text style={[styles.affirmation, { color: colors.primary }]}>{`"${affirmation}"`}</Text>
        </Pressable>

        {/* Tool grid */}
        <Text style={[styles.toolsLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "WERKZEUGE" : "YOUR TOOLS"}
        </Text>
        <View style={styles.toolGrid}>
          {TOOLS.map((tool) => (
            <Pressable
              key={tool.route + tool.label.en}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(tool.route as any); }}
              style={({ pressed }) => [
                styles.tool,
                { backgroundColor: tool.tint + "12", borderColor: tool.tint + "30", opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.tint + "20" }]}>
                <Feather name={tool.icon} size={20} color={tool.tint} />
              </View>
              <Text style={[styles.toolLabel, { color: colors.foreground }]}>{tool.label[lang]}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          {lang === "de" ? "In Harmonie erschaffen" : "Created in harmony"}
        </Text>
      </ScrollView>

      {/* Anchor modal */}
      <Modal visible={anchorOpen} transparent animationType="slide" onRequestClose={() => setAnchorOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              {lang === "de" ? "Prema Anker" : "Prema Anchor"}
            </Text>
            <Text style={[styles.modalSub, { color: colors.primary }]}>
              {lang === "de" ? "Mesh Kontext" : "Mesh Context"}
            </Text>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {LOCATIONS.map((loc) => {
                const selected = loc.id === anchor.id;
                return (
                  <Pressable
                    key={loc.id}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setAnchor(loc); setAnchorOpen(false); }}
                    style={[
                      styles.locRow,
                      { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primary + "12" : "transparent" },
                    ]}
                  >
                    <View>
                      <Text style={[styles.locName, { color: colors.foreground }]}>{loc.name}</Text>
                      <Text style={[styles.locVibe, { color: colors.mutedForeground }]}>{loc.vibe[lang]}</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={selected ? colors.primary : colors.mutedForeground} />
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable
              onPress={() => setAnchorOpen(false)}
              style={[styles.modalBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.modalBtnText}>{lang === "de" ? "Anker setzen" : "Calibrate Anchor"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, marginRight: 12 },
  shine: { fontSize: 20, fontFamily: "Inter_700Bold", letterSpacing: -0.3, textTransform: "uppercase", flexShrink: 1 },
  iconBtn: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  anchorBtn: { flexDirection: "row", alignItems: "center", gap: 10, alignSelf: "flex-start", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, marginBottom: 16 },
  anchorSub: { fontSize: 8, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, textTransform: "uppercase" },
  anchorName: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase" },
  alert: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 24, borderWidth: 2, marginBottom: 20, position: "relative" },
  alertIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  alertTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: -0.2 },
  alertSub: { fontSize: 8, fontFamily: "Inter_600SemiBold", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 },
  alertBtn: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  alertClose: { position: "absolute", top: 8, right: 8 },
  auraSection: { alignItems: "center", marginVertical: 20, gap: 14 },
  auraWrap: { width: 200, height: 200, alignItems: "center", justifyContent: "center" },
  auraRing: { position: "absolute", width: 200, height: 200, borderRadius: 100 },
  auraCore: { width: 130, height: 130, borderRadius: 65, borderWidth: 2, alignItems: "center", justifyContent: "center", gap: 2, shadowColor: "#10B981", shadowOpacity: 0.3, shadowRadius: 24, shadowOffset: { width: 0, height: 0 }, elevation: 8 },
  auraBpm: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 2 },
  auraBpmLabel: { fontSize: 8, fontFamily: "Inter_600SemiBold", letterSpacing: 2 },
  intentionBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  intentionText: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "capitalize", letterSpacing: 0.5 },
  affirmation: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontStyle: "italic", textTransform: "uppercase", letterSpacing: 1.5, textAlign: "center", opacity: 0.85, paddingHorizontal: 24 },
  toolsLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, textAlign: "center" },
  toolGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  tool: { width: "31%", alignItems: "center", paddingVertical: 16, paddingHorizontal: 6, borderRadius: 18, borderWidth: 1, gap: 8 },
  toolIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  toolLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  footer: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 4, textTransform: "uppercase", textAlign: "center", opacity: 0.5 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 36, borderTopRightRadius: 36, borderWidth: 1, padding: 28, gap: 4 },
  modalTitle: { fontSize: 24, fontFamily: "Inter_700Bold", textTransform: "uppercase", textAlign: "center" },
  modalSub: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 3, textTransform: "uppercase", textAlign: "center", marginBottom: 16 },
  locRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, borderRadius: 22, borderWidth: 2, marginBottom: 10 },
  locName: { fontSize: 15, fontFamily: "Inter_600SemiBold", textTransform: "uppercase" },
  locVibe: { fontSize: 9, fontFamily: "Inter_500Medium", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 },
  modalBtn: { height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center", marginTop: 12 },
  modalBtnText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 2, textTransform: "uppercase" },
});
