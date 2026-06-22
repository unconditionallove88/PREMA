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

const GUIDANCE = [
  {
    iconName: "shield" as const,
    tint: "#10B981",
    en: {
      title: "Start slow",
      body: "Begin with a small amount. Wait at least 90 minutes before considering more.",
    },
    de: {
      title: "Langsam beginnen",
      body: "Beginne mit einer kleinen Menge. Warte mindestens 90 Minuten bevor du mehr nimmst.",
    },
  },
  {
    iconName: "wind" as const,
    tint: "#38BDF8",
    en: {
      title: "Stay hydrated",
      body: "Sip water steadily — about 500ml per hour if dancing. Rest in cool spaces regularly.",
    },
    de: {
      title: "Hydratisiert bleiben",
      body: "Trinke Wasser stetig — ca. 500ml pro Stunde beim Tanzen. Ruhe dich in kühlen Räumen aus.",
    },
  },
  {
    iconName: "eye" as const,
    tint: "#A78BFA",
    en: {
      title: "Stay aware",
      body: "Check in with yourself every hour. Notice your body, your breath, your feelings.",
    },
    de: {
      title: "Aufmerksam bleiben",
      body: "Melde dich stündlich bei dir selbst. Beachte deinen Körper, deinen Atem, deine Gefühle.",
    },
  },
  {
    iconName: "heart" as const,
    tint: "#F472B6",
    en: {
      title: "Stay connected",
      body: "Stay connected with your trusted contacts. If something feels off, reach out immediately.",
    },
    de: {
      title: "Verbunden bleiben",
      body: "Bleibe mit deinen vertrauenswürdigen Kontakten verbunden. Wenn sich etwas komisch anfühlt, wende dich sofort an jemanden.",
    },
  },
  {
    iconName: "leaf" as const,
    tint: "#34D399",
    en: {
      title: "Trust the flow",
      body: "Breathe, ground yourself, and return to your intention. Presence is your anchor.",
    },
    de: {
      title: "Dem Fluss vertrauen",
      body: "Atme, erden dich und kehre zu deiner Absicht zurück. Präsenz ist dein Anker.",
    },
  },
];

function GlowOrb({ colors }: { colors: ReturnType<typeof useColors> }) {
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [glow]);

  return (
    <View style={styles.glowOrbContainer}>
      <Animated.View
        style={[
          styles.glowHalo,
          { backgroundColor: colors.primary + "20", opacity: glow },
        ]}
      />
      <View
        style={[
          styles.glowCore,
          { backgroundColor: colors.card, borderColor: colors.primary + "50" },
        ]}
      >
        <Feather name="zap" size={28} color={colors.primary} />
      </View>
    </View>
  );
}

export default function SessionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { phase, setPhase, lang } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPad + 24, paddingBottom: botPad + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.screenLabel, { color: colors.mutedForeground }]}>
          {lang === "de" ? "WÄHREND DER SESSION" : "DURING YOUR SESSION"}
        </Text>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          {lang === "de" ? "Zugangs-Leitfaden" : "Access Guidance"}
        </Text>

        {/* Orb */}
        <View style={styles.orbSection}>
          <GlowOrb colors={colors} />
        </View>

        {/* Guidance cards */}
        <View style={styles.cards}>
          {GUIDANCE.map((g, i) => {
            const label = lang === "de" ? g.de : g.en;
            return (
              <View
                key={i}
                style={[
                  styles.card,
                  {
                    backgroundColor: g.tint + "0D",
                    borderColor: g.tint + "25",
                  },
                ]}
              >
                <View style={[styles.cardIcon, { backgroundColor: g.tint + "20" }]}>
                  <Feather name={g.iconName} size={17} color={g.tint} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: g.tint }]}>
                    {label.title}
                  </Text>
                  <Text style={[styles.cardBody, { color: colors.mutedForeground }]}>
                    {label.body}
                  </Text>
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
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: botPad + 16,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (phase !== "during") setPhase("during");
            router.push("/(tabs)/index");
          }}
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Feather name="circle" size={17} color="#fff" />
          <Text style={styles.ctaText}>
            {lang === "de" ? "Den Kreis betreten" : "Enter the Circle"}
          </Text>
        </Pressable>
      </View>
    </View>
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
    marginBottom: 12,
  },
  affirmationRow: {
    marginBottom: 28,
  },
  affirmation: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    fontStyle: "italic",
  },
  orbSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  glowOrbContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  glowHalo: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  glowCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  cards: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  cardContent: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  cardBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 54,
    borderRadius: 17,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
