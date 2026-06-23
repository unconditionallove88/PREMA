import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

import { AnatomicalHeart } from "@/components/AnatomicalHeart";
import { CircleOfLove } from "@/components/CircleOfLove";
import { WaterGlass } from "@/components/WaterGlass";
import { useSession, type Vibe } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const TOTAL_STEPS = 9;

const CONTENT = {
  en: {
    landing: {
      hint: "Choose your light and your language",
      entering: "Entering the circle…",
      bright: "Bright",
      dark: "Dark",
    },
    bio: {
      title: "Tell us about you",
      sub: "This stays on your device",
      name: "Your name or a soul-name",
      weight: "Weight (kg)",
      height: "Height (cm)",
      cta: "Continue",
    },
    welcome: {
      title: "Welcome to Prema",
      sub: "We are preparing your circle…",
    },
    intention: {
      title: "Set your intention",
      sub: "Choose a conscious anchor for your journey",
      options: [
        { key: "acceptance", title: "Acceptance", affirm: "I accept myself fully" },
        { key: "forgiveness", title: "Develop forgiveness", affirm: "I forgive myself fully" },
        { key: "respect", title: "Develop respect", affirm: "I respect myself fully" },
      ],
      cta: "I am consciously setting this intention, regardless of my inner contradictions and my relation to it",
    },
    essentials: {
      title: "Essentials",
      sub: "Everything you'll want with you",
      items: [
        { name: "Zinc & Magnesium", why: "Supports immune balance & calmer nerves" },
        { name: "Credit-card plates & single-use straws", why: "A clean surface — never share" },
        { name: "Electrolytes", why: "Keeps hydration & minerals balanced" },
        { name: "Condoms & lubricant", why: "Protection and comfort" },
        { name: "Disinfecting wipes", why: "Clean surfaces before use" },
        { name: "Phone 100% charged", why: "Your connection to your circle" },
      ],
      cta: "I have everything I need",
    },
    temple: {
      title: "Temple support",
      sub: "Honour your body's needs for a joyful journey",
      items: [
        {
          title: "Eat a balanced meal 3–4 hours before",
          detail: "e.g. a grain bowl with brown rice, vegetables and grilled chicken, fish or tofu.",
        },
        {
          title: "Choose complex carbs & lean protein",
          detail: "Carbs: oats, quinoa, sweet potato, whole-grain bread. Protein: eggs, lentils, beans, chicken, fish, tofu.",
        },
        {
          title: "Avoid heavy, greasy or processed foods",
          detail: "e.g. fast food, deep-fried dishes, chips, burgers, sugary packaged snacks.",
        },
        {
          title: "A light snack 1 hour before is fine",
          detail: "e.g. a banana, a handful of nuts, or some yoghurt.",
        },
        { title: "Stay hydrated", detail: "" },
        {
          title: "Skip caffeine drinks",
          detail: "Coffee & energy drinks are diuretics — they flush out water and strain your heart while your body is already working hard.",
        },
      ],
      waterDyn: (l: number) =>
        `Aim for about ${l} L of water today — sip steadily, don't gulp it all at once.`,
      waterFallback: "Aim for roughly 2–3 L of water today — sip steadily throughout.",
      cta: "I love my body",
    },
    nervous: {
      title: "Nervous system support",
      sub: "Rest is preparation",
      items: [
        "Aim to be in bed before 23:00",
        "Entering rest early optimises your hormonal balance",
        "Your body stores energy during deep sleep",
      ],
      cta: "I am aware",
    },
    nurture: {
      title: "Nurture",
      sub: "Gentle reminders, never alarms",
      hydrationTitle: "Hydration sync",
      hydrationSub: "",
      restTitle: "Rest intervals",
      restSub: "",
      intakeTitle: "Intake intention",
      intakeSub: "A conscious intention — not a hard limit.",
      every: (n: number) => `every ${n} min`,
      units: ["grams", "lines", "bumps", "ml", "joints", "beers", "shots", "wines", "energy drinks"],
      cta: "Continue",
    },
    journey: {
      title: "Journey with Conscious",
      sub: "Three principles to carry with you",
      items: [
        {
          title: "Be conscious before any choice",
          detail: "Remember your body and your mind before you decide.",
        },
        {
          title: "Drink pure water regularly",
          detail: "Follow your Nurture timing and keep yourself hydrated.",
        },
        {
          title: "Take rests",
          detail: "Remember your rest intervals — your body will be thankful to you.",
        },
      ],
      cta: "Enter the circle",
    },
  },
  de: {
    landing: {
      hint: "Wähle dein Licht und deine Sprache",
      entering: "Du betrittst den Kreis…",
      bright: "Hell",
      dark: "Dunkel",
    },
    bio: {
      title: "Erzähl uns von dir",
      sub: "Bleibt auf deinem Gerät",
      name: "Dein Name oder ein Seelenname",
      weight: "Gewicht (kg)",
      height: "Größe (cm)",
      cta: "Weiter",
    },
    welcome: {
      title: "Willkommen bei Prema",
      sub: "Wir bereiten deinen Kreis vor…",
    },
    intention: {
      title: "Setze deine Intention",
      sub: "Wähle einen bewussten Anker für deine Reise",
      options: [
        { key: "acceptance", title: "Akzeptanz", affirm: "Ich akzeptiere mich vollständig" },
        { key: "forgiveness", title: "Vergebung entwickeln", affirm: "Ich vergebe mir vollständig" },
        { key: "respect", title: "Respekt entwickeln", affirm: "Ich respektiere mich vollständig" },
      ],
      cta: "Ich setze diese Intention bewusst — ungeachtet meiner inneren Widersprüche und meiner Beziehung zu ihr",
    },
    essentials: {
      title: "Essentials",
      sub: "Alles, was du dabeihaben willst",
      items: [
        { name: "Zink & Magnesium", why: "Stärkt Immunsystem & beruhigt die Nerven" },
        { name: "Kreditkarten-Plättchen & Einweg-Halme", why: "Eine saubere Oberfläche — niemals teilen" },
        { name: "Elektrolyte", why: "Hält Hydration & Mineralien im Gleichgewicht" },
        { name: "Kondome & Gleitmittel", why: "Schutz und Komfort" },
        { name: "Desinfektionstücher", why: "Oberflächen vor Gebrauch reinigen" },
        { name: "Handy 100% geladen", why: "Deine Verbindung zu deinem Kreis" },
      ],
      cta: "Ich habe alles, was ich brauche",
    },
    temple: {
      title: "Tempel-Pflege",
      sub: "Ehre die Bedürfnisse deines Körpers für eine freudvolle Reise",
      items: [
        {
          title: "Iss 3–4 Stunden vorher eine ausgewogene Mahlzeit",
          detail: "z.B. eine Bowl mit braunem Reis, Gemüse und gegrilltem Hähnchen, Fisch oder Tofu.",
        },
        {
          title: "Wähle komplexe Kohlenhydrate & mageres Protein",
          detail: "Kohlenhydrate: Haferflocken, Quinoa, Süßkartoffel, Vollkornbrot. Protein: Eier, Linsen, Bohnen, Hähnchen, Fisch, Tofu.",
        },
        {
          title: "Vermeide schwere, fettige oder verarbeitete Speisen",
          detail: "z.B. Fast Food, Frittiertes, Chips, Burger, zuckrige Snacks.",
        },
        {
          title: "Ein leichter Snack 1 Stunde vorher ist okay",
          detail: "z.B. eine Banane, eine Handvoll Nüsse oder etwas Joghurt.",
        },
        { title: "Bleib hydriert", detail: "" },
        {
          title: "Verzichte auf koffeinhaltige Getränke",
          detail: "Kaffee & Energy Drinks entwässern (Diuretika) und belasten dein Herz, während dein Körper ohnehin arbeitet.",
        },
      ],
      waterDyn: (l: number) =>
        `Trink heute etwa ${l} L Wasser — in kleinen Schlucken über den Tag verteilt.`,
      waterFallback: "Trink heute ungefähr 2–3 L Wasser — gleichmäßig über den Tag.",
      cta: "Ich liebe meinen Körper",
    },
    nervous: {
      title: "Nervensystem-Unterstützung",
      sub: "Ruhe ist Vorbereitung",
      items: [
        "Sei vor 23:00 Uhr im Bett",
        "Frühe Ruhe optimiert dein Hormongleichgewicht",
        "Dein Körper speichert Energie im Tiefschlaf",
      ],
      cta: "Ich bin mir bewusst",
    },
    nurture: {
      title: "Nurture",
      sub: "Sanfte Erinnerungen, keine Alarme",
      hydrationTitle: "Hydrations-Sync",
      hydrationSub: "",
      restTitle: "Ruhe-Intervalle",
      restSub: "",
      intakeTitle: "Einnahme-Intention",
      intakeSub: "Eine bewusste Absicht — kein striktes Limit.",
      every: (n: number) => `alle ${n} Min.`,
      units: ["Gramm", "Lines", "Bumps", "ml", "Joints", "Bier", "Shots", "Wein", "Energy Drinks"],
      cta: "Weiter",
    },
    journey: {
      title: "Reise mit Bewusstsein",
      sub: "Drei Prinzipien, die du mitnimmst",
      items: [
        {
          title: "Sei bewusst vor jeder Entscheidung",
          detail: "Denk an deinen Körper und deinen Geist, bevor du wählst.",
        },
        {
          title: "Trink regelmäßig reines Wasser",
          detail: "Folge deinem Nurture-Timing und bleib hydriert.",
        },
        {
          title: "Gönn dir Ruhe",
          detail: "Denk an deine Ruhe-Intervalle — dein Körper wird es dir danken.",
        },
      ],
      cta: "Betritt den Kreis",
    },
  },
};

const WATER_INTERVALS = [30, 45, 60, 90] as const;
const REST_INTERVALS = [30, 60, 90, 120] as const;

function waterLiters(weightKg: number | null, heightCm: number | null): number | null {
  if (!weightKg || weightKg <= 0) return null;
  let ml = weightKg * 35;
  if (heightCm && heightCm > 180) ml += (heightCm - 180) * 10;
  return Math.round(ml / 100) / 10;
}

/** A full moon disc (violet) for the dark vibe. */
function FullMoon({ size, color }: { size: number; color: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: color,
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
      }}
    >
      <View
        style={{
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: (size * 0.5) / 2,
          backgroundColor: "rgba(255,255,255,0.22)",
        }}
      />
    </View>
  );
}

/** A console icon that springs / bounces when touched. */
function TouchIcon({
  selected,
  onPress,
  label,
  colors,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  label?: string;
  colors: ReturnType<typeof useColors>;
  children: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.22, useNativeDriver: true, speed: 60, bounciness: 20 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 12 }),
    ]).start();
    onPress();
  };
  return (
    <Pressable onPress={press} style={styles.sideTouch}>
      <Animated.View style={[styles.sideIcon, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
      {!!label && (
        <Text style={[styles.sideLabel, { color: selected ? colors.primary : colors.mutedForeground }]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setLang, setTheme, setIntention, setCareAlarms, completeOnboarding } = useSession();

  const [step, setStep] = useState(1);
  const [uiLang, setUiLang] = useState<"en" | "de">("en");
  const [langPicked, setLangPicked] = useState(false);
  const [vibe, setVibe] = useState<Vibe | null>(null);

  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [intentionIdx, setIntentionIdx] = useState<number | null>(null);
  const [essentials, setEssentials] = useState<Record<number, boolean>>({});
  const [temple, setTemple] = useState<Record<number, boolean>>({});
  const [nervous, setNervous] = useState<Record<number, boolean>>({});
  const [journey, setJourney] = useState<Record<number, boolean>>({});

  const [waterInterval, setWaterInterval] = useState(30);
  const [restInterval, setRestInterval] = useState(60);
  const [intakeAmount, setIntakeAmount] = useState(3);
  const [intakeUnitIdx, setIntakeUnitIdx] = useState(0);

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

  // Landing: auto-advance once both a vibe and a language are chosen.
  useEffect(() => {
    if (step === 1 && langPicked && vibe) {
      const id = setTimeout(() => transition(2), 900);
      return () => clearTimeout(id);
    }
  }, [step, langPicked, vibe]);

  // Welcome: auto-advance after 3 seconds.
  useEffect(() => {
    if (step === 3) {
      const id = setTimeout(() => transition(4), 3000);
      return () => clearTimeout(id);
    }
  }, [step]);

  const handleLang = (l: "en" | "de") => {
    setUiLang(l);
    setLang(l);
    setLangPicked(true);
  };

  const handleVibe = (v: Vibe) => {
    setVibe(v);
    setTheme(v);
  };

  const liters = waterLiters(parseFloat(weight) || null, parseFloat(height) || null);
  const bioReady = name.trim().length > 0 && (parseFloat(weight) || 0) > 0 && (parseFloat(height) || 0) > 0;
  const essentialsReady = t.essentials.items.every((_, i) => essentials[i]);
  const templeReady = t.temple.items.every((_, i) => temple[i]);
  const nervousReady = t.nervous.items.every((_, i) => nervous[i]);
  const journeyReady = t.journey.items.every((_, i) => journey[i]);

  const saveAndFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const w = parseFloat(weight) || null;
    const h = parseFloat(height) || null;
    const finalVibe: Vibe = vibe ?? "bright";
    const affirm = intentionIdx != null ? t.intention.options[intentionIdx].affirm : "";
    const alarms = {
      intakeLimit: intakeAmount,
      departureHour: 3,
      breathingBreak: restInterval,
      hydrationSync: waterInterval,
    };
    setLang(uiLang);
    setTheme(finalVibe);
    setIntention(affirm || null);
    setCareAlarms(alarms);
    await AsyncStorage.multiSet([
      ["prema_onboarded", "true"],
      ["prema_user_name", name.trim().toUpperCase()],
      ["prema_lang", uiLang],
      ["prema_theme", finalVibe],
      ["prema_profile", JSON.stringify({ name: name.trim(), weightKg: w, heightCm: h })],
      ["prema_intention", affirm],
      ["prema_care_alarms", JSON.stringify(alarms)],
      ["prema_intake_unit", t.nurture.units[intakeUnitIdx]],
    ]);
    completeOnboarding();
    router.replace("/(tabs)");
  };

  const showProgress = step !== 1 && step !== 3;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {showProgress && (
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
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
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
      )}

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        {/* ── STEP 1: LANDING ─────────────────────────── */}
        {step === 1 && (
          <View style={[styles.landing, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {/* Center — the Circle of Love */}
            <View style={styles.landingCenter}>
              <CircleOfLove size={240} />
              <Text style={[styles.appTitle, { color: colors.foreground }]}>PREMA</Text>
              <Text style={[styles.landingHint, { color: colors.mutedForeground }]}>
                {vibe && langPicked ? t.landing.entering : t.landing.hint}
              </Text>
            </View>

            {/* Bottom console — bottom tab bar, like the dashboard menu */}
            <View
              style={[
                styles.bottomConsole,
                { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 },
              ]}
            >
              <TouchIcon selected={vibe === "bright"} onPress={() => handleVibe("bright")} colors={colors} label={t.landing.bright}>
                <Feather name="sun" size={20} color={vibe === "bright" ? colors.primary : "#FBBF24"} />
              </TouchIcon>
              <TouchIcon selected={vibe === "dark"} onPress={() => handleVibe("dark")} colors={colors} label={t.landing.dark}>
                <FullMoon size={20} color="#8B5CF6" />
              </TouchIcon>
              <TouchIcon selected={langPicked && uiLang === "en"} onPress={() => handleLang("en")} colors={colors} label="English">
                <Text style={[styles.langGlyph, { color: langPicked && uiLang === "en" ? colors.primary : colors.foreground }]}>
                  EN
                </Text>
              </TouchIcon>
              <TouchIcon selected={langPicked && uiLang === "de"} onPress={() => handleLang("de")} colors={colors} label="Deutsch">
                <Text style={[styles.langGlyph, { color: langPicked && uiLang === "de" ? colors.primary : colors.foreground }]}>
                  DE
                </Text>
              </TouchIcon>
            </View>
          </View>
        )}

        {/* ── STEP 2: NAME / WEIGHT / HEIGHT ──────────── */}
        {step === 2 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.stepTitle, { color: colors.foreground, marginTop: 12 }]}>{t.bio.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.bio.sub}</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t.bio.name}
              placeholderTextColor={colors.mutedForeground}
              maxLength={32}
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: name.trim() ? colors.primary + "60" : colors.border,
                  color: colors.foreground,
                },
              ]}
            />

            <View style={styles.bioRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t.bio.weight}</Text>
                <TextInput
                  value={weight}
                  onChangeText={(v) => setWeight(v.replace(/[^0-9.]/g, ""))}
                  placeholder="70"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  maxLength={3}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: (parseFloat(weight) || 0) > 0 ? colors.primary + "60" : colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t.bio.height}</Text>
                <TextInput
                  value={height}
                  onChangeText={(v) => setHeight(v.replace(/[^0-9.]/g, ""))}
                  placeholder="175"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  maxLength={3}
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: (parseFloat(height) || 0) > 0 ? colors.primary + "60" : colors.border,
                      color: colors.foreground,
                    },
                  ]}
                />
              </View>
            </View>

            <PrimaryButton
              label={t.bio.cta}
              icon="arrow-right"
              active={bioReady}
              colors={colors}
              onPress={() => bioReady && transition(3)}
              style={{ marginTop: 36 }}
            />
          </ScrollView>
        )}

        {/* ── STEP 3: WELCOME ─────────────────────────── */}
        {step === 3 && (
          <View style={[styles.landing, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.landingCenter}>
              <CircleOfLove size={230} />
              <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>{t.welcome.title}</Text>
              {!!name.trim() && (
                <Text style={[styles.welcomeName, { color: colors.primary }]}>
                  {name.trim().toUpperCase()}
                </Text>
              )}
              <Text style={[styles.landingHint, { color: colors.mutedForeground }]}>{t.welcome.sub}</Text>
            </View>
          </View>
        )}

        {/* ── STEP 4: INTENTION ───────────────────────── */}
        {step === 4 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="compass" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.intention.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.intention.sub}</Text>

            <View style={styles.intentionRow}>
              {t.intention.options.map((opt, i) => {
                const sel = intentionIdx === i;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setIntentionIdx(i);
                    }}
                    style={[
                      styles.intentionCard,
                      {
                        backgroundColor: sel ? colors.primary + "1A" : colors.card,
                        borderColor: sel ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.intentionRadio,
                        { borderColor: sel ? colors.primary : colors.border, backgroundColor: sel ? colors.primary : "transparent" },
                      ]}
                    >
                      {sel && <Feather name="check" size={11} color={colors.primaryForeground} />}
                    </View>
                    <Text style={[styles.intentionCardTitle, { color: colors.foreground }]}>{opt.title}</Text>
                    <Text style={[styles.intentionCardAffirm, { color: sel ? colors.primary : colors.mutedForeground }]}>
                      {opt.affirm}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              label={t.intention.cta}
              icon="check"
              active={intentionIdx != null}
              colors={colors}
              onPress={() => intentionIdx != null && transition(5)}
              style={{ marginTop: 32 }}
              small
            />
          </ScrollView>
        )}

        {/* ── STEP 5: ESSENTIALS ──────────────────────── */}
        {step === 5 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: "#F59E0B18" }]}>
              <Feather name="package" size={28} color="#F59E0B" />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.essentials.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.essentials.sub}</Text>

            <View style={styles.checkList}>
              {t.essentials.items.map((item, i) => (
                <CheckRow
                  key={i}
                  checked={!!essentials[i]}
                  onPress={() => setEssentials((p) => ({ ...p, [i]: !p[i] }))}
                  title={item.name}
                  detail={item.why}
                  colors={colors}
                />
              ))}
            </View>

            <PrimaryButton
              label={t.essentials.cta}
              icon="arrow-right"
              active={essentialsReady}
              colors={colors}
              onPress={() => essentialsReady && transition(6)}
              style={{ marginTop: 28 }}
            />
          </ScrollView>
        )}

        {/* ── STEP 6: TEMPLE SUPPORT ──────────────────── */}
        {step === 6 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: "#10B98118" }]}>
              <Feather name="activity" size={28} color="#10B981" />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.temple.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.temple.sub}</Text>

            <View style={styles.checkList}>
              {t.temple.items.map((item, i) => {
                const detail =
                  i === 4
                    ? liters
                      ? t.temple.waterDyn(liters)
                      : t.temple.waterFallback
                    : item.detail;
                return (
                  <CheckRow
                    key={i}
                    checked={!!temple[i]}
                    onPress={() => setTemple((p) => ({ ...p, [i]: !p[i] }))}
                    title={item.title}
                    detail={detail}
                    colors={colors}
                  />
                );
              })}
            </View>

            <PrimaryButton
              label={t.temple.cta}
              icon="heart"
              active={templeReady}
              colors={colors}
              onPress={() => templeReady && transition(7)}
              style={{ marginTop: 28 }}
            />
          </ScrollView>
        )}

        {/* ── STEP 7: NERVOUS SYSTEM ──────────────────── */}
        {step === 7 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: "#A78BFA18" }]}>
              <Feather name="moon" size={28} color="#A78BFA" />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.nervous.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.nervous.sub}</Text>

            <View style={styles.checkList}>
              {t.nervous.items.map((item, i) => (
                <CheckRow
                  key={i}
                  checked={!!nervous[i]}
                  onPress={() => setNervous((p) => ({ ...p, [i]: !p[i] }))}
                  title={item}
                  colors={colors}
                />
              ))}
            </View>

            <PrimaryButton
              label={t.nervous.cta}
              icon="arrow-right"
              active={nervousReady}
              colors={colors}
              onPress={() => nervousReady && transition(8)}
              style={{ marginTop: 28 }}
            />
          </ScrollView>
        )}

        {/* ── STEP 8: NURTURE ─────────────────────────── */}
        {step === 8 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="feather" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.nurture.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.nurture.sub}</Text>

            <View style={styles.nurtureCards}>
              {/* Hydration sync */}
              <View style={[styles.nurtureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.nurtureHeader}>
                  <WaterGlass size={34} color="#38BDF8" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nurtureTitle, { color: colors.foreground }]}>{t.nurture.hydrationTitle}</Text>
                    {!!t.nurture.hydrationSub && (
                      <Text style={[styles.nurtureSub, { color: colors.mutedForeground }]}>{t.nurture.hydrationSub}</Text>
                    )}
                  </View>
                </View>
                <IntervalPills
                  values={WATER_INTERVALS}
                  selected={waterInterval}
                  onSelect={setWaterInterval}
                  fmt={t.nurture.every}
                  colors={colors}
                />
              </View>

              {/* Rest intervals */}
              <View style={[styles.nurtureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.nurtureHeader}>
                  <AnatomicalHeart size={34} color="#E0556A" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nurtureTitle, { color: colors.foreground }]}>{t.nurture.restTitle}</Text>
                    {!!t.nurture.restSub && (
                      <Text style={[styles.nurtureSub, { color: colors.mutedForeground }]}>{t.nurture.restSub}</Text>
                    )}
                  </View>
                </View>
                <IntervalPills
                  values={REST_INTERVALS}
                  selected={restInterval}
                  onSelect={setRestInterval}
                  fmt={t.nurture.every}
                  colors={colors}
                />
              </View>

              {/* Intake intention */}
              <View style={[styles.nurtureCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.nurtureHeader}>
                  <View style={[styles.intakeGlyph, { backgroundColor: colors.primary + "1A" }]}>
                    <Feather name="target" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nurtureTitle, { color: colors.foreground }]}>{t.nurture.intakeTitle}</Text>
                    <Text style={[styles.nurtureSub, { color: colors.mutedForeground }]}>{t.nurture.intakeSub}</Text>
                  </View>
                </View>
                <View style={styles.stepper}>
                  <Pressable
                    onPress={() => { Haptics.selectionAsync(); setIntakeAmount((p) => Math.max(0, p - 1)); }}
                    style={[styles.stepperBtn, { borderColor: colors.border }]}
                  >
                    <Feather name="minus" size={16} color={colors.foreground} />
                  </Pressable>
                  <Text style={[styles.stepperValue, { color: colors.foreground }]}>{intakeAmount}</Text>
                  <Pressable
                    onPress={() => { Haptics.selectionAsync(); setIntakeAmount((p) => Math.min(40, p + 1)); }}
                    style={[styles.stepperBtn, { borderColor: colors.border }]}
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
                  {t.nurture.units.map((u, i) => (
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
            </View>

            <PrimaryButton
              label={t.nurture.cta}
              icon="arrow-right"
              active
              colors={colors}
              onPress={() => transition(9)}
              style={{ marginTop: 28 }}
            />
          </ScrollView>
        )}

        {/* ── STEP 9: JOURNEY WITH CONSCIOUS ──────────── */}
        {step === 9 && (
          <ScrollView
            contentContainerStyle={[styles.stepContainer, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.iconBadge, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="sunrise" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>{t.journey.title}</Text>
            <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>{t.journey.sub}</Text>

            <View style={styles.checkList}>
              {t.journey.items.map((item, i) => (
                <CheckRow
                  key={i}
                  checked={!!journey[i]}
                  onPress={() => setJourney((p) => ({ ...p, [i]: !p[i] }))}
                  title={item.title}
                  detail={item.detail}
                  colors={colors}
                />
              ))}
            </View>

            <PrimaryButton
              label={t.journey.cta}
              icon="arrow-right"
              active={journeyReady}
              colors={colors}
              onPress={() => journeyReady && saveAndFinish()}
              style={{ marginTop: 28 }}
            />
          </ScrollView>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

/* ── Shared sub-components ───────────────────────── */

function PrimaryButton({
  label,
  icon,
  active,
  colors,
  onPress,
  style,
  small,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  active: boolean;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
  style?: object;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!active}
      style={({ pressed }) => [
        styles.primaryBtn,
        {
          backgroundColor: active ? colors.primary : colors.border,
          opacity: pressed && active ? 0.85 : 1,
          minHeight: small ? undefined : 60,
          paddingVertical: small ? 16 : 0,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.primaryBtnText,
          { color: active ? colors.primaryForeground : colors.mutedForeground, fontSize: small ? 11 : 13, flexShrink: 1 },
        ]}
      >
        {label}
      </Text>
      <Feather name={icon} size={18} color={active ? colors.primaryForeground : colors.mutedForeground} />
    </Pressable>
  );
}

function CheckRow({
  checked,
  onPress,
  title,
  detail,
  colors,
}: {
  checked: boolean;
  onPress: () => void;
  title: string;
  detail?: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[
        styles.checkRow,
        {
          backgroundColor: checked ? colors.primary + "12" : colors.card,
          borderColor: checked ? colors.primary + "55" : colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.checkBox,
          { backgroundColor: checked ? colors.primary : "transparent", borderColor: checked ? colors.primary : colors.border },
        ]}
      >
        {checked && <Feather name="check" size={12} color={colors.primaryForeground} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.checkTitle, { color: colors.foreground }]}>{title}</Text>
        {!!detail && <Text style={[styles.checkDetail, { color: colors.mutedForeground }]}>{detail}</Text>}
      </View>
    </Pressable>
  );
}

function IntervalPills({
  values,
  selected,
  onSelect,
  fmt,
  colors,
}: {
  values: readonly number[];
  selected: number;
  onSelect: (n: number) => void;
  fmt: (n: number) => string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.intervalRow}>
      {values.map((iv) => (
        <Pressable
          key={iv}
          onPress={() => { Haptics.selectionAsync(); onSelect(iv); }}
          style={[
            styles.intervalPill,
            {
              backgroundColor: selected === iv ? colors.primary : colors.background,
              borderColor: selected === iv ? colors.primary : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.intervalText,
              { color: selected === iv ? colors.primaryForeground : colors.mutedForeground },
            ]}
          >
            {fmt(iv)}
          </Text>
        </Pressable>
      ))}
    </View>
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
  progressInner: { flex: 1, flexDirection: "row", gap: 4, height: 4, borderRadius: 2, overflow: "hidden" },
  progressDot: { height: 4, borderRadius: 2 },
  progressLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, textTransform: "uppercase" },

  /* Landing + welcome */
  landing: { flex: 1, justifyContent: "center", alignItems: "center" },
  landingCenter: { alignItems: "center", paddingHorizontal: 100 },
  appTitle: { fontSize: 46, fontFamily: "Inter_700Bold", letterSpacing: 10, marginTop: 28 },
  landingHint: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
  welcomeTitle: { fontSize: 30, fontFamily: "Inter_700Bold", letterSpacing: -0.5, marginTop: 32, textAlign: "center" },
  welcomeName: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 4, marginTop: 8 },
  bottomConsole: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    zIndex: 5,
  },
  sideTouch: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 2 },
  sideIcon: { height: 22, alignItems: "center", justifyContent: "center" },
  sideLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3, textAlign: "center" },
  langGlyph: { fontSize: 16, fontFamily: "Inter_700Bold", letterSpacing: 1 },

  /* Generic step */
  stepContainer: { paddingHorizontal: 24, paddingTop: 40, alignItems: "center", minHeight: "100%" },
  iconBadge: { width: 70, height: 70, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  stepTitle: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -0.5, textAlign: "center", marginBottom: 8 },
  stepSub: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center", letterSpacing: 0.3, marginBottom: 28, lineHeight: 18, paddingHorizontal: 8 },

  /* Inputs */
  input: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  bioRow: { flexDirection: "row", gap: 12, width: "100%", marginTop: 14 },
  fieldLabel: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 },

  /* Intentions */
  intentionRow: { flexDirection: "column", gap: 12, width: "100%" },
  intentionCard: { width: "100%", borderRadius: 18, borderWidth: 1.5, paddingVertical: 18, paddingHorizontal: 18, alignItems: "center", gap: 6, justifyContent: "center" },
  intentionRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  intentionCardTitle: { fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: -0.2 },
  intentionCardAffirm: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 16, fontStyle: "italic" },

  /* Check lists */
  checkList: { width: "100%", gap: 10 },
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, padding: 16, borderRadius: 16, borderWidth: 1.5 },
  checkBox: { width: 24, height: 24, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0 },
  checkTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.2, lineHeight: 19 },
  checkDetail: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17, marginTop: 4 },

  /* Nurture */
  nurtureCards: { width: "100%", gap: 12 },
  nurtureCard: { borderRadius: 20, borderWidth: 1, padding: 16 },
  nurtureHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 14 },
  nurtureTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", letterSpacing: 0.2 },
  nurtureSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 16 },
  intakeGlyph: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  stepper: { flexDirection: "row", alignItems: "center", gap: 16, justifyContent: "center" },
  stepperBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  stepperValue: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.5, minWidth: 60, textAlign: "center" },
  unitRow: { flexDirection: "row", gap: 8, paddingRight: 4 },
  unitPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  unitPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.4, textTransform: "lowercase" },
  intervalRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  intervalPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, borderWidth: 1 },
  intervalText: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },

  /* Buttons */
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    borderRadius: 30,
    paddingHorizontal: 24,
  },
  primaryBtnText: { fontFamily: "Inter_700Bold", letterSpacing: 1.2, textTransform: "uppercase", textAlign: "center" },
});
