import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GradientBackground } from "@/components/GradientBackground";
import { useSession } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

const RELATIONSHIP_OPTIONS: { key: string; en: string; de: string }[] = [
  { key: "best_friend", en: "Best Friend", de: "Beste:r Freund:in" },
  { key: "partner", en: "Partner", de: "Partner:in" },
  { key: "sister", en: "Sister", de: "Schwester" },
  { key: "brother", en: "Brother", de: "Bruder" },
  { key: "parent", en: "Parent", de: "Elternteil" },
  { key: "trusted_friend", en: "Trusted Friend", de: "Vertraute:r" },
];

interface Bond {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

const CONTENT = {
  en: {
    label: "CIRCLE OF LOVE",
    title: "Who holds you?",
    badge: "Sacred Holding",
    sub: "Add people who love you. We inform them if needed.",
    guardians: "Your Trusted Bonds",
    slots: (count: number) => `${count}/5 Bonds`,
    empty: "Your circle is open",
    add: "Add someone who loves you",
    newTitle: "New Trusted Bond",
    save: "Save Bond",
    cancel: "Cancel",
    nameLabel: "Full Name",
    namePlaceholder: "Enter name",
    relationshipLabel: "Relationship",
    phoneLabel: "Phone Number",
    phonePlaceholder: "+...",
    codeTitle: "The Resonance Code",
    codeSub: "Sacred Dispatch Word",
    codeDesc:
      "If you text this word to your bonds they know to hold space for you immediately.",
    codePlaceholder: "e.g. PINEAPPLE",
    seal: "Seal Code",
    activeCode: (code: string) => `Active Code: ${code}`,
    footer: "Bonds are private and encrypted",
    created: "Created in harmony",
  },
  de: {
    label: "CIRCLE OF LOVE",
    title: "Wer hält dich?",
    badge: "Heilige Geborgenheit",
    sub: "Füge Menschen hinzu die dich lieben. Wir informieren sie bei Bedarf.",
    guardians: "Deine vertrauten Bindungen",
    slots: (count: number) => `${count}/5 Bindungen`,
    empty: "Dein Circle ist offen",
    add: "Jemanden der dich liebt",
    newTitle: "Neue vertraute Bindung",
    save: "Bindung speichern",
    cancel: "Abbrechen",
    nameLabel: "Vollständiger Name",
    namePlaceholder: "Name eingeben",
    relationshipLabel: "Beziehung",
    phoneLabel: "Telefonnummer",
    phonePlaceholder: "+...",
    codeTitle: "Das Resonanz Wort",
    codeSub: "Heiliges Dispatch Wort",
    codeDesc:
      "Wenn du dieses Wort an deine Bindungen schreibst, wissen sie dass du Halt brauchst.",
    codePlaceholder: "z.B. ANANAS",
    seal: "Wort versiegeln",
    activeCode: (code: string) => `Aktives Wort: ${code}`,
    footer: "Bindungen sind privat geschützt",
    created: "In Harmonie erschaffen",
  },
};

const BONDS_KEY = "prema_bonds";
const CODE_KEY = "prema_resonance_code";

export default function NetworkScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { lang } = useSession();
  const t = CONTENT[lang];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [bonds, setBonds] = useState<Bond[]>([]);
  const [resonanceCode, setResonanceCode] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [form, setForm] = useState({ name: "", relationship: "", phone: "" });

  useEffect(() => {
    (async () => {
      const [bondsRaw, codeRaw] = await Promise.all([
        AsyncStorage.getItem(BONDS_KEY),
        AsyncStorage.getItem(CODE_KEY),
      ]);
      if (bondsRaw) {
        try {
          setBonds(JSON.parse(bondsRaw));
        } catch {}
      }
      if (codeRaw) setResonanceCode(codeRaw);
    })();
  }, []);

  const persistBonds = (next: Bond[]) => {
    setBonds(next);
    AsyncStorage.setItem(BONDS_KEY, JSON.stringify(next));
  };

  const guardiansCount = bonds.length;

  const handleAddBond = () => {
    if (!form.name.trim() || !form.relationship) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const next: Bond[] = [
      ...bonds,
      {
        id: `${Date.now()}`,
        name: form.name.trim(),
        relationship: form.relationship,
        phone: form.phone.trim(),
      },
    ];
    persistBonds(next);
    setForm({ name: "", relationship: "", phone: "" });
    setShowAddForm(false);
  };

  const handleRemoveBond = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    persistBonds(bonds.filter((b) => b.id !== id));
  };

  const handleSaveCode = () => {
    const trimmed = codeInput.trim();
    if (!trimmed) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResonanceCode(trimmed);
    AsyncStorage.setItem(CODE_KEY, trimmed);
    setCodeInput("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <GradientBackground />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: topPad + 24,
          paddingBottom: botPad + 110,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {t.label}
        </Text>

        {/* Hero card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
          ]}
        >
          <Feather
            name="heart"
            size={140}
            color={colors.primary}
            style={styles.heroHeart}
          />
          <View style={styles.heroBadge}>
            <Feather name="star" size={13} color={colors.primary} />
            <Text style={[styles.heroBadgeText, { color: colors.primary }]}>
              {t.badge}
            </Text>
          </View>
          <Text style={[styles.heroTitle, { color: colors.foreground }]}>
            {t.title}
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            {t.sub}
          </Text>
        </View>

        {/* Bonds section header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            {t.guardians}
          </Text>
          <View
            style={[
              styles.slotBadge,
              { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
            ]}
          >
            <Text style={[styles.slotBadgeText, { color: colors.primary }]}>
              {t.slots(guardiansCount)}
            </Text>
          </View>
        </View>

        {/* Bonds list */}
        {bonds.length ? (
          <View style={{ gap: 12 }}>
            {bonds.map((bond) => (
              <View
                key={bond.id}
                style={[
                  styles.bondCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.bondInfo}>
                  <View
                    style={[
                      styles.bondAvatar,
                      { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
                    ]}
                  >
                    <Feather name="user" size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bondName, { color: colors.foreground }]}>
                      {bond.name}
                    </Text>
                    <Text style={[styles.bondMeta, { color: colors.primary }]}>
                      {RELATIONSHIP_OPTIONS.find((o) => o.key === bond.relationship)?.[lang] ??
                        bond.relationship}
                      {bond.phone ? ` • ${bond.phone}` : ""}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => handleRemoveBond(bond.id)}
                  style={[
                    styles.removeBtn,
                    { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "30" },
                  ]}
                >
                  <Feather name="trash-2" size={16} color={colors.destructive} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyState, { borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {t.empty}
            </Text>
          </View>
        )}

        {/* Add bond button / form */}
        {guardiansCount < 5 && !showAddForm && (
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAddForm(true);
            }}
            style={({ pressed }) => [
              styles.addBtn,
              {
                backgroundColor: colors.primary + "08",
                borderColor: colors.primary + "30",
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View
              style={[
                styles.addIcon,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="user-plus" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.addText, { color: colors.primary }]}>{t.add}</Text>
          </Pressable>
        )}

        {showAddForm && (
          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.card, borderColor: colors.primary + "40" },
            ]}
          >
            <View style={styles.formHeader}>
              <Feather name="user-plus" size={22} color={colors.primary} />
              <Text style={[styles.formTitle, { color: colors.foreground }]}>
                {t.newTitle}
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              <View style={{ gap: 8 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                  {t.nameLabel}
                </Text>
                <TextInput
                  value={form.name}
                  onChangeText={(v) => setForm({ ...form, name: v })}
                  placeholder={t.namePlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                  ]}
                />
              </View>

              <View style={{ gap: 8 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                  {t.relationshipLabel}
                </Text>
                <View style={styles.chipWrap}>
                  {RELATIONSHIP_OPTIONS.map((opt) => {
                    const active = form.relationship === opt.key;
                    return (
                      <Pressable
                        key={opt.key}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setForm({ ...form, relationship: opt.key });
                        }}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: active ? colors.primary + "20" : colors.background,
                            borderColor: active ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            { color: active ? colors.primary : colors.mutedForeground },
                          ]}
                        >
                          {opt[lang]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
                  {t.phoneLabel}
                </Text>
                <TextInput
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  placeholder={t.phonePlaceholder}
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
                  ]}
                />
              </View>
            </View>

            <View style={styles.formActions}>
              <Pressable
                onPress={() => {
                  setShowAddForm(false);
                  setForm({ name: "", relationship: "", phone: "" });
                }}
                style={({ pressed }) => [
                  styles.cancelBtn,
                  { backgroundColor: colors.background, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>
                  {t.cancel}
                </Text>
              </Pressable>
              <Pressable
                onPress={handleAddBond}
                style={({ pressed }) => [
                  styles.saveBtn,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={[styles.saveBtnText, { color: colors.primaryForeground }]}>
                  {t.save}
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Resonance code */}
        <View
          style={[
            styles.codeCard,
            { backgroundColor: colors.card, borderColor: colors.primary + "30" },
          ]}
        >
          <View style={styles.codeHeader}>
            <View
              style={[
                styles.codeIcon,
                { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" },
              ]}
            >
              <Feather name="lock" size={26} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.codeTitle, { color: colors.foreground }]}>
                {t.codeTitle}
              </Text>
              <Text style={[styles.codeSub, { color: colors.primary }]}>
                {t.codeSub}
              </Text>
            </View>
          </View>

          <Text style={[styles.codeDesc, { color: colors.mutedForeground }]}>
            {t.codeDesc}
          </Text>

          <TextInput
            value={codeInput}
            onChangeText={setCodeInput}
            placeholder={resonanceCode || t.codePlaceholder}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="characters"
            style={[
              styles.codeInput,
              { backgroundColor: colors.background, borderColor: colors.border, color: colors.foreground },
            ]}
          />

          <Pressable
            onPress={handleSaveCode}
            style={({ pressed }) => [
              styles.sealBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="shield" size={16} color={colors.primaryForeground} />
            <Text style={[styles.sealBtnText, { color: colors.primaryForeground }]}>
              {t.seal}
            </Text>
          </Pressable>

          {!!resonanceCode && (
            <Text style={[styles.activeCode, { color: colors.primary }]}>
              {t.activeCode(resonanceCode)}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Feather name="heart" size={26} color={colors.primary} />
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            {t.footer}
          </Text>
          <Text style={[styles.footerCreated, { color: colors.primary }]}>
            {t.created}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  heroCard: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 28,
    overflow: "hidden",
    marginBottom: 28,
  },
  heroHeart: {
    position: "absolute",
    right: -24,
    bottom: -24,
    opacity: 0.1,
    transform: [{ rotate: "12deg" }],
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    marginBottom: 12,
  },
  heroSub: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    lineHeight: 21,
    maxWidth: 300,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  slotBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  slotBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bondCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  bondInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  bondAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bondName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  bondMeta: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  removeBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 2,
    borderStyle: "dashed",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  addBtn: {
    marginTop: 14,
    paddingVertical: 32,
    alignItems: "center",
    gap: 14,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  formCard: {
    marginTop: 14,
    borderRadius: 28,
    borderWidth: 2,
    padding: 24,
    gap: 20,
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  formTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  fieldLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginLeft: 4,
  },
  input: {
    height: 54,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  saveBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  codeCard: {
    marginTop: 28,
    borderRadius: 28,
    borderWidth: 2,
    padding: 24,
    gap: 18,
  },
  codeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  codeIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  codeTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  codeSub: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  codeDesc: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
  codeInput: {
    height: 60,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  sealBtn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sealBtnText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  activeCode: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    gap: 14,
    paddingTop: 36,
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  footerCreated: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});
