import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

const ARCHETYPES: {
  id: string;
  icon: FeatherName;
  color: string;
  en: string;
  de: string;
  sentenceEn: string;
  sentenceDe: string;
}[] = [
  {
    id: "brother",
    icon: "shield",
    color: "#93C5FD",
    en: "Brother",
    de: "Brüderliche Liebe",
    sentenceEn: "Existence is protected and held",
    sentenceDe: "Das Dasein ist beschützt und gehalten",
  },
  {
    id: "mother",
    icon: "heart",
    color: "#FDA4AF",
    en: "Mother",
    de: "Mütter",
    sentenceEn: "Nurturing love surrounds existence",
    sentenceDe: "Nährende Liebe umgibt das Dasein",
  },
  {
    id: "sister",
    icon: "user",
    color: "#A5B4FC",
    en: "Sister",
    de: "Schwester",
    sentenceEn: "Shared strength in unity",
    sentenceDe: "Geteilte Stärke in Einheit",
  },
  {
    id: "romantic",
    icon: "star",
    color: "#F9A8D4",
    en: "Romance",
    de: "Romantik",
    sentenceEn: "Hearts beating as one",
    sentenceDe: "Herzen schlagen als eins",
  },
  {
    id: "erotic",
    icon: "zap",
    color: "#FDBA74",
    en: "Erotica",
    de: "Erotik",
    sentenceEn: "Passion flows through life",
    sentenceDe: "Leidenschaft fließt durch das Leben",
  },
  {
    id: "friend",
    icon: "users",
    color: "#6EE7B7",
    en: "Friendship",
    de: "Freundschaft",
    sentenceEn: "Trust is the foundation",
    sentenceDe: "Vertrauen ist das Fundament",
  },
  {
    id: "human",
    icon: "globe",
    color: "#67E8F9",
    en: "We are One",
    de: "Wir sind Eins",
    sentenceEn: "All are connected now",
    sentenceDe: "Alle sind jetzt verbunden",
  },
  {
    id: "life",
    icon: "repeat",
    color: "#3DB879",
    en: "Life",
    de: "Leben",
    sentenceEn: "Existence is a gift",
    sentenceDe: "Das Dasein ist ein Geschenk",
  },
];

type FriendState = "steady" | "elevated" | "distress";
const MOCK_FRIENDS: {
  id: string;
  name: string;
  state: FriendState;
  msgEn: string;
  msgDe: string;
  dist: string;
}[] = [
  { id: "f1", name: "GABRIEL", state: "steady", msgEn: "Chilling near the bar", msgDe: "Entspannt an der Bar", dist: "12m" },
  { id: "f2", name: "LEANDRO", state: "elevated", msgEn: "Dancing intensely", msgDe: "Tanzt intensiv", dist: "45m" },
  { id: "f3", name: "MARINA", state: "distress", msgEn: "Needs a hydration break", msgDe: "Braucht eine Trinkpause", dist: "82m" },
];

const stateColor = (s: FriendState) =>
  s === "distress" ? "#DC2626" : s === "elevated" ? "#F59E0B" : "#10B981";

const COPY = {
  en: {
    title: "The Heart",
    sub: "Inside",
    letters: "Love Letters",
    lettersSub: "Future Self",
    bioPulse: "Biological Pulse",
    bioPulseSub: "Live rhythm",
    breath: "Breath of Love",
    breathSub: "Ritual Now",
    vision: "Vision of Love",
    visionSub: "Grounding Tool",
    footer: "Love Circle",
    bpm: "BPM",
    private: "Private",
    privateSub: "Inner circle",
    open: "Open",
    openSub: "Community care",
  },
  de: {
    title: "Das Herz",
    sub: "Inside",
    letters: "Liebesbriefe",
    lettersSub: "Zukünftiges Ich",
    bioPulse: "Biologischer Puls",
    bioPulseSub: "Rhythmus",
    breath: "Atem der Liebe",
    breathSub: "Ritual jetzt hier",
    vision: "Vision der Liebe",
    visionSub: "Erdungs Tool",
    footer: "Liebe Kreis",
    bpm: "BPM",
    private: "Privat",
    privateSub: "Innerer Kreis",
    open: "Offen",
    openSub: "Kreis der Fürsorge",
  },
};

// ─── Heart Visual ───────────────────────────────────────────────
function HeartVisual({
  lang,
  heartRate,
  showBPM,
  activeArchetype,
  onSelectArchetype,
  onFriendPress,
}: {
  lang: "en" | "de";
  heartRate: number;
  showBPM: boolean;
  activeArchetype: number;
  onSelectArchetype: (i: number) => void;
  onFriendPress: (id: string) => void;
}) {
  const colors = useColors();
  const pulse = useRef(new Animated.Value(1)).current;
  const aura = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.12, duration: 850, useNativeDriver: true }),
          Animated.timing(aura, { toValue: 0.45, duration: 850, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
          Animated.timing(aura, { toValue: 0.25, duration: 850, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, aura]);

  const SIZE = 300;
  const C = SIZE / 2;
  const ARCH_R = 132;
  const ARCH_BTN = 46;
  const FRIEND_R = 78;
  const FRIEND_BTN = 40;

  const current = ARCHETYPES[activeArchetype];

  return (
    <View style={{ width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" }}>
      {/* Aura glow */}
      <Animated.View
        style={[
          styles.aura,
          { backgroundColor: colors.primary, opacity: aura, transform: [{ scale: pulse }] },
        ]}
      />

      {/* Archetype ring */}
      {ARCHETYPES.map((arc, i) => {
        const angle = (i * 360) / ARCHETYPES.length;
        const rad = (angle * Math.PI) / 180;
        const x = C + ARCH_R * Math.cos(rad) - ARCH_BTN / 2;
        const y = C + ARCH_R * Math.sin(rad) - ARCH_BTN / 2;
        const isActive = activeArchetype === i;
        return (
          <Pressable
            key={arc.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelectArchetype(i);
            }}
            style={[
              styles.archBtn,
              {
                left: x,
                top: y,
                width: ARCH_BTN,
                height: ARCH_BTN,
                backgroundColor: isActive ? arc.color + "20" : colors.card,
                borderColor: isActive ? arc.color : colors.border,
                opacity: isActive ? 1 : 0.55,
                transform: [{ scale: isActive ? 1.12 : 1 }],
              },
            ]}
          >
            <Feather name={arc.icon} size={18} color={isActive ? arc.color : colors.mutedForeground} />
          </Pressable>
        );
      })}

      {/* Core */}
      <View style={[styles.core, { backgroundColor: colors.card, borderColor: colors.primary + "30" }]}>
        {/* Friend nodes */}
        {MOCK_FRIENDS.map((f, idx) => {
          const fAngle = (idx * 360) / MOCK_FRIENDS.length + 45;
          const rad = (fAngle * Math.PI) / 180;
          const coreSize = 208;
          const fc = coreSize / 2;
          const fx = fc + FRIEND_R * Math.cos(rad) - FRIEND_BTN / 2;
          const fy = fc + FRIEND_R * Math.sin(rad) - FRIEND_BTN / 2;
          const col = stateColor(f.state);
          return (
            <Pressable
              key={f.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onFriendPress(f.id);
              }}
              style={[styles.friendNode, { left: fx, top: fy, width: FRIEND_BTN, height: FRIEND_BTN, backgroundColor: col + "18", borderColor: col + "55" }]}
            >
              <Feather name="heart" size={13} color={col} />
            </Pressable>
          );
        })}

        {/* Central heart */}
        <Animated.View style={[styles.centerHeart, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "20", transform: [{ scale: pulse }] }]}>
          {showBPM ? (
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.bpmNum, { color: "#DC2626" }]}>{heartRate}</Text>
              <Text style={[styles.bpmLabel, { color: "#DC2626" }]}>{COPY[lang].bpm}</Text>
            </View>
          ) : (
            <Feather name="heart" size={46} color="#DC2626" />
          )}
        </Animated.View>

        <Text style={[styles.archLabel, { color: colors.primary }]}>
          {(lang === "de" ? current.de : current.en).toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

// ─── Love Letter Modal ──────────────────────────────────────────
const LETTER_COPY = {
  en: {
    title: "Love Letter",
    sub: "To your future self",
    prompt:
      "While you feel this light today, write a short note to the you of tomorrow. What would you like to tell yourself when things feel heavy?",
    placeholder: "Dear me, remember that you are loved...",
    button: "Seal with Love",
    successTitle: "Letter Sealed",
    affirmation: "I respect myself",
    return: "Return to Home",
    footer: "End-to-End Encrypted Note",
  },
  de: {
    title: "Liebesbrief",
    sub: "An dein zukünftiges Ich",
    prompt:
      "Während du dieses Licht heute spürst, schreibe eine kurze Notiz an dein Ich von morgen. Was möchtest du dir sagen, wenn sich die Dinge schwer anfühlen?",
    placeholder: "Liebes Ich, erinnere dich daran, dass du geliebt wirst...",
    button: "Mit Liebe versiegeln",
    successTitle: "Brief versiegelt",
    affirmation: "Ich respektiere mich selbst",
    return: "Zurück nach Hause",
    footer: "Ende-zu-Ende verschlüsselte Notiz",
  },
};

function LoveLetterModal({
  visible,
  lang,
  onClose,
}: {
  visible: boolean;
  lang: "en" | "de";
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const t = LETTER_COPY[lang];

  const reset = () => {
    setMessage("");
    setIsSent(false);
  };

  const handleSeal = async () => {
    if (!message.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      const raw = await AsyncStorage.getItem("prema_love_letters");
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ content: message.trim(), ts: Date.now() });
      await AsyncStorage.setItem("prema_love_letters", JSON.stringify(arr));
    } catch {
      // ignore persistence errors
    }
    setIsSent(true);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {isSent ? (
            <View style={styles.sealedWrap}>
              <View style={[styles.sealedIcon, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40" }]}>
                <Feather name="shield" size={42} color={colors.primary} />
              </View>
              <Text style={[styles.sealedTitle, { color: colors.foreground }]}>{t.successTitle}</Text>
              <Text style={[styles.sealedAffirm, { color: colors.mutedForeground }]}>"{t.affirmation}"</Text>
              <Pressable
                onPress={() => {
                  reset();
                  onClose();
                }}
                style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>{t.return}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <View style={[styles.modalIconBadge, { backgroundColor: colors.secondary }]}>
                    <Feather name="edit-2" size={20} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t.title}</Text>
                    <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>{t.sub}</Text>
                  </View>
                </View>
                <Pressable onPress={onClose} style={[styles.closeBtn, { borderColor: colors.border }]}>
                  <Feather name="x" size={18} color={colors.mutedForeground} />
                </Pressable>
              </View>

              <Text style={[styles.promptText, { color: colors.mutedForeground }]}>{t.prompt}</Text>

              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder={t.placeholder}
                placeholderTextColor={colors.mutedForeground + "80"}
                multiline
                style={[styles.letterInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
              />

              <Pressable
                onPress={handleSeal}
                disabled={!message.trim()}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  {
                    backgroundColor: message.trim() ? colors.primary : colors.border,
                    opacity: pressed && message.trim() ? 0.85 : 1,
                  },
                ]}
              >
                <Text style={[styles.primaryBtnText, { color: message.trim() ? colors.primaryForeground : colors.mutedForeground }]}>
                  {t.button}
                </Text>
                <Feather name="send" size={18} color={message.trim() ? colors.primaryForeground : colors.mutedForeground} />
              </Pressable>
              <Text style={[styles.modalFooter, { color: colors.mutedForeground }]}>{t.footer}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Vision of Love Modal ───────────────────────────────────────
const VISION_COPY = {
  en: {
    affirmations: ["Welcome to Harmony", "I respect you", "I am loved", "I accept you", "All is well", "I love you"],
    next: "Next: Breath of Love",
    return: "Home",
    footer: "Created in harmony",
  },
  de: {
    affirmations: ["Willkommen in Harmonie", "Ich bin geliebt", "Ich respektiere dich", "Ich akzeptiere dich", "Alles ist gut", "Ich liebe dich"],
    next: "Weiter: Atem der Liebe",
    return: "Zum Zuhause",
    footer: "In Harmonie erschaffen",
  },
};

const PRISMATIC = ["#2D7750", "#3DB879", "#1B4D3E", "#0C5C44", "#147A57"];

function VisionModal({
  visible,
  lang,
  onClose,
}: {
  visible: boolean;
  lang: "en" | "de";
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const t = VISION_COPY[lang];
  const [slide, setSlide] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) {
      setSlide(0);
      return;
    }
    const interval = setInterval(() => {
      Animated.timing(fade, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
        setSlide((p) => (p + 1) % t.affirmations.length);
        Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [visible, fade, t.affirmations.length]);

  const bg = PRISMATIC[slide % PRISMATIC.length];

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={[styles.visionRoot, { backgroundColor: bg, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.visionHeader}>
          <Pressable onPress={onClose} style={styles.visionClose}>
            <Feather name="x" size={22} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.visionBody}>
          <Animated.Text style={[styles.visionText, { opacity: fade }]}>
            {t.affirmations[slide]}
          </Animated.Text>
        </View>

        <View style={styles.visionFooter}>
          <View style={styles.visionDots}>
            {t.affirmations.map((_, i) => (
              <View
                key={i}
                style={[styles.visionDot, { width: i === slide ? 28 : 6, opacity: i === slide ? 1 : 0.3 }]}
              />
            ))}
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
              router.push("/self-care");
            }}
            style={({ pressed }) => [styles.visionNextBtn, { opacity: pressed ? 0.85 : 1 }]}
          >
            <Text style={styles.visionNextText}>{t.next}</Text>
            <Feather name="arrow-right" size={14} color="#2D7750" />
          </Pressable>
          <Pressable onPress={onClose} style={styles.visionHomeBtn}>
            <Text style={styles.visionHomeText}>{t.return}</Text>
          </Pressable>
          <Text style={styles.visionFooterText}>{t.footer}</Text>
        </View>
      </View>
    </Modal>
  );
}

// ─── Circle Chat Modal (local stub) ─────────────────────────────
const CHAT_COPY = {
  private: {
    en: {
      title: "Private",
      sub: "Your inner circle",
      desc: "A private space for your closest circle — speak freely and with love.",
      enter: "Enter the circle",
      placeholder: "Speak from the heart...",
      empty: "No messages yet",
      footer: "Created in harmony",
    },
    de: {
      title: "Privat",
      sub: "Dein innerer Kreis",
      desc: "Ein privater Raum für deinen engsten Kreis — sprich frei und mit Liebe.",
      enter: "Den Kreis betreten",
      placeholder: "Vom Herzen sprechen...",
      empty: "Noch keine Nachrichten",
      footer: "In Harmonie erschaffen",
    },
  },
  open: {
    en: {
      title: "Open",
      sub: "Community care circle",
      desc: "A shared space rooted in kindness and presence.",
      enter: "Enter the circle",
      placeholder: "Share kindness...",
      empty: "No messages yet",
      footer: "Grounded in presence",
      guardian: "Pulse Guardian present",
      rules: [
        "Unconditional kindness for all",
        "No promotion of substances",
        "Respect each other's anonymity",
        "Speak only from presence",
        "Unity is the focus",
      ],
    },
    de: {
      title: "Offen",
      sub: "Kreis der Fürsorge",
      desc: "Ein geteilter Raum der Freundlichkeit und Präsenz.",
      enter: "Dem Kreis beitreten",
      placeholder: "Freundlichkeit teilen...",
      empty: "Noch keine Nachrichten",
      footer: "Geerdet in Präsenz",
      guardian: "Pulse Guardian präsent",
      rules: [
        "Bedingungslose Freundlichkeit für alle",
        "Keine Bewerbung von Substanzen",
        "Respektiere die Anonymität",
        "Spreche nur aus Präsenz",
        "Einheit ist der Fokus",
      ],
    },
  },
};

const NATURE_PREFIXES = ["Emerald", "Golden", "Mystic", "Quiet", "Velvet", "Silver", "Primal", "Crystal"];
const NATURE_NOUNS = ["Leaf", "Wave", "Wind", "Bloom", "Echo", "Flame", "Stone", "Mist"];

interface ChatMsg {
  id: string;
  text: string;
  mine: boolean;
  sender: string;
  ts: number;
}

function CircleChatModal({
  visible,
  variant,
  lang,
  onClose,
}: {
  visible: boolean;
  variant: "private" | "open";
  lang: "en" | "de";
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const t = (CHAT_COPY[variant] as any)[lang];
  const storageKey = variant === "private" ? "prema_private_chat" : "prema_open_chat";

  const [entered, setEntered] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const alias = useMemo(() => {
    const p = NATURE_PREFIXES[Math.floor(Math.random() * NATURE_PREFIXES.length)];
    const n = NATURE_NOUNS[Math.floor(Math.random() * NATURE_NOUNS.length)];
    return `${p} ${n}`;
  }, []);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) setMessages(JSON.parse(raw));
      } catch {
        // ignore
      }
    })();
  }, [visible, storageKey]);

  const persist = (next: ChatMsg[]) => {
    setMessages(next);
    AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(() => {});
  };

  const handleSend = () => {
    if (!input.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const msg: ChatMsg = {
      id: `${Date.now()}`,
      text: input.trim(),
      mine: true,
      sender: variant === "open" ? alias : lang === "de" ? "Du" : "You",
      ts: Date.now(),
    };
    persist([...messages, msg]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={[styles.chatSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={[styles.modalIconBadge, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={variant === "private" ? "lock" : "users"} size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>{t.title}</Text>
                <Text style={[styles.modalSub, { color: colors.primary }]}>{t.sub}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={[styles.closeBtn, { borderColor: colors.border }]}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {variant === "open" && entered && (
            <View style={[styles.guardianBar, { backgroundColor: colors.primary + "12" }]}>
              <Feather name="shield" size={13} color={colors.primary} />
              <Text style={[styles.guardianText, { color: colors.primary }]}>{t.guardian}</Text>
            </View>
          )}

          {!entered ? (
            <View style={styles.gateWrap}>
              <Text style={[styles.gateDesc, { color: colors.mutedForeground }]}>{t.desc}</Text>
              {variant === "open" && (
                <View style={styles.rulesList}>
                  {(t.rules as string[]).map((r, i) => (
                    <View key={i} style={styles.ruleRow}>
                      <View style={[styles.ruleDot, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.ruleText, { color: colors.foreground }]}>{r}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setEntered(true);
                }}
                style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
              >
                <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>{t.enter}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <ScrollView
                ref={scrollRef}
                style={{ flex: 1 }}
                contentContainerStyle={styles.chatScroll}
                onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
              >
                {messages.length === 0 && (
                  <View style={styles.chatEmpty}>
                    <Feather name="message-circle" size={28} color={colors.mutedForeground + "60"} />
                    <Text style={[styles.chatEmptyText, { color: colors.mutedForeground }]}>{t.empty}</Text>
                  </View>
                )}
                {messages.map((m) => (
                  <View key={m.id} style={[styles.msgWrap, { alignItems: m.mine ? "flex-end" : "flex-start" }]}>
                    <Text style={[styles.msgSender, { color: colors.mutedForeground }]}>{m.sender}</Text>
                    <View
                      style={[
                        styles.msgBubble,
                        m.mine
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
                      ]}
                    >
                      <Text style={[styles.msgText, { color: m.mine ? colors.primaryForeground : colors.foreground }]}>{m.text}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.chatInputRow}>
                <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder={t.placeholder}
                  placeholderTextColor={colors.mutedForeground + "80"}
                  style={[styles.chatInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground }]}
                  onSubmitEditing={handleSend}
                  returnKeyType="send"
                />
                <Pressable
                  onPress={handleSend}
                  disabled={!input.trim()}
                  style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: input.trim() ? 1 : 0.4 }]}
                >
                  <Feather name="send" size={16} color={colors.primaryForeground} />
                </Pressable>
              </View>
              <Text style={[styles.modalFooter, { color: colors.mutedForeground }]}>{t.footer}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ────────────────────────────────────────────────
export default function HeartStatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const t = COPY[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : 0;

  const [heartRate, setHeartRate] = useState(75);
  const [showBPM, setShowBPM] = useState(false);
  const [activeArchetype, setActiveArchetype] = useState(7);

  const [letterOpen, setLetterOpen] = useState(false);
  const [visionOpen, setVisionOpen] = useState(false);
  const [privateOpen, setPrivateOpen] = useState(false);
  const [openCircle, setOpenCircle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        return Math.max(50, Math.min(160, prev + drift));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBioPulse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowBPM(true);
    setTimeout(() => setShowBPM(false), 5000);
  };

  const tools: { key: string; icon: FeatherName; label: string; sub: string; tint: string; onPress: () => void }[] = [
    { key: "letters", icon: "edit-2", label: t.letters, sub: t.lettersSub, tint: "#8B5CF6", onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setLetterOpen(true); } },
    { key: "pulse", icon: "activity", label: t.bioPulse, sub: t.bioPulseSub, tint: "#10B981", onPress: handleBioPulse },
    { key: "breath", icon: "wind", label: t.breath, sub: t.breathSub, tint: "#06B6D4", onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/self-care"); } },
    { key: "vision", icon: "eye", label: t.vision, sub: t.visionSub, tint: "#0EA5E9", onPress: () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setVisionOpen(true); } },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>{t.title.toUpperCase()}</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>{t.sub.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.container, { paddingBottom: botPad + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Heart visual */}
        <View style={styles.visualWrap}>
          <HeartVisual
            lang={lang}
            heartRate={heartRate}
            showBPM={showBPM}
            activeArchetype={activeArchetype}
            onSelectArchetype={setActiveArchetype}
            onFriendPress={() => router.push("/(tabs)")}
          />
        </View>

        {/* Tools */}
        <View style={styles.toolGrid}>
          {tools.map((tool) => (
            <Pressable
              key={tool.key}
              onPress={tool.onPress}
              style={({ pressed }) => [
                styles.toolCard,
                { backgroundColor: tool.tint + "12", borderColor: tool.tint + "30", opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.tint + "20" }]}>
                <Feather name={tool.icon} size={20} color={tool.tint} />
              </View>
              <Text style={[styles.toolLabel, { color: colors.foreground }]}>{tool.label}</Text>
              <Text style={[styles.toolSub, { color: colors.mutedForeground }]}>{tool.sub}</Text>
            </Pressable>
          ))}
        </View>

        {/* Circle chats */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{t.footer.toUpperCase()}</Text>
        <View style={styles.circleRow}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPrivateOpen(true); }}
            style={({ pressed }) => [styles.circleCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={[styles.circleIcon, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="lock" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.circleTitle, { color: colors.foreground }]}>{t.private}</Text>
            <Text style={[styles.circleSub, { color: colors.mutedForeground }]}>{t.privateSub}</Text>
          </Pressable>

          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setOpenCircle(true); }}
            style={({ pressed }) => [styles.circleCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
          >
            <View style={[styles.circleIcon, { backgroundColor: colors.primary + "15" }]}>
              <Feather name="users" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.circleTitle, { color: colors.foreground }]}>{t.open}</Text>
            <Text style={[styles.circleSub, { color: colors.mutedForeground }]}>{t.openSub}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <LoveLetterModal visible={letterOpen} lang={lang} onClose={() => setLetterOpen(false)} />
      <VisionModal visible={visionOpen} lang={lang} onClose={() => setVisionOpen(false)} />
      <CircleChatModal visible={privateOpen} variant="private" lang={lang} onClose={() => setPrivateOpen(false)} />
      <CircleChatModal visible={openCircle} variant="open" lang={lang} onClose={() => setOpenCircle(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontFamily: "Nunito_700Bold", letterSpacing: -0.5 },
  subtitle: { fontSize: 10, fontFamily: "Nunito_700Bold", letterSpacing: 4 },
  container: { paddingHorizontal: 20, paddingTop: 8 },

  visualWrap: { alignItems: "center", marginVertical: 16 },
  aura: { position: "absolute", width: 240, height: 240, borderRadius: 120 },
  archBtn: { position: "absolute", borderRadius: 23, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  core: { width: 208, height: 208, borderRadius: 104, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  friendNode: { position: "absolute", borderRadius: 20, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  centerHeart: { width: 96, height: 96, borderRadius: 48, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  bpmNum: { fontSize: 30, fontFamily: "Nunito_700Bold", letterSpacing: -1 },
  bpmLabel: { fontSize: 9, fontFamily: "Nunito_700Bold", letterSpacing: 2 },
  archLabel: { position: "absolute", bottom: 26, fontSize: 9, fontFamily: "Nunito_700Bold", letterSpacing: 3 },

  toolGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  toolCard: { width: "47%", flexGrow: 1, alignItems: "center", paddingVertical: 18, borderRadius: 18, borderWidth: 1, gap: 6 },
  toolIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  toolLabel: { fontSize: 12, fontFamily: "Nunito_600SemiBold", textAlign: "center" },
  toolSub: { fontSize: 9, fontFamily: "Nunito_400Regular", letterSpacing: 1, textTransform: "uppercase" },

  sectionLabel: { fontSize: 9, fontFamily: "Nunito_600SemiBold", letterSpacing: 3, textAlign: "center", marginTop: 28, marginBottom: 12 },
  circleRow: { flexDirection: "row", gap: 12 },
  circleCard: { flex: 1, alignItems: "center", paddingVertical: 18, borderRadius: 18, borderWidth: 1, gap: 6 },
  circleIcon: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  circleTitle: { fontSize: 13, fontFamily: "Nunito_600SemiBold" },
  circleSub: { fontSize: 9, fontFamily: "Nunito_400Regular", letterSpacing: 0.8, textTransform: "uppercase" },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", paddingHorizontal: 16 },
  modalSheet: { borderRadius: 28, borderWidth: 1, padding: 22 },
  chatSheet: { borderRadius: 28, borderWidth: 1, padding: 18, height: "82%" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalIconBadge: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  modalTitle: { fontSize: 18, fontFamily: "Nunito_700Bold" },
  modalSub: { fontSize: 10, fontFamily: "Nunito_600SemiBold", letterSpacing: 2, textTransform: "uppercase" },
  closeBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  promptText: { fontSize: 13, fontFamily: "Nunito_400Regular", lineHeight: 20, marginBottom: 16 },
  letterInput: { minHeight: 140, borderRadius: 20, borderWidth: 1, padding: 16, fontSize: 15, fontFamily: "Nunito_400Regular", textAlignVertical: "top", marginBottom: 18 },
  primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 56, borderRadius: 28 },
  primaryBtnText: { fontSize: 15, fontFamily: "Nunito_700Bold", letterSpacing: 0.5 },
  modalFooter: { fontSize: 9, fontFamily: "Nunito_600SemiBold", letterSpacing: 2, textTransform: "uppercase", textAlign: "center", marginTop: 14 },

  sealedWrap: { alignItems: "center", paddingVertical: 24, gap: 18 },
  sealedIcon: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  sealedTitle: { fontSize: 24, fontFamily: "Nunito_700Bold" },
  sealedAffirm: { fontSize: 14, fontFamily: "Nunito_500Medium", fontStyle: "italic", textAlign: "center", marginBottom: 6 },

  // Chat
  guardianBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, marginBottom: 12 },
  guardianText: { fontSize: 9, fontFamily: "Nunito_600SemiBold", letterSpacing: 2, textTransform: "uppercase" },
  gateWrap: { flex: 1, justifyContent: "center", gap: 18, paddingHorizontal: 6 },
  gateDesc: { fontSize: 14, fontFamily: "Nunito_400Regular", lineHeight: 21, textAlign: "center" },
  rulesList: { gap: 6 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 4 },
  ruleDot: { width: 6, height: 6, borderRadius: 3 },
  ruleText: { fontSize: 14, fontFamily: "Nunito_400Regular" },
  chatScroll: { paddingVertical: 8, gap: 14, flexGrow: 1 },
  chatEmpty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 60 },
  chatEmptyText: { fontSize: 13, fontFamily: "Nunito_400Regular" },
  msgWrap: { gap: 4 },
  msgSender: { fontSize: 9, fontFamily: "Nunito_500Medium", letterSpacing: 1.5, textTransform: "uppercase", paddingHorizontal: 10 },
  msgBubble: { maxWidth: "82%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  msgText: { fontSize: 14, fontFamily: "Nunito_400Regular", lineHeight: 20 },
  chatInputRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  chatInput: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, paddingHorizontal: 18, fontSize: 14, fontFamily: "Nunito_400Regular" },
  sendBtn: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },

  // Vision
  visionRoot: { flex: 1, paddingHorizontal: 24 },
  visionHeader: { flexDirection: "row", justifyContent: "flex-end" },
  visionClose: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  visionBody: { flex: 1, alignItems: "center", justifyContent: "center" },
  visionText: { fontSize: 40, fontFamily: "Nunito_700Bold", color: "#FFFFFF", textAlign: "center", letterSpacing: -1, lineHeight: 46, textTransform: "lowercase" },
  visionFooter: { alignItems: "center", gap: 16 },
  visionDots: { flexDirection: "row", gap: 6, marginBottom: 8 },
  visionDot: { height: 6, borderRadius: 3, backgroundColor: "#FFFFFF" },
  visionNextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", height: 52, borderRadius: 26, backgroundColor: "#FFFFFF" },
  visionNextText: { fontSize: 12, fontFamily: "Nunito_700Bold", color: "#2D7750", letterSpacing: 2, textTransform: "uppercase" },
  visionHomeBtn: { width: "100%", height: 48, borderRadius: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.4)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.1)" },
  visionHomeText: { fontSize: 12, fontFamily: "Nunito_700Bold", color: "#FFFFFF", letterSpacing: 2, textTransform: "uppercase" },
  visionFooterText: { fontSize: 9, fontFamily: "Nunito_600SemiBold", color: "rgba(255,255,255,0.7)", letterSpacing: 3, textTransform: "uppercase", marginTop: 6 },
});
