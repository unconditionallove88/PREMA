import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const CONTENT = {
  en: {
    title: "Radar",
    subtitle: "Sovereign Mesh",
    loading: "Calibrating Intention",
    here: "I am here \uD83C\uDF3F",
    visible: "My heart is open",
    private: "Private",
    distress: (name: string) => `${name} needs care`,
    finding: (name: string) => `Guided by Mesh to ${name}`,
    currentPulse: (status: string) => `Current Pulse: ${status}`,
    notify: "Notify Awareness",
    meshActive: "Mesh Location Active",
    meshSub: "Mesh Triangulation Active",
    locationOff: "Location Private",
    locationOffSub: "Mesh estimated by signal",
    collectiveCare: "Collective Care Active",
    nearbyHeart: "A heart nearby needs presence",
    helpFamily: "Walk with Care",
    presenceNeeded: "Presence Needed",
    away: "away",
    triangulated: "Mesh Triangulated",
    guidedWalk: "Guided Walk with Care Active",
    sos: "SOS",
    nearby: "Circle Nearby",
  },
  de: {
    title: "Radar",
    subtitle: "Sovereign Mesh",
    loading: "Resonanz wird kalibriert",
    here: "Ich bin hier \uD83C\uDF3F",
    visible: "Mein Herz ist offen",
    private: "Privat",
    distress: (name: string) => `${name} braucht Begleitung`,
    finding: (name: string) => `Mesh leitet dich zu ${name}`,
    currentPulse: (status: string) => `Aktueller Status: ${status}`,
    notify: "Awareness rufen",
    meshActive: "Mesh-Ortung aktiv",
    meshSub: "Mesh-Triangulation aktiv",
    locationOff: "Standort privat",
    locationOffSub: "Mesh per Signal geschätzt",
    collectiveCare: "Kollektive Fürsorge aktiv",
    nearbyHeart: "Ein Herz in der Nähe braucht Begleitung",
    helpFamily: "Mit Herz begleiten",
    presenceNeeded: "Präsenz gebraucht",
    away: "entfernt",
    triangulated: "Mesh trianguliert",
    guidedWalk: "Begleiteter Weg mit Herz aktiv",
    sos: "SOS",
    nearby: "Kreis in der Nähe",
  },
};

type FriendState = "steady" | "elevated" | "distress";

const MOCK_FRIENDS: {
  id: string;
  name: string;
  hr: number;
  state: FriendState;
  msg: { en: string; de: string };
  dist: string;
  angle: number;
  radius: number;
}[] = [
  {
    id: "f1",
    name: "GABRIEL",
    hr: 72,
    state: "steady",
    msg: { en: "Chilling near the bar", de: "Entspannt an der Bar" },
    dist: "12m",
    angle: 200,
    radius: 0.42,
  },
  {
    id: "f2",
    name: "LEANDRO",
    hr: 115,
    state: "elevated",
    msg: { en: "Dancing intensely", de: "Tanzt intensiv" },
    dist: "45m",
    angle: 320,
    radius: 0.66,
  },
  {
    id: "f3",
    name: "MARINA",
    hr: 140,
    state: "distress",
    msg: { en: "Needs a hydration break", de: "Braucht eine Pause" },
    dist: "82m",
    angle: 75,
    radius: 0.82,
  },
];

const SOS_CONTENT = {
  en: {
    question: "Do you need help?",
    helping: (name: string) => `Helping ${name}`,
    subtitle: "Choose the pathway that resonates now",
    callDirect: "Call Emergency Directly",
    options: [
      { key: "urgent", title: "Awareness Dispatch", sub: "Medical & Security", desc: "Request professional support via your Mesh Tactical Grid. Handled with absolute discretion.", icon: "phone-call" as const, color: "#DC2626" },
      { key: "circle", title: "Circle Broadcast", sub: "Mesh Alert", desc: "Instantly alert every member of your Circle of Love via Sovereign Mesh triangulation.", icon: "users" as const, color: "#F59E0B" },
      { key: "family", title: "Collective Care", sub: "Universal Family Presence", desc: "Broadcast a call for love to every nearby heart using the app to receive immediate help.", icon: "heart" as const, color: "#A78BFA" },
      { key: "grounding", title: "Heart Breath", sub: "Presence Protocol", desc: "Shift focus to the physiological sync of the Heart Breath.", icon: "wind" as const, color: "#3DB879" },
    ],
    connecting: "Negotiating Mesh Handshake...",
    honoring: "Honoring the request for care",
    loved: "I am loved",
    friendLoved: (name: string) => `${name} is loved`,
    takenCareOf: "and being taken care of",
    dispatched: "Mesh help request dispatched",
    meshShared: "Mesh Location Shared",
    privacyActive: "Privacy protocols active",
    returning: (s: number) => `Returning in ${s}s`,
    allIsWell: "All is well",
  },
  de: {
    question: "Brauchst du Unterstützung?",
    helping: (name: string) => `${name} braucht Begleitung`,
    subtitle: "Wähle den Weg, der sich jetzt richtig anfühlt",
    callDirect: "Notruf direkt anrufen",
    options: [
      { key: "urgent", title: "Awareness-Einsatz", sub: "Medizin & Sicherheit", desc: "Fordere professionelle Begleitung über dein Mesh Tactical Grid an. Diskret und vertraulich.", icon: "phone-call" as const, color: "#DC2626" },
      { key: "circle", title: "Circle-Broadcasting", sub: "Mesh Alarm", desc: "Informiere sofort alle Mitglieder deines Circle of Love via Sovereign Mesh Ortung.", icon: "users" as const, color: "#F59E0B" },
      { key: "family", title: "Kollektive Betreuung", sub: "Universelle Familien-Präsenz", desc: "Sende einen Ruf nach Liebe an alle Seelen in der Nähe für sofortige Hilfe.", icon: "heart" as const, color: "#A78BFA" },
      { key: "grounding", title: "Herz-Atem", sub: "Präsenz-Protokoll", desc: "Lenke den Fokus auf die Synchronisation des Herz-Atems.", icon: "wind" as const, color: "#3DB879" },
    ],
    connecting: "Mesh-Verbindung wird aufgebaut...",
    honoring: "Die Anfrage wird liebevoll bearbeitet",
    loved: "Ich bin geliebt",
    friendLoved: (name: string) => `${name} ist geliebt`,
    takenCareOf: "und in Sicherheit",
    dispatched: "Mesh-Anfrage wurde versendet",
    meshShared: "Mesh-Ortung geteilt",
    privacyActive: "Schutzprotokolle sind aktiv",
    returning: (s: number) => `Rückkehr in ${s}s`,
    allIsWell: "Alles ist gut",
  },
};

function stateColor(state: FriendState, colors: ReturnType<typeof useColors>) {
  switch (state) {
    case "distress":
      return "#DC2626";
    case "elevated":
      return "#F59E0B";
    default:
      return colors.primary;
  }
}

const SCREEN_W = Dimensions.get("window").width;
const RADAR_SIZE = Math.min(SCREEN_W - 40, 340);

function Radar({
  colors,
  isSharing,
  friends,
  onSelectFriend,
  familyDistress,
}: {
  colors: ReturnType<typeof useColors>;
  isSharing: boolean;
  friends: typeof MOCK_FRIENDS;
  onSelectFriend: (f: (typeof MOCK_FRIENDS)[number]) => void;
  familyDistress: boolean;
}) {
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const sweepAnim = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.4, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
      ])
    );
    sweepAnim.start();
    pulseAnim.start();
    return () => {
      sweepAnim.stop();
      pulseAnim.stop();
    };
  }, [sweep, pulse]);

  const rotate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const c = RADAR_SIZE / 2;
  const selfColor = colors.primary;

  const nodeFor = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      left: c + Math.cos(rad) * radius * c,
      top: c + Math.sin(rad) * radius * c,
    };
  };

  return (
    <View style={[styles.radar, { width: RADAR_SIZE, height: RADAR_SIZE, opacity: isSharing ? 1 : 0.35 }]}>
      <Svg width={RADAR_SIZE} height={RADAR_SIZE}>
        {[0.33, 0.66, 1].map((r) => (
          <Circle key={r} cx={c} cy={c} r={c * r - 1} stroke={colors.border} strokeWidth={1} fill="none" opacity={0.5} />
        ))}
        <Line x1={c} y1={0} x2={c} y2={RADAR_SIZE} stroke={colors.border} strokeWidth={1} opacity={0.3} />
        <Line x1={0} y1={c} x2={RADAR_SIZE} y2={c} stroke={colors.border} strokeWidth={1} opacity={0.3} />
      </Svg>

      {/* Rotating sweep line */}
      <Animated.View
        style={[
          styles.sweepWrap,
          { width: RADAR_SIZE, height: RADAR_SIZE, transform: [{ rotate }] },
        ]}
        pointerEvents="none"
      >
        <View style={[styles.sweepLine, { height: c, backgroundColor: selfColor + "55", left: c - 1, top: 0 }]} />
      </Animated.View>

      {/* Self node (center) */}
      <View style={[styles.selfWrap, { left: c, top: c }]} pointerEvents="none">
        <Animated.View
          style={[
            styles.selfPulse,
            { backgroundColor: selfColor + "22", transform: [{ scale: pulse }] },
          ]}
        />
        <View style={[styles.selfCore, { backgroundColor: colors.card, borderColor: selfColor + "55" }]}>
          <Feather name="eye" size={22} color={selfColor} />
        </View>
      </View>

      {/* Collective care distress node */}
      {familyDistress && (
        <View style={[styles.friendWrap, nodeFor(150, 0.55)]} pointerEvents="none">
          <View style={[styles.friendNode, { backgroundColor: "#DC262615", borderColor: "#DC2626" }]}>
            <Feather name="heart" size={16} color="#DC2626" />
          </View>
        </View>
      )}

      {/* Friend nodes */}
      {friends.map((f) => {
        const fc = stateColor(f.state, colors);
        const pos = nodeFor(f.angle, f.radius);
        return (
          <Pressable
            key={f.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectFriend(f);
            }}
            style={[styles.friendWrap, pos]}
          >
            <View style={[styles.friendNode, { backgroundColor: fc + "15", borderColor: fc + "66" }]}>
              <Feather name="heart" size={14} color={fc} />
            </View>
            <Text style={[styles.friendLabel, { color: colors.mutedForeground }]} numberOfLines={1}>
              {f.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SosModal({
  visible,
  onClose,
  colors,
  lang,
  friendName,
}: {
  visible: boolean;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
  lang: "en" | "de";
  friendName?: string | null;
}) {
  const t = SOS_CONTENT[lang];
  const [step, setStep] = useState<"confirm" | "sending" | "sent">("confirm");
  const [countdown, setCountdown] = useState(10);
  const isFriendMode = !!friendName;

  useEffect(() => {
    if (!visible) {
      setStep("confirm");
      setCountdown(10);
    }
  }, [visible]);

  useEffect(() => {
    if (step !== "sent") return;
    if (countdown <= 0) {
      onClose();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown, onClose]);

  const send = (key: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    if (key === "grounding") {
      onClose();
      return;
    }
    setStep("sending");
    setTimeout(() => setStep("sent"), 2000);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.modalBackdrop, { backgroundColor: "#000000AA" }]}>
        <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {step === "confirm" && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={[styles.sosIconCircle, { backgroundColor: "#DC262615", borderColor: "#DC262640" }]}>
                  <Feather name="heart" size={28} color="#DC2626" />
                </View>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {isFriendMode ? t.helping(friendName!) : t.question}
                </Text>
                <Text style={[styles.modalSub, { color: colors.primary }]}>{t.subtitle}</Text>
              </View>

              <Pressable
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
                style={[styles.callRow, { backgroundColor: "#DC262610", borderColor: "#DC262633" }]}
              >
                <View style={styles.callRowLeft}>
                  <Feather name="alert-triangle" size={18} color="#DC2626" />
                  <Text style={[styles.callRowText, { color: colors.foreground }]}>{t.callDirect}</Text>
                </View>
                <View style={[styles.callBtn, { backgroundColor: "#DC2626" }]}>
                  <Text style={styles.callBtnText}>112</Text>
                </View>
              </Pressable>

              {t.options.map((opt) => {
                if (isFriendMode && opt.key === "grounding") return null;
                return (
                  <View
                    key={opt.key}
                    style={[styles.sosOption, { backgroundColor: opt.color + "0D", borderColor: opt.color + "33" }]}
                  >
                    <View style={styles.sosOptionHead}>
                      <View style={[styles.sosOptionIcon, { backgroundColor: opt.color + "22" }]}>
                        <Feather name={opt.icon} size={20} color={opt.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.sosOptionTitle, { color: colors.foreground }]}>{opt.title}</Text>
                        <Text style={[styles.sosOptionBadge, { color: opt.color }]}>{opt.sub}</Text>
                      </View>
                    </View>
                    <Text style={[styles.sosOptionDesc, { color: colors.mutedForeground }]}>{opt.desc}</Text>
                    <Pressable
                      onPress={() => send(opt.key)}
                      style={({ pressed }) => [styles.sosOptionBtn, { backgroundColor: opt.color, opacity: pressed ? 0.85 : 1 }]}
                    >
                      <Text style={styles.sosOptionBtnText}>{opt.title}</Text>
                    </Pressable>
                  </View>
                );
              })}

              <Pressable onPress={onClose} style={styles.allWellBtn}>
                <Text style={[styles.allWellText, { color: colors.primary }]}>{t.allIsWell}</Text>
              </Pressable>
            </ScrollView>
          )}

          {step === "sending" && (
            <View style={styles.modalCenter}>
              <Feather name="loader" size={56} color={colors.primary} />
              <Text style={[styles.modalTitle, { color: colors.foreground, marginTop: 20 }]}>{t.connecting}</Text>
              <Text style={[styles.modalSub, { color: colors.primary, marginTop: 8 }]}>{t.honoring}</Text>
            </View>
          )}

          {step === "sent" && (
            <View style={styles.modalCenter}>
              <Feather name="heart" size={80} color={colors.primary} />
              <Text style={[styles.sentTitle, { color: colors.foreground }]}>
                {isFriendMode ? t.friendLoved(friendName!) : t.loved}
              </Text>
              <Text style={[styles.sentTitleAccent, { color: colors.primary }]}>{t.takenCareOf}</Text>
              <View style={[styles.sentCard, { borderColor: colors.primary + "33", backgroundColor: colors.primary + "0D" }]}>
                {[
                  { icon: "check-circle" as const, text: t.dispatched },
                  { icon: "radio" as const, text: t.meshShared },
                  { icon: "shield" as const, text: t.privacyActive },
                ].map((row) => (
                  <View key={row.text} style={styles.sentRow}>
                    <Feather name={row.icon} size={16} color={colors.primary} />
                    <Text style={[styles.sentRowText, { color: colors.foreground }]}>{row.text}</Text>
                  </View>
                ))}
              </View>
              <Pressable onPress={onClose} style={styles.allWellBtn}>
                <Text style={[styles.allWellText, { color: colors.mutedForeground }]}>{t.returning(countdown)}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const t = CONTENT[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const [isSharing, setIsSharing] = useState(true);
  const [sosOpen, setSosOpen] = useState(false);
  const [focus, setFocus] = useState<{ name: string; status: FriendState } | null>(null);
  const [familyDistress, setFamilyDistress] = useState<{ dist: string } | null>(null);
  const [locationGranted, setLocationGranted] = useState<boolean | null>(null);
  const [sosFriend, setSosFriend] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (mounted) setLocationGranted(status === "granted");
      } catch {
        if (mounted) setLocationGranted(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (focus) return;
    const timer = setTimeout(() => {
      setFamilyDistress({ dist: "15m" });
    }, 5000);
    return () => clearTimeout(timer);
  }, [focus]);

  const handleSelectFriend = (f: (typeof MOCK_FRIENDS)[number]) => {
    setFamilyDistress(null);
    setFocus({ name: f.name, status: f.state });
  };

  const openSos = (friendName?: string | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSosFriend(friendName ?? null);
    setSosOpen(true);
  };

  const isFriendDistress = !!focus && focus.status === "distress";
  const isFindingFriend = !!focus && focus.status !== "distress";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingTop: topPad + 24, paddingBottom: botPad + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>{t.title}</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{t.subtitle}</Text>
          </View>
          <View style={[styles.shareToggle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather
              name={isSharing ? "radio" : "lock"}
              size={14}
              color={isSharing ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.shareLabel,
                { color: isSharing ? colors.primary : colors.mutedForeground },
              ]}
            >
              {isSharing ? t.visible : t.private}
            </Text>
            <Switch
              value={isSharing}
              onValueChange={(v) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsSharing(v);
              }}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={colors.primaryForeground}
            />
          </View>
        </View>

        {/* Radar */}
        <View style={styles.radarSection}>
          <Radar
            colors={colors}
            isSharing={isSharing}
            friends={MOCK_FRIENDS}
            onSelectFriend={handleSelectFriend}
            familyDistress={!!familyDistress}
          />
          <View style={[styles.herePill, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.herePillText, { color: colors.mutedForeground }]}>{t.here}</Text>
          </View>
        </View>

        {/* Dynamic state card */}
        {familyDistress ? (
          <View style={[styles.careCard, { backgroundColor: "#A78BFA15", borderColor: "#A78BFA45" }]}>
            <View style={styles.careCardHead}>
              <View style={[styles.careCardIcon, { backgroundColor: "#A78BFA22" }]}>
                <Feather name="heart" size={26} color="#A78BFA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.careCardTitle, { color: colors.foreground }]}>{t.nearbyHeart}</Text>
                <Text style={[styles.careCardSub, { color: colors.mutedForeground }]}>
                  {familyDistress.dist} {t.away} • {t.triangulated}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => openSos()}
              style={({ pressed }) => [styles.careCardBtn, { backgroundColor: "#A78BFA", opacity: pressed ? 0.85 : 1 }]}
            >
              <Feather name="navigation" size={16} color="#FFFFFF" />
              <Text style={styles.careCardBtnText}>{t.helpFamily}</Text>
            </Pressable>
            <Pressable onPress={() => setFamilyDistress(null)} style={styles.dismissBtn}>
              <Text style={[styles.dismissText, { color: colors.mutedForeground }]}>
                {lang === "de" ? "Schließen" : "Dismiss"}
              </Text>
            </Pressable>
          </View>
        ) : isFriendDistress ? (
          <View style={[styles.careCard, { backgroundColor: "#DC262615", borderColor: "#DC262645" }]}>
            <View style={styles.careCardHead}>
              <View style={[styles.careCardIcon, { backgroundColor: "#DC262622" }]}>
                <Feather name="alert-triangle" size={26} color="#DC2626" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.careCardTitle, { color: colors.foreground }]}>{t.distress(focus!.name)}</Text>
                <Text style={[styles.careCardSub, { color: colors.mutedForeground }]}>
                  {t.currentPulse(focus!.status)}
                </Text>
              </View>
            </View>
            <View style={styles.careCardRow}>
              <Pressable
                onPress={() => openSos(focus!.name)}
                style={({ pressed }) => [styles.careCardBtn, { flex: 1, backgroundColor: "#DC2626", opacity: pressed ? 0.85 : 1 }]}
              >
                <Feather name="phone-call" size={16} color="#FFFFFF" />
                <Text style={styles.careCardBtnText}>{t.notify}</Text>
              </Pressable>
              <Pressable
                onPress={() => setFocus(null)}
                style={[styles.iconSquareBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>
        ) : isFindingFriend ? (
          <View style={[styles.careCard, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "45" }]}>
            <View style={styles.careCardHead}>
              <View style={[styles.careCardIcon, { backgroundColor: colors.primary + "22" }]}>
                <Feather name="navigation" size={26} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.careCardTitle, { color: colors.foreground }]}>{t.finding(focus!.name)}</Text>
                <Text style={[styles.careCardSub, { color: colors.mutedForeground }]}>{t.guidedWalk}</Text>
              </View>
            </View>
            <Pressable onPress={() => setFocus(null)} style={styles.dismissBtn}>
              <Text style={[styles.dismissText, { color: colors.mutedForeground }]}>
                {lang === "de" ? "Begleitung beenden" : "End guided walk"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.idleSection}>
            <Pressable
              onPress={() => openSos()}
              style={({ pressed }) => [styles.sosBtn, { opacity: pressed ? 0.9 : 1 }]}
            >
              <Feather name="shield" size={26} color="#FFFFFF" />
              <Text style={styles.sosBtnText}>{t.sos}</Text>
            </Pressable>
            <View style={[styles.meshCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather
                name={locationGranted === false ? "lock" : "radio"}
                size={16}
                color={locationGranted === false ? colors.mutedForeground : colors.primary}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.meshTitle,
                    { color: locationGranted === false ? colors.mutedForeground : colors.primary },
                  ]}
                >
                  {locationGranted === false ? t.locationOff : t.meshActive}
                </Text>
                <Text style={[styles.meshSub, { color: colors.mutedForeground }]}>
                  {locationGranted === false ? t.locationOffSub : t.meshSub}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Nearby circle list */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t.nearby}</Text>
        {MOCK_FRIENDS.map((f) => {
          const fc = stateColor(f.state, colors);
          return (
            <Pressable
              key={f.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSelectFriend(f);
              }}
              style={({ pressed }) => [
                styles.friendRow,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.friendRowDot, { backgroundColor: fc + "22", borderColor: fc + "66" }]}>
                <Feather name="heart" size={16} color={fc} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.friendRowName, { color: colors.foreground }]}>{f.name}</Text>
                <Text style={[styles.friendRowMsg, { color: colors.mutedForeground }]}>{f.msg[lang]}</Text>
              </View>
              <View style={styles.friendRowMeta}>
                <Text style={[styles.friendRowBpm, { color: fc }]}>{f.hr} BPM</Text>
                <Text style={[styles.friendRowDist, { color: colors.mutedForeground }]}>{f.dist} • Mesh</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <SosModal
        visible={sosOpen}
        onClose={() => setSosOpen(false)}
        colors={colors}
        lang={lang}
        friendName={sosFriend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  subtitle: { fontSize: 11, fontFamily: "Inter_500Medium", letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 },
  shareToggle: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  shareLabel: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 1, textTransform: "uppercase" },

  radarSection: { alignItems: "center", marginVertical: 24, gap: 14 },
  radar: { position: "relative", alignItems: "center", justifyContent: "center" },
  sweepWrap: { position: "absolute" },
  sweepLine: { position: "absolute", width: 2, borderRadius: 1 },
  selfWrap: { position: "absolute", width: 0, height: 0, alignItems: "center", justifyContent: "center" },
  selfPulse: { position: "absolute", width: 80, height: 80, borderRadius: 40 },
  selfCore: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  friendWrap: { position: "absolute", width: 0, height: 0, alignItems: "center", justifyContent: "center" },
  friendNode: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  friendLabel: { fontSize: 8, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, marginTop: 3, width: 70, textAlign: "center" },
  herePill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  herePillText: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, textTransform: "uppercase" },

  careCard: { borderRadius: 24, borderWidth: 1, padding: 18, gap: 16, marginBottom: 24 },
  careCardHead: { flexDirection: "row", alignItems: "center", gap: 14 },
  careCardIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  careCardTitle: { fontSize: 17, fontFamily: "Inter_700Bold", letterSpacing: 0.2 },
  careCardSub: { fontSize: 10, fontFamily: "Inter_500Medium", letterSpacing: 1, textTransform: "uppercase", marginTop: 4 },
  careCardRow: { flexDirection: "row", gap: 10 },
  careCardBtn: { height: 56, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  careCardBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  iconSquareBtn: { width: 56, height: 56, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  dismissBtn: { alignItems: "center", paddingVertical: 4 },
  dismissText: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1, textTransform: "uppercase" },

  idleSection: { alignItems: "center", gap: 16, marginBottom: 24 },
  sosBtn: { width: 84, height: 84, borderRadius: 42, backgroundColor: "#DC2626", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFFFFF", gap: 2, shadowColor: "#DC2626", shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  sosBtnText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  meshCard: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 20, borderWidth: 1, width: "100%" },
  meshTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  meshSub: { fontSize: 9, fontFamily: "Inter_500Medium", letterSpacing: 1, textTransform: "uppercase", marginTop: 3 },

  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 },
  friendRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 18, borderWidth: 1, marginBottom: 10 },
  friendRowDot: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  friendRowName: { fontSize: 13, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  friendRowMsg: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  friendRowMeta: { alignItems: "flex-end" },
  friendRowBpm: { fontSize: 12, fontFamily: "Inter_700Bold" },
  friendRowDist: { fontSize: 9, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 3 },

  modalBackdrop: { flex: 1, justifyContent: "flex-end" },
  modalSheet: { maxHeight: "92%", borderTopLeftRadius: 32, borderTopRightRadius: 32, borderWidth: 1, padding: 22, paddingBottom: 34 },
  modalHeader: { alignItems: "center", marginBottom: 18, gap: 8 },
  sosIconCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  modalTitle: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center", letterSpacing: 0.2 },
  modalSub: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center" },
  callRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  callRowLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  callRowText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, textTransform: "uppercase", flexShrink: 1 },
  callBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  callBtnText: { color: "#FFFFFF", fontSize: 12, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  sosOption: { borderRadius: 22, borderWidth: 1, padding: 18, gap: 12, marginBottom: 14 },
  sosOptionHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  sosOptionIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sosOptionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", letterSpacing: 0.2 },
  sosOptionBadge: { fontSize: 9, fontFamily: "Inter_600SemiBold", letterSpacing: 1, textTransform: "uppercase", marginTop: 3 },
  sosOptionDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sosOptionBtn: { height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  sosOptionBtnText: { color: "#FFFFFF", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 1, textTransform: "uppercase" },
  allWellBtn: { alignItems: "center", paddingVertical: 16 },
  allWellText: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 2, textTransform: "uppercase" },
  modalCenter: { alignItems: "center", justifyContent: "center", paddingVertical: 50, gap: 4 },
  sentTitle: { fontSize: 26, fontFamily: "Inter_700Bold", textAlign: "center", marginTop: 20, letterSpacing: 0.2 },
  sentTitleAccent: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center", marginTop: 2 },
  sentCard: { borderRadius: 24, borderWidth: 1, padding: 20, gap: 14, marginTop: 24, width: "100%" },
  sentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  sentRowText: { fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, textTransform: "uppercase", flex: 1 },
});
