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

const TOTAL_STEPS = 8;

const CONTENT = {
  en: {
    step1: {
      tagline: "with love",
      subtitle: "A circle of love for festival communities",
      cta: "Start your journey",
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
          title: "Guidance — not medical advice",
          body: "Prema offers support and guidance only. It is not a substitute for medical advice, diagnosis, or treatment. If you are in danger, call emergency services immediately.",
        },
        {
          key: "gdpr",
          title: "Data & Privacy",
          body: "Your data is stored locally and anonymously. We never sell or share personal data with third parties. You can delete your data at any time.",
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
      cta: "Continue",
    },
    step4: {
      title: "Set your intentions",
      sub: "A conscious anchor for this experience",
      intentions: [
        {
          title: "Acceptance",
          desc: "Welcoming all that arises, with open arms and no resistance",
          icon: "sun" as const,
        },
        {
          title: "Love",
          desc: "Opening your heart fully — to yourself and to those around you",
          icon: "heart" as const,
        },
        {
          title: "Forgiveness",
          desc: "Releasing what no longer serves, with compassion and grace",
          icon: "wind" as const,
        },
      ],
      cta: "Receive this intention",
      doneCta: "These are my intentions",
    },
    step5: {
      title: "Physical Intention",
      sub: "Nourish your body for the journey ahead",
      items: [
        "Eat a balanced meal 3–4 hours before you head out",
        "Choose complex carbohydrates and lean protein",
        "Avoid heavy, greasy, or processed foods",
        "A light snack 1 hour before is fine",
        "Stay hydrated — sip water steadily throughout the day",
      ],
      cta: "Understood",
    },
    step6: {
      title: "Nervous System Support",
      sub: "Rest as preparation",
      items: [
        {
          title: "Prioritise restful sleep",
          desc: "The night before sets the foundation for your whole experience",
        },
        {
          title: "Aim to rest before 23:00",
          desc: "Entering rest early optimises your hormonal balance",
        },
        {
          title: "Deep sleep stores energy",
          desc: "Your body does its deepest repair work while you rest",
        },
        {
          title: "A 20-minute nap helps",
          desc: "If short on sleep, a brief nap restores clarity and calm",
        },
      ],
      cta: "Understood",
    },
    step7: {
      title: "Essentials",
      sub: "What to bring with you",
      items: [
        { name: "Phone (100% charged)", why: "Your connection to your circle" },
        { name: "Single-use straws", why: "Prevents cross-contamination — never share" },
        { name: "Zinc (15–30 mg)", why: "Supports immune & neurotransmitter balance" },
        { name: "Magnesium (200–400 mg)", why: "Reduces tension, supports heart rhythm" },
        { name: "Electrolytes", why: "Maintains hydration and mineral balance" },
        { name: "Disinfecting wipes", why: "Clean surfaces before use" },
        { name: "Condoms & lubricant", why: "Protection and comfort" },
      ],
      cta: "All packed",
    },
    step8: {
      title: "Nurture Alarms",
      sub: "Your body will thank you",
      intake: "Intake Limit",
      intakeSub: "Total across your experience",
      units: ["units", "grams", "lines", "joints", "beers", "shots"],
      depart: "Departure Time",
      departSub: "Hours until you plan to head home",
      breathe: "Breathing Breaks",
      breatheSub: "Gentle pause reminders",
      water: "Hydration Reminders",
      waterSub: "Water check-ins",
      intervals: [30, 60, 90, 120] as const,
      waterIntervals: [20, 30, 45, 60] as const,
      cta: "Activate",
      skip: "Skip for now",
    },
  },
  de: {
    step1: {
      tagline: "mit liebe",
      subtitle: "Ein Kreis der Liebe für Festival-Communities",
      cta: "Starte deine Reise",
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
          title: "Orientierung — kein medizinischer Rat",
          body: "Prema bietet ausschließlich Orientierung und Unterstützung. Es ersetzt keinen medizinischen Rat. Bei Gefahr rufe sofort den Notarzt.",
        },
        {
          key: "gdpr",
          title: "Daten & Datenschutz",
          body: "Deine Daten werden lokal und anonym gespeichert. Wir verkaufen oder teilen keine persönlichen Daten.",
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
      cta: "Weiter",
    },
    step4: {
      title: "Setze deine Intentionen",
      sub: "Ein bewusster Anker für diese Erfahrung",
      intentions: [
        {
          title: "Akzeptanz",
          desc: "Alles willkommen heißen, was entsteht — mit offenen Armen",
          icon: "sun" as const,
        },
        {
          title: "Liebe",
          desc: "Dein Herz vollständig öffnen — für dich und die Menschen um dich herum",
          icon: "heart" as const,
        },
        {
          title: "Vergebung",
          desc: "Loslassen, was nicht mehr dient — mit Mitgefühl und Würde",
          icon: "wind" as const,
        },
      ],
      cta: "Diese Intention annehmen",
      doneCta: "Das sind meine Intentionen",
    },
    step5: {
      title: "Physische Intention",
      sub: "Nähre deinen Körper für die Reise",
      items: [
        "Iss 3–4 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit",
        "Wähle komplexe Kohlenhydrate und mageres Protein",
        "Vermeide schwere, fettige oder verarbeitete Speisen",
        "Ein leichter Snack 1 Stunde vorher ist in Ordnung",
        "Bleib hydriert — trinke den ganzen Tag über gleichmäßig",
      ],
      cta: "Verstanden",
    },
    step6: {
      title: "Nervensystem-Unterstützung",
      sub: "Ruhe als Vorbereitung",
      items: [
        {
          title: "Erholsamen Schlaf priorisieren",
          desc: "Die Nacht zuvor legt das Fundament für deine gesamte Erfahrung",
        },
        {
          title: "Vor 23:00 Uhr ruhen",
          desc: "Frühes Einschlafen optimiert dein Hormongleichgewicht",
        },
        {
          title: "Tiefschlaf speichert Energie",
          desc: "Dein Körper regeneriert sich am tiefsten während der Ruhe",
        },
        {
          title: "Ein 20-Minuten-Nickerchen hilft",
          desc: "Bei wenig Schlaf stellt ein kurzes Nickerchen Klarheit und Ruhe wieder her",
        },
      ],
      cta: "Verstanden",
    },
    step7: {
      title: "Essentials",
      sub: "Was du mitnehmen solltest",
      items: [
        { name: "Handy (100% geladen)", why: "Deine Verbindung zu deinem Kreis" },
        { name: "Einweg-Trinkhalme", why: "Verhindert Kreuzkontamination — niemals teilen" },
        { name: "Zink (15–30 mg)", why: "Unterstützt Immunsystem & Neurotransmitter-Balance" },
        { name: "Magnesium (200–400 mg)", why: "Reduziert Spannung, unterstützt Herzrhythmus" },
        { name: "Elektrolyte", why: "Hält Hydratation und Mineralstoffbalance aufrecht" },
        { name: "Desinfektionstücher", why: "Oberflächen vor Gebrauch reinigen" },
        { name: "Kondome & Gleitmittel", why: "Schutz und Komfort" },
      ],
      cta: "Alles eingepackt",
    },
    step8: {
      title: "Pflege-Erinnerungen",
      sub: "Dein Körper wird es dir danken",
      intake: "Einnahme-Limit",
      intakeSub: "Gesamt für deine Erfahrung",
      units: ["Einheiten", "Gramm", "Lines", "Joints", "Bier", "Shots"],
      depart: "Abfahrtzeit",
      departSub: "Stunden bis du nach Hause gehst",
      breathe: "Atempausen",
      breatheSub: "Sanfte Pausen-Erinnerungen",
      water: "Hydrations-Erinnerungen",
      waterSub: "Wasser-Check-ins",
      intervals: [30, 60, 90, 120] as const,
      waterIntervals: [20, 30, 45, 60] as const,
      cta: "Aktivieren",
      skip: "Überspringen",
    },
  },
};

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setLang } = useSession();

  const [step, setStep] = useState(1);
  const [uiLang, setUiLang] = useState<"en" | "de">("en");
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [intentionIndex, setIntentionIndex] = useState(0);
  const [essentialsDone, setEssentialsDone] = useState<Record<number, boolean>>({});
  const [intakeLimit, setIntakeLimit] = useState(3);
  const [intakeUnitIdx, setIntakeUnitIdx] = useState(0);
  const [departureHour, setDepartureHour] = useState(3);
  const [restInterval, setRestInterval] = useState(60);
  const [waterInterval, setWaterInterval] = useState(30);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const t = CONTENT[uiLang];

  const transition = (nextStep: number) => {
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

  const advanceIntention = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (intentionIndex < 2) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -30, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setIntentionIndex((i) => i + 1);
        slideAnim.setValue(30);
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start();
      });
    } else {
      transition(5);
    }
  };

  const handleLangChange = (l: "en" | "de") => {
    setUiLang(l);
    setLang(l);
    Haptics.selectionAsync();
  };

  const allAgreed = t.step2.disclaimers.every((d) => agreed[d.key]) === true;

  const saveAndFinish = async (withAlarms: boolean) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const pairs: [string, string][] = [
      ["prema_onboarded", "true"],
      ["prema_user_name", name.trim().toUpperCase()],
      ["prema_lang", uiLang],
    ];
    if (withAlarms) {
      pairs.push([
        "prema_care_alarms",
        JSON.stringify({
          intakeLimit,
          departureHour,
          breathingBreak: restInterval,
          hydrationSync: waterInterval,
        }),
      ]);
      pairs.push(["prema_intake_unit", t.step8.units[intakeUnitIdx]]);
    }
    await AsyncStorage.multiSet(pairs);
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
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                {
                  backgroundColor: s <= step ? colors.primary : colors.border,
                  flex: s <= step ? 2 : 1,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
          {step} / {TOTAL_STEPS}
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
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.langRow}>
              {(["en", "de"] as const).map((l, i) => (
                <React.Fragment key={l}>
                  <Pressable onPress={() => handleLangChange(l)}>
                    <Text
                      style={[
                        styles.langBtn,
                        { color: uiLang === l ? colors.primary : colors.mutedForeground },
                      ]}
                    >
                      {l.toUpperCase()}
                    </Text>
                  </Pressable>
                  {i === 0 && <Text style={{ color: colors.border, fontSize: 14 }}>|</Text>}
                </React.Fragment>
              ))}
            </View>

            <View style={styles.orbWrap}>
              <View style={[styles.orbGlow, { backgroundColor: colors.primary + "18" }]} />
              <View
                style={[
                  styles.orbCore,
                  { backgroundColor: colors.card, borderColor: colors.primary + "40" },
                ]}
              >
                <Feather name="heart" size={16} color={colors.primary + "80"} />
              </View>
            </View>

            <Text style={[styles.appTitle, { color: colors.foreground }]}>PREMA</Text>
            <Text style={[styles.tagline, { color: colors.primary }]}>{t.step1.tagline}</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t.step1.subtitle}</Text>

            <Pressable
              onPress={() => transition(2)}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 48 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                {t.step1.cta}
              </Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 2: DISCLAIMERS ─────────────────────── */}
        {step === 2 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="shield" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.step2.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.step2.sub}</Text>

            <View style={styles.disclaimerList}>
              {t.step2.disclaimers.map((d) => (
                <Pressable
                  key={d.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setAgreed((prev) => ({ ...prev, [d.key]: !prev[d.key] }));
                  }}
                  style={[
                    styles.disclaimerCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: agreed[d.key] ? colors.primary + "60" : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: agreed[d.key] ? colors.primary : "transparent",
                        borderColor: agreed[d.key] ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {agreed[d.key] && (
                      <Feather name="check" size={12} color={colors.primaryForeground} />
                    )}
                  </View>
                  <View style={styles.disclaimerText}>
                    <Text style={[styles.disclaimerTitle, { color: colors.foreground }]}>
                      {d.title}
                    </Text>
                    <Text style={[styles.disclaimerBody, { color: colors.mutedForeground }]}>
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
                  backgroundColor: allAgreed ? colors.primary : colors.border,
                  opacity: pressed && allAgreed ? 0.85 : 1,
                  marginTop: 24,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  { color: allAgreed ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {t.step2.cta}
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={allAgreed ? colors.primaryForeground : colors.mutedForeground}
              />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 3: NAME ─────────────────────────────── */}
        {step === 3 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="user" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.step3.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.step3.sub}</Text>

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
              style={[styles.langLabel, { color: colors.mutedForeground, marginTop: 28 }]}
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
                      backgroundColor: uiLang === l ? colors.primary : colors.card,
                      borderColor: uiLang === l ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.langOptionText,
                      { color: uiLang === l ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {l === "en" ? "English" : "Deutsch"}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => name.trim() && transition(4)}
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: name.trim() ? colors.primary : colors.border,
                  opacity: pressed && name.trim() ? 0.85 : 1,
                  marginTop: 36,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryBtnText,
                  { color: name.trim() ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {t.step3.cta}
              </Text>
              <Feather
                name="arrow-right"
                size={18}
                color={name.trim() ? colors.primaryForeground : colors.mutedForeground}
              />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 4: INTENTIONS ───────────────────────── */}
        {step === 4 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.intentionCounter, { color: colors.primary }]}>
              {intentionIndex + 1} / 3
            </Text>

            <View
              style={[
                styles.intentionOrb,
                { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
              ]}
            >
              <View style={[styles.intentionOrbGlow, { backgroundColor: colors.primary + "20" }]} />
              <Feather
                name={t.step4.intentions[intentionIndex].icon}
                size={44}
                color={colors.primary}
              />
            </View>

            <Text style={[styles.intentionTitle, { color: colors.foreground }]}>
              {t.step4.intentions[intentionIndex].title}
            </Text>
            <Text style={[styles.intentionDesc, { color: colors.mutedForeground }]}>
              {t.step4.intentions[intentionIndex].desc}
            </Text>

            <View
              style={[
                styles.intentionDots,
              ]}
            >
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.intentionDot,
                    {
                      backgroundColor:
                        i <= intentionIndex ? colors.primary : colors.border,
                      width: i === intentionIndex ? 20 : 8,
                    },
                  ]}
                />
              ))}
            </View>

            <Pressable
              onPress={advanceIntention}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 40 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                {intentionIndex < 2 ? t.step4.cta : t.step4.doneCta}
              </Text>
              <Feather
                name={intentionIndex < 2 ? "arrow-right" : "check"}
                size={18}
                color={colors.primaryForeground}
              />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 5: PHYSICAL INTENTION ───────────────── */}
        {step === 5 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: "#10B981" + "18" }]}>
              <Feather name="activity" size={28} color="#10B981" />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.step5.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.step5.sub}</Text>

            <View style={styles.listItems}>
              {t.step5.items.map((item, i) => (
                <View
                  key={i}
                  style={[styles.listItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.listDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.listItemText, { color: colors.foreground }]}>{item}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => transition(6)}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 32 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                {t.step5.cta}
              </Text>
              <Feather name="check" size={18} color={colors.primaryForeground} />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 6: NERVOUS SYSTEM SUPPORT ───────────── */}
        {step === 6 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: "#A78BFA18" }]}>
              <Feather name="moon" size={28} color="#A78BFA" />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.step6.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.step6.sub}</Text>

            <View style={styles.nssItems}>
              {t.step6.items.map((item, i) => (
                <View
                  key={i}
                  style={[styles.nssItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <View style={[styles.nssDot, { backgroundColor: "#A78BFA" }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nssItemTitle, { color: colors.foreground }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.nssItemDesc, { color: colors.mutedForeground }]}>
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => transition(7)}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 32 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                {t.step6.cta}
              </Text>
              <Feather name="check" size={18} color={colors.primaryForeground} />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 7: ESSENTIALS ───────────────────────── */}
        {step === 7 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: "#F59E0B18" }]}>
              <Feather name="package" size={28} color="#F59E0B" />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.step7.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.step7.sub}</Text>

            <View style={styles.essentialsList}>
              {t.step7.items.map((item, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setEssentialsDone((prev) => ({ ...prev, [i]: !prev[i] }));
                  }}
                  style={[
                    styles.essentialItem,
                    {
                      backgroundColor: essentialsDone[i] ? colors.primary + "10" : colors.card,
                      borderColor: essentialsDone[i] ? colors.primary + "50" : colors.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.essentialCheck,
                      {
                        backgroundColor: essentialsDone[i] ? colors.primary : "transparent",
                        borderColor: essentialsDone[i] ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {essentialsDone[i] && (
                      <Feather name="check" size={11} color={colors.primaryForeground} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.essentialName, { color: colors.foreground }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.essentialWhy, { color: colors.mutedForeground }]}>
                      {item.why}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => transition(8)}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 32 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                {t.step7.cta}
              </Text>
              <Feather name="arrow-right" size={18} color={colors.primaryForeground} />
            </Pressable>
          </ScrollView>
        )}

        {/* ── STEP 8: NURTURE ALARMS ────────────────────── */}
        {step === 8 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="bell" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.step8.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.step8.sub}</Text>

            <View style={styles.alarmCards}>

              {/* Intake Limit */}
              <View style={[styles.alarmCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.alarmCardHeader}>
                  <Feather name="zap-off" size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alarmCardTitle, { color: colors.foreground }]}>
                      {t.step8.intake}
                    </Text>
                    <Text style={[styles.alarmCardSub, { color: colors.mutedForeground }]}>
                      {t.step8.intakeSub}
                    </Text>
                  </View>
                </View>
                <View style={styles.alarmStepper}>
                  <Pressable
                    onPress={() => { Haptics.selectionAsync(); setIntakeLimit((p) => Math.max(0, p - 1)); }}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                  >
                    <Feather name="minus" size={16} color={colors.foreground} />
                  </Pressable>
                  <Text style={[styles.stepperValue, { color: colors.foreground }]}>{intakeLimit}</Text>
                  <Pressable
                    onPress={() => { Haptics.selectionAsync(); setIntakeLimit((p) => Math.min(20, p + 1)); }}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                  >
                    <Feather name="plus" size={16} color={colors.foreground} />
                  </Pressable>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginTop: 12 }}
                  contentContainerStyle={styles.unitRow}
                >
                  {t.step8.units.map((u, i) => (
                    <Pressable
                      key={i}
                      onPress={() => { Haptics.selectionAsync(); setIntakeUnitIdx(i); }}
                      style={[
                        styles.unitPill,
                        {
                          backgroundColor: intakeUnitIdx === i ? colors.primary : colors.background,
                          borderColor: intakeUnitIdx === i ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.unitPillText,
                          { color: intakeUnitIdx === i ? colors.primaryForeground : colors.mutedForeground },
                        ]}
                      >
                        {u}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Departure Time */}
              <View style={[styles.alarmCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.alarmCardHeader}>
                  <Feather name="clock" size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alarmCardTitle, { color: colors.foreground }]}>
                      {t.step8.depart}
                    </Text>
                    <Text style={[styles.alarmCardSub, { color: colors.mutedForeground }]}>
                      {t.step8.departSub}
                    </Text>
                  </View>
                </View>
                <View style={styles.alarmStepper}>
                  <Pressable
                    onPress={() => { Haptics.selectionAsync(); setDepartureHour((p) => Math.max(1, p - 1)); }}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                  >
                    <Feather name="minus" size={16} color={colors.foreground} />
                  </Pressable>
                  <Text style={[styles.stepperValue, { color: colors.foreground }]}>
                    {departureHour}h
                  </Text>
                  <Pressable
                    onPress={() => { Haptics.selectionAsync(); setDepartureHour((p) => Math.min(24, p + 1)); }}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
                  >
                    <Feather name="plus" size={16} color={colors.foreground} />
                  </Pressable>
                </View>
              </View>

              {/* Breathing Breaks */}
              <View style={[styles.alarmCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.alarmCardHeader}>
                  <Feather name="wind" size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alarmCardTitle, { color: colors.foreground }]}>
                      {t.step8.breathe}
                    </Text>
                    <Text style={[styles.alarmCardSub, { color: colors.mutedForeground }]}>
                      {t.step8.breatheSub}
                    </Text>
                  </View>
                </View>
                <View style={styles.intervalRow}>
                  {t.step8.intervals.map((iv) => (
                    <Pressable
                      key={iv}
                      onPress={() => { Haptics.selectionAsync(); setRestInterval(iv); }}
                      style={[
                        styles.intervalPill,
                        {
                          backgroundColor: restInterval === iv ? colors.primary : colors.background,
                          borderColor: restInterval === iv ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.intervalText,
                          { color: restInterval === iv ? colors.primaryForeground : colors.mutedForeground },
                        ]}
                      >
                        {iv}m
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Hydration */}
              <View style={[styles.alarmCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.alarmCardHeader}>
                  <Feather name="droplet" size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alarmCardTitle, { color: colors.foreground }]}>
                      {t.step8.water}
                    </Text>
                    <Text style={[styles.alarmCardSub, { color: colors.mutedForeground }]}>
                      {t.step8.waterSub}
                    </Text>
                  </View>
                </View>
                <View style={styles.intervalRow}>
                  {t.step8.waterIntervals.map((iv) => (
                    <Pressable
                      key={iv}
                      onPress={() => { Haptics.selectionAsync(); setWaterInterval(iv); }}
                      style={[
                        styles.intervalPill,
                        {
                          backgroundColor: waterInterval === iv ? colors.primary : colors.background,
                          borderColor: waterInterval === iv ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.intervalText,
                          { color: waterInterval === iv ? colors.primaryForeground : colors.mutedForeground },
                        ]}
                      >
                        {iv}m
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

            </View>

            <Pressable
              onPress={() => saveAndFinish(true)}
              style={({ pressed }) => [
                styles.primaryBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, marginTop: 32 },
              ]}
            >
              <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>
                {t.step8.cta}
              </Text>
              <Feather name="bell" size={18} color={colors.primaryForeground} />
            </Pressable>

            <Pressable onPress={() => saveAndFinish(false)} style={{ marginTop: 16, paddingVertical: 8 }}>
              <Text style={[styles.skipText, { color: colors.mutedForeground }]}>{t.step8.skip}</Text>
            </Pressable>
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
    gap: 4,
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
  intentionCounter: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 32,
  },
  intentionOrb: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    position: "relative",
  },
  intentionOrbGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  intentionTitle: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  intentionDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  intentionDots: {
    flexDirection: "row",
    gap: 8,
    marginTop: 28,
    alignItems: "center",
  },
  intentionDot: {
    height: 8,
    borderRadius: 4,
  },
  listItems: {
    width: "100%",
    gap: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  listDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  listItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  nssItems: {
    width: "100%",
    gap: 10,
  },
  nssItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  nssDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    flexShrink: 0,
  },
  nssItemTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  nssItemDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  essentialsList: {
    width: "100%",
    gap: 10,
  },
  essentialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  essentialCheck: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  essentialName: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  essentialWhy: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
    marginTop: 2,
  },
  alarmCards: {
    width: "100%",
    gap: 12,
  },
  alarmCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  alarmCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  alarmCardTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
  alarmCardSub: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  alarmStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    justifyContent: "center",
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
    minWidth: 60,
    textAlign: "center",
  },
  unitRow: {
    flexDirection: "row",
    gap: 8,
    paddingRight: 4,
  },
  unitPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  unitPillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "lowercase",
  },
  intervalRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  intervalPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  intervalText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
  },
  skipText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
