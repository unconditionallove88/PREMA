import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const COLOR_PURPLE = "#8B5CF6";
const COLOR_BLUE = "#3B82F6";
const COLOR_BLUE_LIGHT = "#60A5FA";

// Session-local keys wiped by the Purge Protocol.
const PURGE_KEYS = [
  "prema_logs",
  "prema_mesh_history",
  "prema_quick_notes",
  "prema_journal",
  "prema_love_letters",
  "prema_lab_logs",
  "prema_resonance_code",
  "prema_session_phase",
];

const PRACTITIONERS = [
  {
    name: "Dr. Aris Prema Hub",
    specialty: "General Medicine & Harm Reduction",
    specialtyDe: "Allgemeinmedizin & Harm Reduction",
    address: "Mitte, Berlin",
    urgent: true,
  },
  {
    name: "Mitte Care Center",
    specialty: "Sexual Health & STD Testing",
    specialtyDe: "Sexuelle Gesundheit & STD-Tests",
    address: "Prenzlauer Berg, Berlin",
    urgent: true,
  },
  {
    name: "Pulse Partner Praxis",
    specialty: "Internal Medicine",
    specialtyDe: "Innere Medizin",
    address: "Kreuzberg, Berlin",
    urgent: false,
  },
];

const CONTENT = {
  en: {
    back: "Back to home",
    integrated: "Integrated",
    recovery: "Recovery",
    personalProtocol: "Personalized protocol",
    secureWipe: "Session data wiped",
    privacyFinalized: "Privacy protocols finalized",
    timeline: "Integration Timeline",
    purgeTitle: "The Purge Protocol",
    purgeSub: "Phone data sovereignty",
    wipeWarning:
      "Completing this protocol will permanently wipe session logs and location history from the phone",
    confirmTitle: "Complete Session?",
    confirmCancel: "Cancel",
    confirmWipe: "Wipe Now",
    finishBtn: "Complete Session Now",
    returnBtn: "Return to Home",
    emergencyBtn: "Call Emergency Directly",
    callNow: "Call Now",
    ritualTitle: "Breath of Love",
    ritualDesc: "Perform the ritual to gently recalibrate your nervous system",
    mentalTitle: "Mental Integration",
    mentalDesc:
      "Guidance for paranoia or intense side-effects — return to harmony through presence",
    h2oTitle: "Isotonic Rehydration",
    h2oDesc:
      "Consume 500ml water with electrolytes to restore mineral balance",
    gpTitle: "GP Consultation",
    gpDesc:
      "Contact your General Practitioner for high-fidelity STD testing and post-session health checks",
    immediate: "Immediate",
    mentalModalSub: "Return to harmony through presence",
    mentalPoints: [
      "Name what you feel out loud — sensation is temporary",
      "Anchor your breath: slow inhale, longer exhale",
      "Find a calm, dimly lit space with someone you trust",
      "If distress intensifies, call your circle or emergency services",
    ],
    gpModalSub: "Trusted partners near you",
    urgent: "Urgent care",
    footer: "Created in harmony",
  },
  de: {
    back: "Zurück nach Hause",
    integrated: "Integriert",
    recovery: "Erholung",
    personalProtocol: "Persönliches Protokoll",
    secureWipe: "Sitzungsdaten gelöscht",
    privacyFinalized: "Schutzprotokolle abgeschlossen",
    timeline: "Integrations-Zeitachse",
    purgeTitle: "Das Purge-Protokoll",
    purgeSub: "Datenhoheit auf dem Telefon",
    wipeWarning:
      "Der Abschluss dieses Protokolls löscht dauerhaft alle Sitzungsprotokolle und Verläufe vom Telefon",
    confirmTitle: "Session abschließen?",
    confirmCancel: "Abbrechen",
    confirmWipe: "Jetzt löschen",
    finishBtn: "Session jetzt abschließen",
    returnBtn: "Zurück nach Hause",
    emergencyBtn: "Notruf direkt anrufen",
    callNow: "Jetzt anrufen",
    ritualTitle: "Atem der Liebe",
    ritualDesc:
      "Führe das Ritual durch, um dein Nervensystem sanft zu kalibrieren",
    mentalTitle: "Mentale Integration",
    mentalDesc:
      "Begleitung bei Paranoia oder intensiven Nebenwirkungen — zurück zur Harmonie durch Präsenz",
    h2oTitle: "Isotonische Rehydration",
    h2oDesc:
      "Trinke 500ml Wasser mit Elektrolyten, um die Mineralstoffbalance wiederherzustellen",
    gpTitle: "Praxis-Besuch",
    gpDesc:
      "Kontaktiere deinen Hausarzt für STD-Tests und Gesundheitschecks nach der Sitzung",
    immediate: "Sofort",
    mentalModalSub: "Zurück zur Harmonie durch Präsenz",
    mentalPoints: [
      "Benenne laut, was du fühlst — Empfindungen sind vorübergehend",
      "Verankere deinen Atem: langsam einatmen, länger ausatmen",
      "Finde einen ruhigen, gedämpften Ort mit jemandem, dem du vertraust",
      "Wenn die Not zunimmt, rufe deinen Kreis oder den Notruf",
    ],
    gpModalSub: "Vertrauenswürdige Partner in deiner Nähe",
    urgent: "Akutversorgung",
    footer: "In Harmonie erschaffen",
  },
};

export default function RecoveryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const t = CONTENT[lang] || CONTENT.en;

  const [timeLeft, setTimeLeft] = useState("02:00:00");
  const [isFinished, setIsFinished] = useState(false);
  const [mentalOpen, setMentalOpen] = useState(false);
  const [gpOpen, setGPOpen] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  useEffect(() => {
    AsyncStorage.setItem("prema_session_phase", "after");
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const parts = prev.split(":").map(Number);
        if (parts.length !== 3) return "02:00:00";
        const [h, m, s] = parts;
        const totalSeconds = h * 3600 + m * 60 + s - 1;
        if (totalSeconds <= 0) return "00:00:00";
        const nh = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
        const nm = Math.floor((totalSeconds % 3600) / 60)
          .toString()
          .padStart(2, "0");
        const ns = (totalSeconds % 60).toString().padStart(2, "0");
        return `${nh}:${nm}:${ns}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const performPurge = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await AsyncStorage.multiRemove(PURGE_KEYS);
    } catch {}
    setIsFinished(true);
  };

  const handlePurge = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(t.confirmTitle, t.wipeWarning, [
      { text: t.confirmCancel, style: "cancel" },
      { text: t.confirmWipe, style: "destructive", onPress: performPurge },
    ]);
  };

  const callEmergency = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Linking.openURL("tel:112").catch(() => {});
  };

  const timeline = [
    {
      id: "ritual",
      time: t.immediate,
      text: t.ritualTitle,
      desc: t.ritualDesc,
      icon: "wind" as const,
      color: colors.primary,
      action: () => router.push("/self-care"),
    },
    {
      id: "mental",
      time: t.immediate,
      text: t.mentalTitle,
      desc: t.mentalDesc,
      icon: "cpu" as const,
      color: COLOR_PURPLE,
      action: () => setMentalOpen(true),
    },
    {
      id: "h2o",
      time: "10m",
      text: t.h2oTitle,
      desc: t.h2oDesc,
      icon: "droplet" as const,
      color: COLOR_BLUE,
      action: null as null | (() => void),
    },
    {
      id: "gp",
      time: "24h",
      text: t.gpTitle,
      desc: t.gpDesc,
      icon: "activity" as const,
      color: COLOR_BLUE_LIGHT,
      action: () => setGPOpen(true),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPad + 16,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backBtn}
          hitSlop={8}
        >
          <Feather name="arrow-left" size={16} color={colors.mutedForeground} />
          <Text style={[styles.backText, { color: colors.mutedForeground }]}>
            {t.back}
          </Text>
        </Pressable>

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {isFinished ? t.integrated : t.recovery}
            </Text>
            <Text style={[styles.subtitle, { color: colors.primary }]}>
              {isFinished ? t.secureWipe : t.personalProtocol}
            </Text>
          </View>
          {!isFinished && (
            <Text style={[styles.timer, { color: colors.primary }]}>
              {timeLeft}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: botPad + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Purge Protocol */}
        {!isFinished && (
          <View
            style={[
              styles.section,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.sectionHead}>
              <View
                style={[
                  styles.sectionIcon,
                  {
                    backgroundColor: colors.destructive + "18",
                    borderColor: colors.destructive + "30",
                  },
                ]}
              >
                <Feather name="trash-2" size={22} color={colors.destructive} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  {t.purgeTitle}
                </Text>
                <Text
                  style={[styles.sectionSub, { color: colors.mutedForeground }]}
                >
                  {t.purgeSub}
                </Text>
              </View>
            </View>
            <Text style={[styles.warning, { color: colors.mutedForeground }]}>
              {t.wipeWarning}
            </Text>
            <Pressable
              onPress={handlePurge}
              style={({ pressed }) => [
                styles.purgeBtn,
                {
                  backgroundColor: colors.destructive + "15",
                  borderColor: colors.destructive + "30",
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.purgeBtnText, { color: colors.destructive }]}>
                {t.finishBtn}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Finished confirmation */}
        {isFinished && (
          <View
            style={[
              styles.finishedCard,
              {
                backgroundColor: colors.primary + "0D",
                borderColor: colors.primary + "33",
              },
            ]}
          >
            <View
              style={[
                styles.finishedIcon,
                {
                  backgroundColor: colors.primary + "1A",
                  borderColor: colors.primary + "33",
                },
              ]}
            >
              <Feather name="shield" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.finishedTitle, { color: colors.foreground }]}>
              {t.privacyFinalized}
            </Text>
            <Text style={[styles.finishedSub, { color: colors.primary }]}>
              {t.secureWipe}
            </Text>
          </View>
        )}

        {/* Emergency call */}
        <View
          style={[
            styles.emergency,
            {
              backgroundColor: colors.destructive + "12",
              borderColor: colors.destructive + "30",
            },
          ]}
        >
          <View style={styles.emergencyLeft}>
            <Feather name="phone-call" size={22} color={colors.destructive} />
            <Text style={[styles.emergencyText, { color: colors.foreground }]}>
              {t.emergencyBtn}
            </Text>
          </View>
          <Pressable
            onPress={callEmergency}
            style={({ pressed }) => [
              styles.callBtn,
              { backgroundColor: colors.destructive, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text
              style={[
                styles.callBtnText,
                { color: colors.destructiveForeground },
              ]}
            >
              {t.callNow}
            </Text>
          </Pressable>
        </View>

        {/* Integration timeline */}
        <View style={styles.timelineHead}>
          <Feather name="heart" size={20} color={colors.primary} />
          <Text style={[styles.timelineTitle, { color: colors.foreground }]}>
            {t.timeline}
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          {timeline.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => {
                if (p.action) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  p.action();
                }
              }}
              disabled={!p.action}
              style={({ pressed }) => [
                styles.timelineCard,
                {
                  backgroundColor: p.action
                    ? colors.primary + "0D"
                    : colors.card,
                  borderColor: p.action ? colors.primary + "40" : colors.border,
                  opacity: pressed && p.action ? 0.85 : 1,
                },
              ]}
            >
              <View style={styles.timelineCardTop}>
                <View style={styles.timelineCardLeft}>
                  <View
                    style={[
                      styles.timelineIcon,
                      { backgroundColor: p.color + "1A" },
                    ]}
                  >
                    <Feather name={p.icon} size={20} color={p.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.timelineTime,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {p.time}
                    </Text>
                    <Text
                      style={[
                        styles.timelineLabel,
                        { color: colors.foreground },
                      ]}
                    >
                      {p.text}
                    </Text>
                  </View>
                </View>
                {p.action ? (
                  <Feather name="chevron-right" size={20} color={colors.primary} />
                ) : (
                  <Feather
                    name="check-circle"
                    size={20}
                    color={colors.primary + "40"}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.timelineDesc,
                  {
                    color: colors.mutedForeground,
                    borderLeftColor: colors.border,
                  },
                ]}
              >
                {p.desc}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Return home (after finished) */}
        {isFinished && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              AsyncStorage.removeItem("prema_session_phase");
              router.replace("/(tabs)");
            }}
            style={({ pressed }) => [
              styles.returnBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text
              style={[styles.returnBtnText, { color: colors.primaryForeground }]}
            >
              {t.returnBtn}
            </Text>
          </Pressable>
        )}

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          {t.footer}
        </Text>
      </ScrollView>

      {/* Mental Integration modal */}
      <Modal
        visible={mentalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setMentalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingBottom: insets.bottom + 24,
              },
            ]}
          >
            <View style={styles.modalHead}>
              <View
                style={[
                  styles.modalIcon,
                  { backgroundColor: COLOR_PURPLE + "1A" },
                ]}
              >
                <Feather name="cpu" size={22} color={COLOR_PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {t.mentalTitle}
                </Text>
                <Text
                  style={[styles.modalSub, { color: colors.mutedForeground }]}
                >
                  {t.mentalModalSub}
                </Text>
              </View>
              <Pressable onPress={() => setMentalOpen(false)} hitSlop={10}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <View style={{ gap: 12, marginTop: 8 }}>
              {t.mentalPoints.map((point, i) => (
                <View key={i} style={styles.pointRow}>
                  <View
                    style={[
                      styles.pointDot,
                      { backgroundColor: COLOR_PURPLE + "1A" },
                    ]}
                  >
                    <Feather name="check" size={12} color={COLOR_PURPLE} />
                  </View>
                  <Text
                    style={[styles.pointText, { color: colors.foreground }]}
                  >
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* GP Consultation modal */}
      <Modal
        visible={gpOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setGPOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingBottom: insets.bottom + 24,
              },
            ]}
          >
            <View style={styles.modalHead}>
              <View
                style={[
                  styles.modalIcon,
                  { backgroundColor: COLOR_BLUE_LIGHT + "1A" },
                ]}
              >
                <Feather name="activity" size={22} color={COLOR_BLUE_LIGHT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {t.gpTitle}
                </Text>
                <Text
                  style={[styles.modalSub, { color: colors.mutedForeground }]}
                >
                  {t.gpModalSub}
                </Text>
              </View>
              <Pressable onPress={() => setGPOpen(false)} hitSlop={10}>
                <Feather name="x" size={22} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <View style={{ gap: 12, marginTop: 8 }}>
              {PRACTITIONERS.map((p) => (
                <View
                  key={p.name}
                  style={[
                    styles.practitioner,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.practitionerName,
                        { color: colors.foreground },
                      ]}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={[
                        styles.practitionerSpec,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {lang === "de" ? p.specialtyDe : p.specialty}
                    </Text>
                    <View style={styles.practitionerMeta}>
                      <Feather
                        name="map-pin"
                        size={11}
                        color={colors.mutedForeground}
                      />
                      <Text
                        style={[
                          styles.practitionerAddr,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        {p.address}
                      </Text>
                    </View>
                  </View>
                  {p.urgent && (
                    <View
                      style={[
                        styles.urgentBadge,
                        {
                          backgroundColor: colors.destructive + "15",
                          borderColor: colors.destructive + "30",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.urgentText,
                          { color: colors.destructive },
                        ]}
                      >
                        {t.urgent}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 1,
    gap: 14,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: {
    fontSize: 10,
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  headerRow: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  title: {
    fontSize: 34,
    fontFamily: "Nunito_700Bold",
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginTop: 4,
  },
  timer: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1,
  },
  container: { paddingHorizontal: 20, paddingTop: 24, gap: 24 },
  section: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    gap: 16,
  },
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 14 },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Nunito_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionSub: {
    fontSize: 9,
    fontFamily: "Nunito_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 3,
  },
  warning: {
    fontSize: 12,
    fontFamily: "Nunito_500Medium",
    lineHeight: 19,
    fontStyle: "italic",
  },
  purgeBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  purgeBtnText: {
    fontSize: 11,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  finishedCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 32,
    alignItems: "center",
  },
  finishedIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  finishedTitle: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  finishedSub: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  emergency: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  emergencyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  emergencyText: {
    fontSize: 12,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    flex: 1,
  },
  callBtn: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
  },
  callBtnText: {
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  timelineHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: -8,
  },
  timelineTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    textTransform: "uppercase",
    letterSpacing: -0.3,
  },
  timelineCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  timelineCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timelineCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  timelineIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineTime: {
    fontSize: 9,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  timelineLabel: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    textTransform: "uppercase",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  timelineDesc: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    lineHeight: 20,
    paddingLeft: 12,
    borderLeftWidth: 2,
  },
  returnBtn: {
    paddingVertical: 20,
    borderRadius: 999,
    alignItems: "center",
  },
  returnBtnText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footer: {
    fontSize: 9,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 4,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 22,
  },
  modalHead: { flexDirection: "row", alignItems: "center", gap: 14 },
  modalIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    textTransform: "uppercase",
    letterSpacing: -0.3,
  },
  modalSub: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
    marginTop: 2,
  },
  pointRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  pointDot: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  pointText: {
    fontSize: 13,
    fontFamily: "Nunito_500Medium",
    lineHeight: 20,
    flex: 1,
  },
  practitioner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  practitionerName: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
  },
  practitionerSpec: {
    fontSize: 12,
    fontFamily: "Nunito_400Regular",
    marginTop: 2,
  },
  practitionerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  practitionerAddr: {
    fontSize: 11,
    fontFamily: "Nunito_500Medium",
  },
  urgentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  urgentText: {
    fontSize: 8,
    fontFamily: "Nunito_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
