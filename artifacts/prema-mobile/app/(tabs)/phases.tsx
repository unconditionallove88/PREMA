import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { Phase, useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

type PhaseMeta = {
  phase: Phase;
  icon: React.ComponentProps<typeof Feather>["name"];
  label: { en: string; de: string };
  sub: { en: string; de: string };
  poem: { en: string; de: string };
  cta: { en: string; de: string };
  color: string;
  route: string;
};

const PHASES: PhaseMeta[] = [
  {
    phase: "before",
    icon: "heart",
    label: { en: "INTENTION", de: "INTENTION" },
    sub: { en: "Prepare your mind & body", de: "Geist & Körper vorbereiten" },
    poem: {
      en: "Informed preparation.\nHonest intention.",
      de: "Informierte Vorbereitung.\nEhrliche Absicht.",
    },
    cta: { en: "Enter Intention", de: "Intention beginnen" },
    color: "#F59E0B",
    route: "/before",
  },
  {
    phase: "during",
    icon: "zap",
    label: { en: "ACTION", de: "ACTION" },
    sub: { en: "Stay present & connected", de: "Präsent & verbunden bleiben" },
    poem: {
      en: "Stay present.\nKnow your limits. Reach out.",
      de: "Präsent bleiben.\nGrenzen kennen. Verbindung suchen.",
    },
    cta: { en: "Enter Action", de: "Action betreten" },
    color: "#10B981",
    route: "/during",
  },
  {
    phase: "recovery",
    icon: "moon",
    label: { en: "ATTENTION", de: "ATTENTION" },
    sub: { en: "Recover & restore", de: "Erholen & regenerieren" },
    poem: {
      en: "Rest and restore.\nCompassion for yourself.",
      de: "Ruhe und Erholung.\nMitgefühl für dich selbst.",
    },
    cta: { en: "Enter Attention", de: "Attention beginnen" },
    color: "#8B5CF6",
    route: "/recovery",
  },
];

function PhaseCircle({
  meta,
  active,
  onPress,
}: {
  meta: PhaseMeta;
  active: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const ping = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.timing(ping, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [active, ping]);

  return (
    <View style={styles.circleWrap}>
      {active && (
        <Animated.View
          style={[
            styles.circlePing,
            {
              backgroundColor: meta.color,
              opacity: ping.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
              transform: [{ scale: ping.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] }) }],
            },
          ]}
        />
      )}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={[
          styles.circleBtn,
          {
            borderColor: active ? meta.color : colors.border,
            backgroundColor: active ? meta.color + "1A" : colors.card,
            transform: [{ scale: active ? 1.1 : 1 }],
            opacity: active ? 1 : 0.55,
          },
        ]}
      >
        <Feather name={meta.icon} size={22} color={meta.color} />
      </Pressable>
    </View>
  );
}

export default function PhasesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, userName, phase, setPhase } = useSession();
  const [active, setActive] = useState<Phase>(phase ?? "before");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const meta = PHASES.find((p) => p.phase === active) ?? PHASES[0];
  const name = userName || (lang === "de" ? "SEELE" : "HEART");

  const handleEnter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPhase(active);
    router.push(meta.route as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <View style={{ flex: 1, paddingTop: topPad + 16, paddingBottom: botPad + 90 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            {lang === "de" ? "Unterstützer" : "Supporter"}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]}>
            {lang === "de" ? `Strahle, ${name}` : `Shine, ${name}`}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Phase selector */}
          <View style={styles.selector}>
            {PHASES.map((p) => (
              <PhaseCircle
                key={p.phase}
                meta={p}
                active={active === p.phase}
                onPress={() => setActive(p.phase)}
              />
            ))}
          </View>

          {/* Center card */}
          <View
            style={[
              styles.card,
              { backgroundColor: meta.color + "0D", borderColor: meta.color + "33" },
            ]}
          >
            <View
              style={[
                styles.cardIcon,
                { borderColor: meta.color + "55", backgroundColor: meta.color + "14" },
              ]}
            >
              <Feather name={meta.icon} size={30} color={meta.color} />
            </View>
            <Text style={[styles.cardSub, { color: meta.color }]}>
              {meta.sub[lang]}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>
              {meta.label[lang]}
            </Text>
            <Text style={[styles.cardPoem, { color: colors.mutedForeground }]}>
              {`"${meta.poem[lang]}"`}
            </Text>
            <Pressable
              onPress={handleEnter}
              style={({ pressed }) => [
                styles.cardBtn,
                { backgroundColor: meta.color, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.cardBtnText}>{meta.cta[lang]}</Text>
            </Pressable>
          </View>
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          {lang === "de" ? "In Harmonie erschaffen" : "Created in harmony"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, marginBottom: 8 },
  eyebrow: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  selector: { gap: 28, alignItems: "center", paddingVertical: 8 },
  circleWrap: { width: 56, height: 56, alignItems: "center", justifyContent: "center" },
  circlePing: { position: "absolute", width: 52, height: 52, borderRadius: 26 },
  circleBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 2,
    padding: 26,
    alignItems: "center",
    gap: 14,
  },
  cardIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardSub: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  cardPoem: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
  },
  cardBtn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  cardBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  footer: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
    textTransform: "uppercase",
    textAlign: "center",
    opacity: 0.5,
  },
});
