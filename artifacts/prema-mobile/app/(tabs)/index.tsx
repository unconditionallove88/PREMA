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
            Animated.timing(scale, {
              toValue: 1.6,
              duration: 2200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2200,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
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
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [pulse1, pulse2, pulse3, opacity1, opacity2, opacity3]);

  return (
    <View style={styles.orbContainer}>
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: colors.primary + "20",
            transform: [{ scale: pulse3 }],
            opacity: opacity3,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: colors.primary + "30",
            transform: [{ scale: pulse2 }],
            opacity: opacity2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.pulseRing,
          {
            backgroundColor: colors.primary + "40",
            transform: [{ scale: pulse1 }],
            opacity: opacity1,
          },
        ]}
      />
      <View
        style={[
          styles.orbCore,
          { backgroundColor: colors.card, borderColor: colors.primary + "40" },
        ]}
      >
        <Feather name="heart" size={36} color={colors.primary} />
      </View>
    </View>
  );
}

const PHASE_LABELS = {
  before: { en: "Preparation Phase", de: "Vorbereitungsphase", icon: "star" as const, color: "#F59E0B" },
  during: { en: "During Phase", de: "Während der Session", icon: "zap" as const, color: "#10B981" },
  recovery: { en: "Recovery Phase", de: "Erholungsphase", icon: "moon" as const, color: "#8B5CF6" },
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { phase, lang, userName } = useSession();
  const phaseInfo = PHASE_LABELS[phase];

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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.appTitle, { color: colors.primary }]}>PREMA</Text>
          <Text style={[styles.appSub, { color: colors.mutedForeground }]}>
            {userName
              ? lang === "de" ? `Willkommen, ${userName}` : `Welcome, ${userName}`
              : lang === "de" ? "Dein Begleiter" : "Your companion"}
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
      </View>

      {/* Phase Badge */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        style={[
          styles.phaseBadge,
          { backgroundColor: phaseInfo.color + "15", borderColor: phaseInfo.color + "40" },
        ]}
      >
        <Feather name={phaseInfo.icon} size={13} color={phaseInfo.color} />
        <Text style={[styles.phaseText, { color: phaseInfo.color }]}>
          {lang === "de" ? phaseInfo.de : phaseInfo.en}
        </Text>
      </Pressable>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <QuickAction
          icon="star"
          label={lang === "de" ? "Vorbereitung" : "Prepare"}
          onPress={() => router.push("/(tabs)/prepare")}
          colors={colors}
          tint="#F59E0B"
        />
        <QuickAction
          icon="zap"
          label={lang === "de" ? "Session" : "Session"}
          onPress={() => router.push("/(tabs)/session")}
          colors={colors}
          tint="#10B981"
        />
        <QuickAction
          icon="heart"
          label={lang === "de" ? "Fürsorge" : "Care"}
          onPress={() => router.push("/(tabs)/care")}
          colors={colors}
          tint="#EC4899"
        />
      </View>

      {/* Guidance Card */}
      <View
        style={[
          styles.guidanceCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
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
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: colors.card, borderColor: tint + "30", opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <View style={[styles.actionIcon, { backgroundColor: tint + "15" }]}>
        <Feather name={icon} size={20} color={tint} />
      </View>
      <Text style={[styles.actionLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 6,
  },
  appSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
    marginTop: 2,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orbSection: {
    marginBottom: 28,
  },
  orbContainer: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  orbCore: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  affirmation: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  phaseBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 36,
  },
  phaseText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    alignItems: "center",
    gap: 10,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  guidanceCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  guidanceTitle: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  guidanceBody: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
});
