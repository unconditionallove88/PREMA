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

// Muted dusty-rose accent for the wave* danger zone — serious but soft.
const WAVE_ACCENT = "#C58B86";

const CONTENT = {
  en: {
    greeting: "Existence is now",
    essence: "The Essence",
    name: "Username",
    namePlaceholder: "ENTER NAME",
    weight: "Weight (kg)",
    height: "Height (cm)",
    saved: "Profile reflects light",
    language: "Language",
    languageSub: "Choose how the space speaks",
    valuedHeart: "VALUED HEART",
    footer: "Created in harmony",
    wave: {
      title: "wave*",
      sub: "let the tide carry it all away",
      action: "wave*",
      cancel: "stay",
      confirm:
        "wave* will clear your entire journey. all intake logs and session data will be permanently deleted, and you will be signed out.",
    },
  },
  de: {
    greeting: "Existenz ist jetzt",
    essence: "Die Essenz",
    name: "Benutzername",
    namePlaceholder: "NAME EINGEBEN",
    weight: "Gewicht (kg)",
    height: "Größe (cm)",
    saved: "Profil spiegelt Licht",
    language: "Sprache",
    languageSub: "Wähle, wie der Raum spricht",
    valuedHeart: "GESCHÄTZTES HERZ",
    footer: "In Harmonie erschaffen",
    wave: {
      title: "wave*",
      sub: "lass die flut alles forttragen",
      action: "wave*",
      cancel: "bleiben",
      confirm:
        "wave* löscht deine gesamte reise. alle einnahme-protokolle und sitzungsdaten werden dauerhaft gelöscht, und du wirst abgemeldet.",
    },
  },
};

export function YouPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang, setLang, userName, signOut } = useSession();
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
  const [waveOpen, setWaveOpen] = useState(false);

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

  const confirmWave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setWaveOpen(false);
    onClose();
    // Purge the entire journey + sign out. The root navigator redirects to the
    // landing flow once hasOnboarded flips to false.
    await signOut();
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

        {/* wave* — clear the entire journey */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: WAVE_ACCENT + "40", gap: 14 },
          ]}
        >
          <View style={styles.cardHeader}>
            <Feather name="wind" size={14} color={WAVE_ACCENT} />
            <Text style={[styles.cardTitle, { color: WAVE_ACCENT }]}>{t.wave.title}</Text>
          </View>
          <Text style={[styles.waveSub, { color: colors.mutedForeground }]}>{t.wave.sub}</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setWaveOpen(true);
            }}
            style={({ pressed }) => [
              styles.waveBtn,
              {
                backgroundColor: WAVE_ACCENT + "14",
                borderColor: WAVE_ACCENT + "55",
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather name="wind" size={14} color={WAVE_ACCENT} />
            <Text style={[styles.waveBtnText, { color: WAVE_ACCENT }]}>{t.wave.action}</Text>
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>{t.footer}</Text>
      </KeyboardAwareScrollViewCompat>

      {/* wave* confirmation */}
      <Modal
        visible={waveOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setWaveOpen(false)}
      >
        <View style={styles.waveOverlay}>
          <View
            style={[
              styles.waveCard,
              { backgroundColor: colors.card, borderColor: WAVE_ACCENT + "40" },
            ]}
          >
            <View style={[styles.waveIcon, { backgroundColor: WAVE_ACCENT + "18", borderColor: WAVE_ACCENT + "40" }]}>
              <Feather name="wind" size={26} color={WAVE_ACCENT} />
            </View>
            <Text style={[styles.waveTitle, { color: colors.foreground }]}>{t.wave.title}</Text>
            <Text style={[styles.waveBody, { color: colors.mutedForeground }]}>{t.wave.confirm}</Text>
            <View style={styles.waveActions}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setWaveOpen(false);
                }}
                style={({ pressed }) => [
                  styles.waveCancel,
                  { borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={[styles.waveCancelText, { color: colors.foreground }]}>{t.wave.cancel}</Text>
              </Pressable>
              <Pressable
                onPress={confirmWave}
                style={({ pressed }) => [
                  styles.waveConfirm,
                  { backgroundColor: WAVE_ACCENT, opacity: pressed ? 0.88 : 1 },
                ]}
              >
                <Text style={styles.waveConfirmText}>{t.wave.action}</Text>
              </Pressable>
            </View>
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
  rowSub: { fontSize: 11, fontFamily: "Nunito_400Regular", marginTop: 2 },
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
  footer: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 8,
  },
  waveSub: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  waveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  waveBtnText: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 3,
  },
  waveOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  waveCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 18,
  },
  waveIcon: {
    width: 60,
    height: 60,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  waveTitle: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 4,
  },
  waveBody: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    lineHeight: 23,
    letterSpacing: 0.8,
    textAlign: "center",
  },
  waveActions: { flexDirection: "row", gap: 12, alignSelf: "stretch", marginTop: 4 },
  waveCancel: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  waveCancelText: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 1,
  },
  waveConfirm: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  waveConfirmText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 3,
    color: "#FFFFFF",
  },
});
