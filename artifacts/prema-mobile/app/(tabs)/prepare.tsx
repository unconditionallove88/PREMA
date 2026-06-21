import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrepStep, useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const STEPS: {
  id: PrepStep;
  icon: React.ComponentProps<typeof Feather>["name"];
  tint: string;
  en: { title: string; body: string; done: string };
  de: { title: string; body: string; done: string };
}[] = [
  {
    id: "testing",
    icon: "activity",
    tint: "#3B82F6",
    en: {
      title: "Lab Test",
      body: "Test your substances before use. Anonymous and confidential.",
      done: "Tested",
    },
    de: {
      title: "Labortest",
      body: "Teste deine Substanzen vor dem Konsum. Anonym und vertraulich.",
      done: "Getestet",
    },
  },
  {
    id: "essentials",
    icon: "package",
    tint: "#10B981",
    en: {
      title: "Essentials",
      body: "Pack water, snacks, phone charger, layers, and your safety card.",
      done: "Packed",
    },
    de: {
      title: "Wesentliches",
      body: "Packe Wasser, Snacks, Ladekabel, Schichten und deine Sicherheitskarte.",
      done: "Gepackt",
    },
  },
  {
    id: "nutrition",
    icon: "coffee",
    tint: "#F59E0B",
    en: {
      title: "Nutrition",
      body: "Eat a balanced meal 3–4 hours before. Avoid heavy or processed foods.",
      done: "Nourished",
    },
    de: {
      title: "Ernährung",
      body: "Iss 3–4 Stunden vorher eine ausgewogene Mahlzeit. Vermeide schwere Kost.",
      done: "Genährt",
    },
  },
  {
    id: "rest",
    icon: "moon",
    tint: "#8B5CF6",
    en: {
      title: "Nervous System Support",
      body: "Prioritize restful sleep. Aim to rest before 23:00. A 20-min nap helps if needed.",
      done: "Rested",
    },
    de: {
      title: "Nervensystem-Unterstützung",
      body: "Priorisiere erholsamen Schlaf. Versuche vor 23:00 zu ruhen. Ein Nickerchen hilft.",
      done: "Erholt",
    },
  },
  {
    id: "alarms",
    icon: "bell",
    tint: "#EC4899",
    en: {
      title: "Care Alarms",
      body: "Set hydration reminders, rest intervals, and your departure time.",
      done: "Set",
    },
    de: {
      title: "Fürsorge-Alarme",
      body: "Stelle Hydrations-Erinnerungen, Ruheintervalle und Abfahrtszeit ein.",
      done: "Gesetzt",
    },
  },
  {
    id: "sync",
    icon: "radio",
    tint: "#10B981",
    en: {
      title: "Pulse Sync",
      body: "Share your preparation with your care network. You are not alone.",
      done: "Synced",
    },
    de: {
      title: "Puls-Sync",
      body: "Teile deine Vorbereitung mit deinem Fürsorge-Netzwerk. Du bist nicht allein.",
      done: "Synchronisiert",
    },
  },
];

export default function PrepareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completed, toggleStep, allComplete, setPhase, lang } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const doneCount = Object.values(completed).filter(Boolean).length;
  const progress = doneCount / STEPS.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: topPad + 24, paddingBottom: botPad + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.screenLabel, { color: colors.mutedForeground }]}>
              {lang === "de" ? "VORBEREITUNG" : "PREPARATION"}
            </Text>
            <Text style={[styles.screenTitle, { color: colors.foreground }]}>
              {lang === "de" ? "Von innen heraus" : "From the inside out"}
            </Text>
          </View>
          <View
            style={[
              styles.progressPill,
              { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
            ]}
          >
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {doneCount}/{STEPS.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View
          style={[styles.progressBar, { backgroundColor: colors.card }]}
        >
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary, width: `${progress * 100}%` },
            ]}
          />
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {STEPS.map((step) => {
            const done = completed[step.id];
            const label = lang === "de" ? step.de : step.en;
            return (
              <Pressable
                key={step.id}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleStep(step.id);
                }}
                style={({ pressed }) => [
                  styles.stepCard,
                  {
                    backgroundColor: done ? step.tint + "12" : colors.card,
                    borderColor: done ? step.tint + "40" : colors.border,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.stepIcon,
                    { backgroundColor: done ? step.tint + "20" : colors.muted },
                  ]}
                >
                  <Feather
                    name={done ? "check" : step.icon}
                    size={18}
                    color={done ? step.tint : colors.mutedForeground}
                  />
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      { color: done ? step.tint : colors.foreground },
                    ]}
                  >
                    {label.title}
                  </Text>
                  <Text
                    style={[styles.stepBody, { color: colors.mutedForeground }]}
                  >
                    {done ? label.done : label.body}
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: done ? step.tint : "transparent",
                      borderColor: done ? step.tint : colors.border,
                    },
                  ]}
                >
                  {done && <Feather name="check" size={12} color="#fff" />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* I am prepared CTA */}
      {(allComplete || completed.sync) && (
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
              setPhase("during");
              router.push("/(tabs)/session");
            }}
            style={({ pressed }) => [
              styles.ctaBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Feather name="arrow-right" size={18} color="#fff" />
            <Text style={styles.ctaText}>
              {lang === "de" ? "Ich bin bereit" : "I am prepared"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  screenLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  progressPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    marginBottom: 28,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  steps: {
    gap: 10,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepContent: {
    flex: 1,
    gap: 3,
  },
  stepTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  stepBody: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
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
