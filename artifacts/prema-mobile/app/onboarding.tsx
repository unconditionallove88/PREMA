import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const CONTENT = {
  en: {
    step1: {
      tagline: "with love",
      subtitle: "A circle of care for festival communities",
      cta: "Start your journey",
      touch: "Touch to begin",
    },
    step2: {
      title: "Before we begin",
      sub: "Please read and agree to continue",
      disclaimers: [
        {
          key: "age",
          title: "I am 18 or older",
          body: "Prema is designed for adults. By continuing you confirm you are at least 18 years of age.",
        },
        {
          key: "harm",
          title: "Care — not medical advice",
          body: "Prema offers care and support information only. It is not a substitute for medical advice, diagnosis, or treatment. If you are in danger, call emergency services immediately.",
        },
        {
          key: "gdpr",
          title: "Data & Privacy",
          body: "Your data is stored locally and anonymously. We never sell or share personal data with third parties. You can delete your data at any time in Profile.",
        },
        {
          key: "emergency",
          title: "I know how to get immediate help",
          body: "In a medical emergency, do not rely on this app — call 112 (EU) or your local emergency number immediately.",
        },
      ],
      cta: "I agree — continue",
    },
    step3: {
      title: "What shall we call you?",
      sub: "This stays on your device",
      placeholder: "Your name or a soul-name...",
      lang: "Choose your language",
      cta: "Enter Prema",
    },
  },
  de: {
    step1: {
      tagline: "mit liebe",
      subtitle: "Ein Kreis der Fürsorge für Festival-Communities",
      cta: "Starte deine Reise",
      touch: "Zum Beginnen berühren",
    },
    step2: {
      title: "Bevor wir beginnen",
      sub: "Bitte lies und stimme zu um fortzufahren",
      disclaimers: [
        {
          key: "age",
          title: "Ich bin 18 Jahre oder älter",
          body: "Prema wurde für Erwachsene entwickelt. Mit dem Fortfahren bestätigst du, dass du mindestens 18 Jahre alt bist.",
        },
        {
          key: "harm",
          title: "Fürsorge — kein medizinischer Rat",
          body: "Prema bietet ausschließlich Informationen zur Selbstfürsorge. Es ersetzt keinen medizinischen Rat. Bei Gefahr rufe sofort den Notarzt.",
        },
        {
          key: "gdpr",
          title: "Daten & Datenschutz",
          body: "Deine Daten werden lokal und anonym gespeichert. Wir verkaufen oder teilen keine persönlichen Daten. Du kannst deine Daten jederzeit im Profil löschen.",
        },
        {
          key: "emergency",
          title: "Ich weiß wie ich sofortige Hilfe bekomme",
          body: "Im medizinischen Notfall verlasse dich nicht auf diese App — rufe sofort 112 oder deine lokale Notrufnummer.",
        },
      ],
      cta: "Ich stimme zu — weiter",
    },
    step3: {
      title: "Wie sollen wir dich nennen?",
      sub: "Bleibt auf deinem Gerät",
      placeholder: "Dein Name oder ein Seelenname...",
      lang: "Wähle deine Sprache",
      cta: "Prema betreten",
    },
  },
};

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setLang } = useSession();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [uiLang, setUiLang] = useState<"en" | "de">("en");
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const t = CONTENT[uiLang];

  const transition = (nextStep: 1 | 2 | 3) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleLangChange = (l: "en" | "de") => {
    setUiLang(l);
    setLang(l);
    Haptics.selectionAsync();
  };

  const allAgreed =
    t.step2.disclaimers.every((d) => agreed[d.key]) === true;

  const handleFinish = async () => {
    if (!name.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await AsyncStorage.multiSet([
      ["prema_onboarded", "true"],
      ["prema_user_name", name.trim().toUpperCase()],
      ["prema_lang", uiLang],
    ]);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Progress bar */}
      <View
        style={[
          styles.progressBar,
          {
            paddingTop: insets.top + 12,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.progressInner}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    s <= step ? colors.primary : colors.border,
                  flex: s <= step ? 2 : 1,
                },
              ]}
            />
          ))}
        </View>
        <Text
          style={[styles.progressLabel, { color: colors.mutedForeground }]}
        >
          {step} / 3
        </Text>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* ── STEP 1: WELCOME ─────────────────────────── */}
        {step === 1 && (
          <ScrollView
            contentContainerStyle={[
              styles.stepContainer,
              { paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Language toggle */}
            <View style={styles.langRow}>
              {(["en", "de"] as const).map((l, i) => (
                <React.Fragment key={l}>
                  <Pressable onPress={() => handleLangChange(l)}>
                    <Text
                      style={[
                        styles.langBtn,
                        {
                          color:
                            uiLang === l
                              ? colors.primary
                              : colors.mutedForeground,
                        },
                      ]}
                    >
                      {l.toUpperCase()}
                    </Text>
                  </Pressable>
                  {i === 0 && (
                    <Text style={{ color: colors.border, fontSize: 14 }}>|</Text>
                  )}
                </React.Fragment>
              ))}
            </View>

            {/* Orb */}
            <View style={styles.orbWrap}>
              <View
                style={[
                  styles.orbGlow,
                  { backgroundColor: colors.primary + "18" },
                ]}
              />
              <View
                style={[
                  styles.orbCore,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.primary + "40",
                  },
                ]}
              >
                <Feather name="heart" size={16} color={colors.primary + "80"} />
              </View>
            </View>

            <Text style={[styles.appTitle, { color: colors.foreground }]}>
              PREMA
            </Text>
            <Text style={[styles.tagline, { color: colors.primary }]}>
              {t.step1.tagline}
            </Text>
            <Text
              style={[styles.subtitle, { color: colors.mutedForeground }]}
            >
              {t.step1.subtitle}
            </Text>

            <Pressable
              onPress={() => transition(2)}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  marginTop: 48,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  { color: colors.primaryForeground },
                ]}
              >
                {t.step1.cta}
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={colors.primaryForeground}
              />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 2: DISCLAIMERS ─────────────────────── */}
        {step === 2 && (
          <ScrollView
            contentContainerStyle={[
              styles.stepContainer,
              { paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Feather name="shield" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>
              {t.step2.title}
            </Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
              {t.step2.sub}
            </Text>

            <View style={styles.disclaimerList}>
              {t.step2.disclaimers.map((d) => (
                <Pressable
                  key={d.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setAgreed((prev) => ({
                      ...prev,
                      [d.key]: !prev[d.key],
                    }));
                  }}
                  style={[
                    styles.disclaimerCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: agreed[d.key]
                        ? colors.primary + "60"
                        : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: agreed[d.key]
                          ? colors.primary
                          : "transparent",
                        borderColor: agreed[d.key]
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    {agreed[d.key] && (
                      <Feather
                        name="check"
                        size={12}
                        color={colors.primaryForeground}
                      />
                    )}
                  </View>
                  <View style={styles.disclaimerText}>
                    <Text
                      style={[
                        styles.disclaimerTitle,
                        { color: colors.foreground },
                      ]}
                    >
                      {d.title}
                    </Text>
                    <Text
                      style={[
                        styles.disclaimerBody,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {d.body}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => allAgreed && transition(3)}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: allAgreed
                    ? colors.primary
                    : colors.border,
                  opacity: pressed && allAgreed ? 0.85 : 1,
                  marginTop: 24,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  {
                    color: allAgreed
                      ? colors.primaryForeground
                      : colors.mutedForeground,
                  },
                ]}
              >
                {t.step2.cta}
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={
                  allAgreed
                    ? colors.primaryForeground
                    : colors.mutedForeground
                }
              />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 3: PROFILE ─────────────────────────── */}
        {step === 3 && (
          <ScrollView
            contentContainerStyle={[
              styles.stepContainer,
              { paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.primary + "18" },
              ]}
            >
              <Feather name="user" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>
              {t.step3.title}
            </Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>
              {t.step3.sub}
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.step3.placeholder}
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              maxLength={32}
              style={[
                styles.nameInput,
                {
                  backgroundColor: colors.card,
                  borderColor: name.trim() ? colors.primary + "60" : colors.border,
                  color: colors.foreground,
                },
              ]}
            />

            <Text
              style={[
                styles.langLabel,
                { color: colors.mutedForeground, marginTop: 28 },
              ]}
            >
              {t.step3.lang}
            </Text>
            <View style={styles.langToggle}>
              {(["en", "de"] as const).map((l) => (
                <Pressable
                  key={l}
                  onPress={() => handleLangChange(l)}
                  style={[
                    styles.langOption,
                    {
                      backgroundColor:
                        uiLang === l ? colors.primary : colors.card,
                      borderColor:
                        uiLang === l ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      {
                        color:
                          uiLang === l
                            ? colors.primaryForeground
                            : colors.foreground,
                      },
                    ]}
                  >
                    {l === "en" ? "English" : "Deutsch"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleFinish}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: name.trim()
                    ? colors.primary
                    : colors.border,
                  opacity: pressed && name.trim() ? 0.85 : 1,
                  marginTop: 36,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  {
                    color: name.trim()
                      ? colors.primaryForeground
                      : colors.mutedForeground,
                  },
                ]}
              >
                {t.step3.cta}
              </Text>
              <Feather
                name="heart"
                size={18}
                color={
                  name.trim()
                    ? colors.primaryForeground
                    : colors.mutedForeground
                }
              />
            </Pressable>

            <Text
              style={[
                styles.footerNote,
                { color: colors.mutedForeground },
              ]}
            >
              Created in harmony
            </Text>
          </ScrollView>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressInner: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressDot: {
    height: 4,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  stepContainer: {
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
    minHeight: "100%",
  },
  orbWrap: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  orbGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  orbCore: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 40,
  },
  langBtn: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
  },
  appTitle: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    letterSpacing: 10,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    fontStyle: "italic",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 24,
  },
  primaryBtnText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  iconBadge: {
    width: 70,
    height: 70,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  stepSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 32,
  },
  disclaimerList: {
    width: "100%",
    gap: 12,
  },
  disclaimerCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  disclaimerText: {
    flex: 1,
    gap: 4,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  disclaimerBody: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  nameInput: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    letterSpacing: 1,
  },
  langLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  langToggle: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  langOption: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  langOptionText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
  },
  footerNote: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 24,
  },
});
