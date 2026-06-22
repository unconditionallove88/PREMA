import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
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

function HeartOrb() {
  const colors = useColors();
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const opacity1 = useRef(new Animated.Value(0.4)).current;
  const opacity2 = useRef(new Animated.Value(0.25)).current;
  const opacity3 = useRef(new Animated.Value(0.12)).current;

  useEffect(() => {
    const anim = (scale: Animated.Value, opacity: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1.6, duration: 2200, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 2200, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, {
              toValue: delay === 0 ? 0.4 : delay === 500 ? 0.25 : 0.12,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    const a1 = anim(pulse1, opacity1, 0);
    const a2 = anim(pulse2, opacity2, 500);
    const a3 = anim(pulse3, opacity3, 1000);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, [pulse1, pulse2, pulse3, opacity1, opacity2, opacity3]);

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[styles.pulseRing, { backgroundColor: colors.primary + "20", transform: [{ scale: pulse3 }], opacity: opacity3 }]} />
      <Animated.View style={[styles.pulseRing, { backgroundColor: colors.primary + "30", transform: [{ scale: pulse2 }], opacity: opacity2 }]} />
      <Animated.View style={[styles.pulseRing, { backgroundColor: colors.primary + "40", transform: [{ scale: pulse1 }], opacity: opacity1 }]} />
      <View style={[styles.orbCore, { backgroundColor: colors.card, borderColor: colors.primary + "40" }]}>
        <Feather name="heart" size={36} color={colors.primary} />
      </View>
    </View>
  );
}

const PHASE_LABELS = {
  before:   { en: "Intention",  de: "Intention",  icon: "target" as const,  color: "#F59E0B" },
  during:   { en: "Action",     de: "Action",     icon: "zap" as const,     color: "#10B981" },
  recovery: { en: "Attention",  de: "Attention",  icon: "moon" as const,    color: "#8B5CF6" },
};

const TRIAD = [
  { phase: "before"  as const, en: "Intention",  de: "Intention",  icon: "target" as const, color: "#F59E0B", tab: "/(tabs)/prepare" },
  { phase: "during"  as const, en: "Action",     de: "Action",     icon: "zap" as const,    color: "#10B981", tab: "/(tabs)/session" },
  { phase: "recovery"as const, en: "Attention",  de: "Attention",  icon: "moon" as const,   color: "#8B5CF6", tab: "/(tabs)/care" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { phase, setPhase, lang, userName, intention } = useSession();
  const phaseInfo = PHASE_LABELS[phase];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPad + 24, paddingBottom: botPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: colors.primary }]}>PREMA</Text>
          <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
            {userName
              ? lang === "de" ? `Willkommen, ${userName}` : `Welcome, ${userName}`
              : lang === "de" ? "Triad of Prema" : "Triad of Prema"}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/profile")}
          style={[styles.avatarBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="user" size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Heart Orb */}
      <View style={styles.orbSection}>
        <HeartOrb />
        {intention && (
          <View style={[styles.intentionBadge, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}>
            <Feather name="anchor" size={11} color={colors.primary} />
            <Text style={[styles.intentionBadgeText, { color: colors.primary }]}>{intention.replace("-", " ")}</Text>
          </View>
        )}
      </View>

      {/* Triad Navigation */}
      <Text style={[styles.triadLabel, { color: colors.mutedForeground }]}>
        {lang === "de" ? "TRIAD OF PREMA" : "TRIAD OF PREMA"}
      </Text>
      <View style={styles.triadRow}>
        {TRIAD.map((t) => {
          const active = phase === t.phase;
          return (
            <Pressable
              key={t.phase}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPhase(t.phase);
                router.push(t.tab as any);
              }}
              style={({ pressed }) => [
                styles.triadCard,
                {
                  backgroundColor: active ? t.color + "15" : colors.card,
                  borderColor: active ? t.color + "45" : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.triadIcon, { backgroundColor: t.color + "20" }]}>
                <Feather name={t.icon} size={18} color={t.color} />
              </View>
              <Text style={[styles.triadName, { color: active ? t.color : colors.foreground }]}>
                {lang === "de" ? t.de : t.en}
              </Text>
              {active && (
                <View style={[styles.triadDot, { backgroundColor: t.color }]} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Guidance Card */}
      <View style={[styles.guidanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.guidanceTitle, { color: colors.primary }]}>
          {lang === "de" ? "Denk daran" : "Remember"}
        </Text>
        <Text style={[styles.guidanceBody, { color: colors.mutedForeground }]}>
          {lang === "de"
            ? "Klein beginnen, langsam steigern. Hydratisiert bleiben, präsent bleiben, Grenzen kennen."
            : "Start low, go slow. Stay hydrated, stay present, and know your limits."}
        </Text>
      </View>
    </ScrollView>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
  colors,
  tint,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
  tint: string;
}) {
  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      style={({ pressed }) => [
        styles.quickAction,
        { backgroundColor: tint + "12", borderColor: tint + "30", opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: tint + "20" }]}>
        <Feather name={icon} size={20} color={tint} />
      </View>
      <Text style={[styles.quickActionLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  appTitle: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: 4 },
  appSub: { fontSize: 11, fontFamily: "Inter_400Regular", letterSpacing: 1.5, textTransform: "uppercase" },
  avatarBtn: { width: 42, height: 42, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  orbSection: { alignItems: "center", marginVertical: 24, gap: 12 },
  orbContainer: { width: 160, height: 160, alignItems: "center", justifyContent: "center" },
  pulseRing: { position: "absolute", width: 160, height: 160, borderRadius: 80 },
  orbCore: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, alignItems: "center", justifyContent: "center", shadowColor: "#10B981", shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  intentionBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14, borderWidth: 1 },
  intentionBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "capitalize", letterSpacing: 0.5 },
  triadLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, textAlign: "center" },
  triadRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  triadCard: { flex: 1, alignItems: "center", paddingVertical: 16, paddingHorizontal: 8, borderRadius: 18, borderWidth: 1, gap: 8, position: "relative" },
  triadIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  triadName: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3, textAlign: "center" },
  triadDot: { width: 5, height: 5, borderRadius: 3 },
  guidanceCard: { borderRadius: 20, borderWidth: 1, padding: 18, gap: 8 },
  guidanceTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 2, textTransform: "uppercase" },
  guidanceBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
  quickAction: { flex: 1, alignItems: "center", paddingVertical: 16, borderRadius: 18, borderWidth: 1, gap: 8 },
  quickActionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickActionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
});
