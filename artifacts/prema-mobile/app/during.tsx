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

const CONTENT = {
  en: {
    phase: "Action Phase",
    title: "Access Guidance",
    affirmation: '"You are held"',
    heading: "Journey with awareness",
    sub: "Five principles to carry with you",
    cta: "Enter the Circle",
  },
  de: {
    phase: "Action Phase",
    title: "Zugangs-Leitfaden",
    affirmation: '"Du bist gehalten"',
    heading: "Reise mit Bewusstsein",
    sub: "Fünf Prinzipien für deinen Weg",
    cta: "Den Kreis betreten",
  },
};

const GUIDANCE: {
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  en: { title: string; body: string };
  de: { title: string; body: string };
}[] = [
  {
    icon: "shield",
    color: "#1B4D3E",
    en: {
      title: "Start slow",
      body: "Begin with a small amount. Wait at least 90 minutes before considering more. Your body will tell you what it needs.",
    },
    de: {
      title: "Langsam beginnen",
      body: "Beginne mit einer kleinen Menge. Warte mindestens 90 Minuten, bevor du mehr in Betracht ziehst. Dein Körper sagt dir, was er braucht.",
    },
  },
  {
    icon: "wind",
    color: "#38BDF8",
    en: {
      title: "Stay hydrated",
      body: "Sip water steadily — about 500 ml per hour if dancing. Rest in cool spaces every 30–45 minutes.",
    },
    de: {
      title: "Bleib hydratisiert",
      body: "Trinke gleichmäßig Wasser — etwa 500 ml pro Stunde beim Tanzen. Ruhe alle 30–45 Minuten an kühlen Orten.",
    },
  },
  {
    icon: "eye",
    color: "#A78BFA",
    en: {
      title: "Stay aware",
      body: "Check in with yourself every hour. Notice your body, your breath, your feelings. You are your own best guardian.",
    },
    de: {
      title: "Bleib achtsam",
      body: "Spüre jede Stunde in dich hinein. Nimm deinen Körper, deinen Atem, deine Gefühle wahr. Du bist dein bester Wächter.",
    },
  },
  {
    icon: "heart",
    color: "#FB7185",
    en: {
      title: "Stay connected",
      body: "Keep your safety network close. If something feels off — for you or someone else — reach out immediately.",
    },
    de: {
      title: "Bleib verbunden",
      body: "Halte dein Sicherheitsnetz nah. Wenn sich etwas nicht richtig anfühlt — für dich oder andere — melde dich sofort.",
    },
  },
  {
    icon: "feather",
    color: "#34D399",
    en: {
      title: "Trust the flow",
      body: "Surrender to the experience with care. Resistance amplifies intensity. Breathe, ground, return to intention.",
    },
    de: {
      title: "Vertraue dem Fluss",
      body: "Lass dich achtsam auf die Erfahrung ein. Widerstand verstärkt die Intensität. Atme, erde dich, kehre zur Absicht zurück.",
    },
  },
];

function RadiantOrb({ color, card, border }: { color: string; card: string; border: string }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.15, duration: 1800, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.7, duration: 1800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.4, duration: 1800, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, glow]);

  return (
    <View style={styles.orbContainer}>
      <Animated.View
        style={[styles.orbGlow, { backgroundColor: color + "20", transform: [{ scale: pulse }], opacity: glow }]}
      />
      <View style={[styles.orbCore, { backgroundColor: card, borderColor: color + "33" }]}>
        <Feather name="sun" size={26} color={color} />
      </View>
    </View>
  );
}

export default function DuringScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const t = CONTENT[lang] || CONTENT.en;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={18} color={colors.mutedForeground} />
        </Pressable>
        <View>
          <Text style={[styles.headerPhase, { color: colors.primary }]}>{t.phase}</Text>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.title}</Text>
        </View>
      </View>

      {/* Affirmation banner */}
      <View style={[styles.affirmBanner, { backgroundColor: colors.primary + "0D", borderBottomColor: colors.primary + "1A" }]}>
        <Text style={[styles.affirmText, { color: colors.primary }]}>{t.affirmation}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingBottom: botPad + 130 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Radiant orb */}
        <View style={styles.orbSection}>
          <RadiantOrb color={colors.primary} card={colors.card} border={colors.border} />
          <Text style={[styles.orbHeading, { color: colors.foreground }]}>{t.heading}</Text>
          <Text style={[styles.orbSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
        </View>

        {/* Guidance cards */}
        <View style={{ gap: 12 }}>
          {GUIDANCE.map((g, i) => {
            const txt = lang === "de" ? g.de : g.en;
            return (
              <View
                key={i}
                style={[styles.card, { backgroundColor: g.color + "0D", borderColor: g.color + "26" }]}
              >
                <Feather name={g.icon} size={18} color={g.color} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: g.color }]}>{txt.title}</Text>
                  <Text style={[styles.cardBody, { color: colors.foreground }]}>{txt.body}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Enter the Circle CTA */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: botPad + 20 },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push("/(tabs)");
          }}
          style={[styles.cta, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>{t.cta}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  headerPhase: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 4, textTransform: "uppercase" },
  headerTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  affirmBanner: { paddingVertical: 10, paddingHorizontal: 24, borderBottomWidth: 1, alignItems: "center" },
  affirmText: { fontSize: 9, fontFamily: "Inter_500Medium", letterSpacing: 3.5, textTransform: "uppercase" },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  orbSection: { alignItems: "center", paddingTop: 28, paddingBottom: 24, gap: 6 },
  orbContainer: { width: 96, height: 96, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  orbGlow: { position: "absolute", width: 96, height: 96, borderRadius: 48 },
  orbCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  orbHeading: { fontSize: 20, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3, textAlign: "center" },
  orbSub: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", maxWidth: 240 },
  card: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14 },
  cardTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 },
  cardBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  cta: { height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  ctaText: { fontSize: 14, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
});
