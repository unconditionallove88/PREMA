import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { Text } from "@/components/Text";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const CONTENT = {
  en: {
    eyebrow: "before you enter",
    continue: "continue",
    enter: "i understand — enter",
    screens: [
      {
        title: "purpose & intent",
        body: "[placeholder: this application is intended as a personal wellness and consciousness companion, harm reduction and self-reflection tool. it does not encourage or endorse the use of any substance.]",
      },
      {
        title: "medical & safety disclaimer",
        body: "[placeholder: this app does not provide medical advice, diagnosis, or treatment. always seek the guidance of a qualified health professional and call emergency services in any crisis.]",
      },
      {
        title: "age & jurisdiction",
        body: "[placeholder: you must be of legal age in your jurisdiction to use this app. you are solely responsible for complying with all laws that apply where you live.]",
      },
      {
        title: "data & privacy",
        body: "[placeholder: your usage data is stored locally on your device. you remain in control and may clear your entire journey at any time from the you panel.]",
      },
    ],
  },
  de: {
    eyebrow: "bevor du eintrittst",
    continue: "weiter",
    enter: "ich verstehe — eintreten",
    screens: [
      {
        title: "zweck & absicht",
        body: "[platzhalter: diese anwendung ist als persönlicher begleiter für wohlbefinden und bewusstsein, als werkzeug zur schadensminderung und selbstreflexion gedacht. sie ermutigt oder befürwortet den konsum keiner substanz.]",
      },
      {
        title: "medizinischer & sicherheitshinweis",
        body: "[platzhalter: diese app bietet keine medizinische beratung, diagnose oder behandlung. hole stets den rat einer qualifizierten fachperson ein und rufe in jeder krise den notdienst.]",
      },
      {
        title: "alter & rechtsraum",
        body: "[platzhalter: du musst in deinem rechtsraum volljährig sein, um diese app zu nutzen. du bist allein dafür verantwortlich, alle für dich geltenden gesetze einzuhalten.]",
      },
      {
        title: "daten & privatsphäre",
        body: "[platzhalter: deine nutzungsdaten werden lokal auf deinem gerät gespeichert. du behältst die kontrolle und kannst deine gesamte reise jederzeit im you-bereich löschen.]",
      },
    ],
  },
};

export default function DisclaimerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, completeDisclaimer } = useSession();
  const t = CONTENT[lang];

  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const total = t.screens.length;
  const isLast = index === total - 1;
  const screen = t.screens[index];

  const transition = (next: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setIndex(next);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleContinue = () => {
    if (isLast) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeDisclaimer();
      router.replace("/(tabs)");
      return;
    }
    transition(index + 1);
  };

  const handleBack = () => {
    if (index <= 0) return;
    transition(index - 1);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <GradientBackground />

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        {index > 0 ? (
          <Pressable
            onPress={handleBack}
            hitSlop={12}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="arrow-left" size={18} color={colors.foreground} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}

        <View style={styles.progressInner}>
          {t.screens.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i <= index ? colors.primary : colors.border,
                  flex: i <= index ? 2 : 1,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
          {index + 1} / {total}
        </Text>
      </View>

      <Animated.View
        style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.eyebrow, { color: colors.primary }]}>{t.eyebrow}</Text>
          <Text style={[styles.title, { color: colors.foreground }]}>{screen.title}</Text>
          <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{screen.body}</Text>
        </ScrollView>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <Text style={[styles.ctaText, { color: colors.primaryForeground }]}>
            {isLast ? t.enter : t.continue}
          </Text>
          <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  progressInner: { flex: 1, flexDirection: "row", gap: 6, alignItems: "center" },
  progressDot: { height: 4, borderRadius: 2 },
  progressLabel: { fontSize: 11, fontFamily: "Nunito_500Medium", letterSpacing: 1 },
  body: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
    gap: 18,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 4,
    textTransform: "lowercase",
  },
  title: {
    fontSize: 30,
    fontFamily: "Nunito_300Light",
    letterSpacing: 0.5,
    lineHeight: 38,
  },
  bodyText: {
    fontSize: 16,
    fontFamily: "Nunito_300Light",
    lineHeight: 27,
    letterSpacing: 0.3,
  },
  footer: { paddingHorizontal: 24, paddingTop: 8 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 58,
    borderRadius: 18,
  },
  ctaText: {
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 1,
    textTransform: "lowercase",
  },
});
