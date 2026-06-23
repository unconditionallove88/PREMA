import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
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
    title: "Breath of Love",
    inhale: "Breathe In Love",
    exhale: "Breathe Out Love",
    button: "Return to Home",
    next: "Circle of Love (Support)",
  },
  de: {
    title: "Atem der Liebe",
    inhale: "Atme sanft Liebe ein",
    exhale: "Atme sanft Liebe aus",
    button: "Zum Zuhause zurückkehren",
    next: "Circle of Love (Halt)",
  },
};

export default function SelfCare() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const t = CONTENT[lang] || CONTENT.en;

  // 8s breathing cycle: inhale 0–4s (expand), exhale 4–8s (contract)
  const breath = useRef(new Animated.Value(0)).current; // 0 = small, 1 = large
  const inhaleOpacity = useRef(new Animated.Value(0)).current;
  const exhaleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    // Inhale text: visible during the first half of the cycle (0–4s)
    const inhaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(inhaleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(2600),
        Animated.timing(inhaleOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
        Animated.delay(4000),
      ])
    );

    // Exhale text: visible during the second half of the cycle (4–8s)
    const exhaleLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(4000),
        Animated.timing(exhaleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.delay(2600),
        Animated.timing(exhaleOpacity, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );

    breathLoop.start();
    inhaleLoop.start();
    exhaleLoop.start();

    return () => {
      breathLoop.stop();
      inhaleLoop.stop();
      exhaleLoop.stop();
    };
  }, [breath, inhaleOpacity, exhaleOpacity]);

  const scaleOuter = breath.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.25] });
  const scaleMid = breath.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.15] });
  const scaleCore = breath.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.1] });
  const glowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.5] });

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/heart-status" as any);
  };

  const goHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{t.title}</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Breathing ritual */}
      <View style={styles.center}>
        <View style={styles.orbWrap}>
          <Animated.View
            style={[
              styles.ring,
              styles.ringOuter,
              { backgroundColor: colors.primary + "12", transform: [{ scale: scaleOuter }], opacity: glowOpacity },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringMid,
              { backgroundColor: colors.primary + "20", transform: [{ scale: scaleMid }] },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              styles.ringCore,
              {
                backgroundColor: colors.card,
                borderColor: colors.primary + "40",
                transform: [{ scale: scaleCore }],
              },
            ]}
          >
            <Feather name="heart" size={40} color={colors.primary} />
          </Animated.View>
        </View>

        {/* Guided typography — crossfades inhale / exhale */}
        <View style={styles.textStage}>
          <Animated.Text
            style={[styles.breathText, { color: colors.foreground, opacity: inhaleOpacity }]}
          >
            {t.inhale}
          </Animated.Text>
          <Animated.Text
            style={[
              styles.breathText,
              styles.breathTextAbs,
              { color: colors.primary, opacity: exhaleOpacity },
            ]}
          >
            {t.exhale}
          </Animated.Text>
        </View>
      </View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: botPad + insets.bottom + 24 }]}>
        <Pressable
          onPress={goNext}
          style={({ pressed }) => [
            styles.nextBtn,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="heart" size={16} color={colors.primary} />
          <Text style={[styles.nextBtnText, { color: colors.foreground }]}>{t.next}</Text>
          <Feather name="arrow-right" size={14} color={colors.mutedForeground} />
        </Pressable>

        <Pressable
          onPress={goHome}
          style={({ pressed }) => [styles.homeBtn, { opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.homeBtnText, { color: colors.mutedForeground }]}>{t.button}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 56,
  },
  orbWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: { width: 260, height: 260, borderRadius: 130 },
  ringMid: { width: 180, height: 180, borderRadius: 90 },
  ringCore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  textStage: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  breathText: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  breathTextAbs: {
    position: "absolute",
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 16,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  nextBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  homeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  homeBtnText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
