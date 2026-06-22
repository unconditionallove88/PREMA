import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

export type AlarmType = "water" | "breathe" | "rest" | "depart";

interface Props {
  visible: boolean;
  type: AlarmType;
  lang: "en" | "de";
  onDone: () => void;
}

type IconName = React.ComponentProps<typeof Feather>["name"];

interface AlarmEntry {
  icon: IconName;
  color: string;
  en: { title: string; body: string; btn: string };
  de: { title: string; body: string; btn: string };
}

const CONTENT: Record<AlarmType, AlarmEntry> = {
  water: {
    icon: "droplet",
    color: "#38BDF8",
    en: {
      title: "Time to hydrate",
      body: "Take a moment to drink a glass of water — your body needs it.",
      btn: "Done — glass down",
    },
    de: {
      title: "Zeit zu trinken",
      body: "Trink ein Glas Wasser — dein Körper braucht es jetzt.",
      btn: "Erledigt",
    },
  },
  breathe: {
    icon: "wind",
    color: "#10B981",
    en: {
      title: "Breathing break",
      body: "Pause and take 3 deep breaths. In through the nose, out through the mouth.",
      btn: "Done — feeling centered",
    },
    de: {
      title: "Atempause",
      body: "Halte inne. 3 tiefe Atemzüge — durch die Nase ein, durch den Mund aus.",
      btn: "Erledigt — zentriert",
    },
  },
  rest: {
    icon: "moon",
    color: "#A78BFA",
    en: {
      title: "Rest reminder",
      body: "Your body is asking for stillness. Find a quiet spot and rest for a moment.",
      btn: "Done — took a rest",
    },
    de: {
      title: "Ruheerinnerung",
      body: "Dein Körper bittet um Stille. Finde eine ruhige Ecke und ruh dich aus.",
      btn: "Erledigt — ausgeruht",
    },
  },
  depart: {
    icon: "navigation",
    color: "#F59E0B",
    en: {
      title: "Time to head home",
      body: "Your planned time to leave has arrived. Stay together and travel safely.",
      btn: "Heading home now",
    },
    de: {
      title: "Zeit nach Hause zu gehen",
      body: "Deine Abfahrtzeit ist da. Bleibt zusammen und kommt sicher nach Hause.",
      btn: "Ich gehe jetzt nach Hause",
    },
  },
};

export function AlarmOverlay({ visible, type, lang, onDone }: Props) {
  const colors = useColors();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  const c = CONTENT[type];
  const copy = lang === "de" ? c.de : c.en;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      if (Platform.OS !== "web") {
        Vibration.vibrate([0, 600, 300, 600, 300, 600], true);
      }

      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();

      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      pulseRef.current.start();
    } else {
      if (Platform.OS !== "web") Vibration.cancel();
      pulseRef.current?.stop();
      pulseAnim.setValue(1);
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }

    return () => {
      if (Platform.OS !== "web") Vibration.cancel();
      pulseRef.current?.stop();
    };
  }, [visible]);

  const handleDone = () => {
    if (Platform.OS !== "web") Vibration.cancel();
    pulseRef.current?.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDone();
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: c.color + "50" }]}>
          <View style={[styles.iconOuter, { backgroundColor: c.color + "10" }]}>
            <View style={[styles.iconGlow, { backgroundColor: c.color + "20" }]} />
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Feather name={c.icon} size={56} color={c.color} />
            </Animated.View>
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>{copy.title}</Text>
          <Text style={[styles.body, { color: colors.mutedForeground }]}>{copy.body}</Text>

          <Pressable
            onPress={handleDone}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: c.color, opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Feather name="check" size={18} color="#fff" />
            <Text style={styles.btnText}>{copy.btn}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.88)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 36,
    alignItems: "center",
    gap: 16,
  },
  iconOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    position: "relative",
  },
  iconGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    height: 58,
    borderRadius: 29,
    marginTop: 8,
  },
  btnText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
