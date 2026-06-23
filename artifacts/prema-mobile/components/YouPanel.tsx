import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CircleOfLove } from "@/components/CircleOfLove";
import { GradientBackground } from "@/components/GradientBackground";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { Text } from "@/components/Text";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const PROFILE_KEY = "prema_profile";
const NAME_KEY = "prema_user_name";

const CONTENT = {
  en: {
    safeSpace: "Space",
    greeting: "Existence is now",
    essence: "The Essence",
    name: "Username",
    namePlaceholder: "ENTER NAME",
    weight: "Weight (kg)",
    height: "Height (cm)",
    saved: "Profile reflects light",
    circle: "Circle of Love",
    trusted: "Trusted Bonds",
    resonant: "Resonant contacts",
    reminders: "Heart Reminders",
    checkins: "Check-ins are active",
    language: "Language",
    languageSub: "Choose how the space speaks",
    journey:
      "Intention is sovereign. High-fidelity encryption ensures this space remains private and the heart free.",
    promise: "Bonds of Trust",
    valuedHeart: "VALUED HEART",
    footer: "Created in harmony",
    privacy: {
      title: "Freedom & Trust",
      sovereignty: "Data Sovereignty",
      sovereigntyDesc:
        "Privacy is respected. Data is sovereign. prema is built on the principle that the personal journey is a sacred trust.",
      encryption: "High-Fidelity Encryption",
      encryptionDesc:
        "All biometric signals, health profiles and location logs are protected by high-fidelity encryption. Sensitive information is visible only to chosen bonds.",
      freedom: "Inner Freedom",
      freedomDesc:
        "Data is never sold or traded. Intention remains within this space. Pure support, love, care and harm reduction.",
      acceptance: "Unconditional Acceptance",
      acceptanceDesc:
        "Only information necessary for protection is collected. Every data point calibrates protection and nurtures well-being.",
      footer: "Created in harmony",
    },
  },
  de: {
    safeSpace: "Raum",
    greeting: "Existenz ist jetzt",
    essence: "Die Essenz",
    name: "Benutzername",
    namePlaceholder: "NAME EINGEBEN",
    weight: "Gewicht (kg)",
    height: "Größe (cm)",
    saved: "Profil spiegelt Licht",
    circle: "Circle of Love",
    trusted: "Vertrauenswürdige Bindungen",
    resonant: "Resonante Kontakte",
    reminders: "Heart Reminders",
    checkins: "Tägliche Check-ins aktiv",
    language: "Sprache",
    languageSub: "Wähle, wie der Raum spricht",
    journey:
      "Resonanz ist souverän. High-Fidelity-Verschlüsselung stellt sicher, dass dieser Raum privat bleibt.",
    promise: "Bindungen des Vertrauens",
    valuedHeart: "GESCHÄTZTES HERZ",
    footer: "In Harmonie erschaffen",
    privacy: {
      title: "Freiheit & Vertrauen",
      sovereignty: "Datensouveränität",
      sovereigntyDesc:
        "Privatsphäre wird geachtet. Daten sind souverän. prema baut auf dem Prinzip der persönlichen Souveränität auf.",
      encryption: "High-Fidelity-Verschlüsselung",
      encryptionDesc:
        "Alle biometrischen Signale, Gesundheitsprofile und Standortprotokolle sind geschützt. Informationen sind nur für Vertraute sichtbar.",
      freedom: "Innere Freiheit",
      freedomDesc:
        "Daten werden niemals verkauft. Die Resonanz bleibt in diesem Raum. Reine Unterstützung, Liebe, Fürsorge und Schadensminimierung.",
      acceptance: "Bedingungslose Akzeptanz",
      acceptanceDesc:
        "Nur notwendige Informationen werden gesammelt. Jeder Datenpunkt kalibriert den Schutz und fördert Wohlbefinden.",
      footer: "In Harmonie erschaffen",
    },
  },
};

export function YouPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, setLang, userName } = useSession();
  const t = CONTENT[lang];

  const { height: screenH } = useWindowDimensions();
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const ty = useRef(new Animated.Value(screenH)).current;

  // Slide up / down as `open` toggles.
  useEffect(() => {
    Animated.timing(ty, {
      toValue: open ? 0 : screenH,
      duration: open ? 420 : 320,
      useNativeDriver: true,
    }).start();
  }, [open, screenH, ty]);

  // Swipe-down to dismiss — driven from the header zone only.
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_e, g) => g.dy > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_e, g) => {
        if (g.dy > 0) ty.setValue(g.dy);
      },
      onPanResponderRelease: (_e, g) => {
        if (g.dy > 120 || g.vy > 0.8) {
          onClose();
        } else {
          Animated.spring(ty, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start();
        }
      },
    }),
  ).current;

  const [name, setName] = useState(userName);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [storedName, storedProfile] = await Promise.all([
        AsyncStorage.getItem(NAME_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);
      if (storedName) setName(storedName);
      if (storedProfile) {
        try {
          const p = JSON.parse(storedProfile);
          if (p?.weightKg != null) setWeight(String(p.weightKg));
          if (p?.heightCm != null) setHeight(String(p.heightCm));
        } catch {}
      }
    })();
  }, []);

  const flashSaved = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const persistName = async () => {
    const value = name.trim();
    await AsyncStorage.setItem(NAME_KEY, value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flashSaved();
  };

  const persistBiometrics = async () => {
    const profile = {
      weightKg: weight ? Number(weight) : null,
      heightCm: height ? Number(height) : null,
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    flashSaved();
  };

  const handleLang = (l: "en" | "de") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLang(l);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const displayName = name.trim() ? name.trim().toUpperCase() : t.valuedHeart;

  return (
    <Animated.View
      style={[styles.panel, { backgroundColor: colors.background, transform: [{ translateY: ty }] }]}
      pointerEvents={open ? "auto" : "none"}
    >
      <GradientBackground />

      {savedMsg && (
        <View style={[styles.toast, { top: topPad + 64, backgroundColor: colors.primary }]}>
          <Feather name="check-circle" size={14} color={colors.primaryForeground} />
          <Text style={[styles.toastText, { color: colors.primaryForeground }]}>{t.saved}</Text>
        </View>
      )}

      {/* Glowing circle header — draggable to dismiss */}
      <View style={[styles.headerZone, { paddingTop: topPad + 8 }]} {...pan.panHandlers}>
        <View style={[styles.grabber, { backgroundColor: colors.mutedForeground + "55" }]} />
        <Pressable
          onPress={handleClose}
          hitSlop={10}
          style={[styles.closeBtn, { top: topPad + 8, backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="x" size={18} color={colors.foreground} />
        </Pressable>
        <View style={styles.circleHeader}>
          <CircleOfLove size={92} />
        </View>
        <Text style={[styles.displayName, { color: colors.foreground }]}>{displayName}</Text>
        <Text style={[styles.greeting, { color: colors.primary }]}>{t.greeting}</Text>
      </View>

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: botPad + 40, paddingHorizontal: 20, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        bottomOffset={24}
      >
        {/* The Essence — biometrics */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="feather" size={14} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{t.essence}</Text>
          </View>

          <View style={{ gap: 16 }}>
            <View style={{ gap: 8 }}>
              <Text style={[styles.fieldLabel, { color: colors.primary }]}>{t.name}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                onEndEditing={persistName}
                onBlur={persistName}
                placeholder={t.namePlaceholder}
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="characters"
                style={[
                  styles.input,
                  styles.nameInput,
                  { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                ]}
              />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={[styles.fieldLabel, { color: colors.primary }]}>{t.weight}</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  onEndEditing={persistBiometrics}
                  onBlur={persistBiometrics}
                  placeholder="70"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                  ]}
                />
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={[styles.fieldLabel, { color: colors.primary }]}>{t.height}</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  onEndEditing={persistBiometrics}
                  onBlur={persistBiometrics}
                  placeholder="175"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Circle of Love */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="shield" size={14} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{t.circle}</Text>
          </View>

          <View style={[styles.rowItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.rowIcon, { backgroundColor: colors.primary + "20" }]}>
              <Feather name="heart" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>{t.trusted}</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{t.resonant}</Text>
            </View>
          </View>

          <View style={[styles.rowItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.rowIcon, { backgroundColor: "#3B82F620" }]}>
              <Feather name="bell" size={20} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.foreground }]}>{t.reminders}</Text>
              <Text style={[styles.rowSub, { color: colors.mutedForeground }]}>{t.checkins}</Text>
            </View>
            <View style={[styles.toggle, { backgroundColor: colors.primary }]}>
              <View style={[styles.toggleKnob, { backgroundColor: colors.primaryForeground }]} />
            </View>
          </View>
        </View>

        {/* Language */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Feather name="globe" size={14} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.primary }]}>{t.language}</Text>
          </View>
          <Text style={[styles.rowSub, { color: colors.mutedForeground, marginBottom: 4 }]}>{t.languageSub}</Text>
          <View style={styles.langRow}>
            {(["en", "de"] as const).map((l) => {
              const active = lang === l;
              return (
                <Pressable
                  key={l}
                  onPress={() => handleLang(l)}
                  style={({ pressed }) => [
                    styles.langBtn,
                    {
                      backgroundColor: active ? colors.primary + "15" : colors.background,
                      borderColor: active ? colors.primary + "45" : colors.border,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.langText, { color: active ? colors.primary : colors.foreground }]}>
                    {l === "en" ? "English" : "Deutsch"}
                  </Text>
                  {active && <Feather name="check" size={14} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Privacy / Bonds of Trust */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, alignItems: "center", gap: 14 },
          ]}
        >
          <Feather name="lock" size={22} color={colors.mutedForeground} />
          <Text style={[styles.journey, { color: colors.mutedForeground }]}>{t.journey}</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPrivacyOpen(true);
            }}
            style={({ pressed }) => [
              styles.promiseBtn,
              {
                backgroundColor: colors.primary + "15",
                borderColor: colors.primary + "30",
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="shield" size={14} color={colors.primary} />
            <Text style={[styles.promiseText, { color: colors.primary }]}>{t.promise}</Text>
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>{t.footer}</Text>
      </KeyboardAwareScrollViewCompat>

      {/* Privacy viewer */}
      <Modal
        visible={privacyOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPrivacyOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingTop: (Platform.OS === "web" ? 24 : insets.top) + 8,
                paddingBottom: insets.bottom + 16,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleWrap}>
                <View style={[styles.modalIcon, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
                  <Feather name="shield" size={22} color={colors.primary} />
                </View>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t.privacy.title}</Text>
              </View>
              <Pressable
                onPress={() => setPrivacyOpen(false)}
                style={[styles.closeBtnSquare, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <Feather name="x" size={18} color={colors.foreground} />
              </Pressable>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 24, gap: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {[
                { h: t.privacy.sovereignty, d: t.privacy.sovereigntyDesc },
                { h: t.privacy.encryption, d: t.privacy.encryptionDesc },
                { h: t.privacy.freedom, d: t.privacy.freedomDesc },
                { h: t.privacy.acceptance, d: t.privacy.acceptanceDesc },
              ].map((s) => (
                <View key={s.h} style={{ gap: 6 }}>
                  <Text style={[styles.policyHeading, { color: colors.primary }]}>{s.h}</Text>
                  <Text style={[styles.policyBody, { color: colors.mutedForeground }]}>{s.d}</Text>
                </View>
              ))}
              <Text style={[styles.footer, { color: colors.mutedForeground }]}>{t.privacy.footer}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
  },
  toast: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toastText: { fontSize: 11, fontFamily: "Nunito_700Bold", letterSpacing: 0.5 },
  headerZone: { alignItems: "center", paddingBottom: 8 },
  grabber: { width: 44, height: 5, borderRadius: 3, marginBottom: 8 },
  circleHeader: { width: 150, height: 150, alignItems: "center", justifyContent: "center" },
  closeBtn: {
    position: "absolute",
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 60,
  },
  displayName: {
    fontSize: 26,
    fontFamily: "Nunito_700Bold",
    letterSpacing: -0.5,
    textAlign: "center",
    marginTop: -6,
  },
  greeting: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginTop: 4,
  },
  card: { borderRadius: 24, borderWidth: 1, padding: 20, marginBottom: 16, gap: 16 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardTitle: { fontSize: 11, fontFamily: "Nunito_700Bold", letterSpacing: 2, textTransform: "uppercase" },
  fieldLabel: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginLeft: 2,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    fontSize: 18,
    fontFamily: "Nunito_600SemiBold",
  },
  nameInput: { fontFamily: "Nunito_700Bold", letterSpacing: 0.5 },
  row: { flexDirection: "row", gap: 14 },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  rowIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: 13, fontFamily: "Nunito_600SemiBold" },
  rowSub: { fontSize: 11, fontFamily: "Nunito_400Regular", marginTop: 2 },
  toggle: { width: 44, height: 26, borderRadius: 13, padding: 3, alignItems: "flex-end", justifyContent: "center" },
  toggleKnob: { width: 20, height: 20, borderRadius: 10 },
  langRow: { flexDirection: "row", gap: 12 },
  langBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
  },
  langText: { fontSize: 14, fontFamily: "Nunito_600SemiBold" },
  journey: { fontSize: 12, fontFamily: "Nunito_400Regular", lineHeight: 19, textAlign: "center" },
  promiseBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  promiseText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  footer: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalCard: {
    height: "90%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  modalTitleWrap: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: { fontSize: 22, fontFamily: "Nunito_700Bold", letterSpacing: -0.5, flex: 1 },
  closeBtnSquare: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  policyHeading: { fontSize: 11, fontFamily: "Nunito_700Bold", letterSpacing: 2, textTransform: "uppercase" },
  policyBody: { fontSize: 13, fontFamily: "Nunito_400Regular", lineHeight: 21 },
});
