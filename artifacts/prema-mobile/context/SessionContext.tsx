import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Phase = "before" | "during" | "recovery";

export type Vibe = "dark" | "bright";

export type PrepStep =
  | "testing"
  | "essentials"
  | "nutrition"
  | "rest"
  | "alarms"
  | "sync";

export interface CareAlarms {
  intakeLimit: number;
  departureHour: number;
  breathingBreak: number;
  hydrationSync: number;
}

export interface NoteEntry {
  text: string;
  ts: number;
}

export interface SessionContextValue {
  phase: Phase;
  setPhase: (p: Phase) => void;
  lang: "en" | "de";
  setLang: (l: "en" | "de") => void;
  theme: Vibe;
  setTheme: (v: Vibe) => void;
  completed: Record<PrepStep, boolean>;
  toggleStep: (step: PrepStep) => void;
  allComplete: boolean;
  resetSession: () => void;
  hasOnboarded: boolean | null;
  completeOnboarding: () => void;
  userName: string;
  intention: string | null;
  setIntention: (i: string | null) => void;
  careAlarms: CareAlarms;
  setCareAlarms: React.Dispatch<React.SetStateAction<CareAlarms>>;
  quickNotes: NoteEntry[];
  addQuickNote: (text: string) => void;
  journalEntries: NoteEntry[];
  addJournalEntry: (text: string) => void;
}

const DEFAULT_CARE_ALARMS: CareAlarms = {
  intakeLimit: 5,
  departureHour: 3,
  breathingBreak: 60,
  hydrationSync: 30,
};

const defaultCompleted: Record<PrepStep, boolean> = {
  testing: false,
  essentials: false,
  nutrition: false,
  rest: false,
  alarms: false,
  sync: false,
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhaseState] = useState<Phase>("before");
  const [lang, setLangState] = useState<"en" | "de">("en");
  const [theme, setThemeState] = useState<Vibe>("bright");
  const [completed, setCompleted] =
    useState<Record<PrepStep, boolean>>(defaultCompleted);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");
  const [intention, setIntentionState] = useState<string | null>(null);
  const [careAlarms, setCareAlarms] = useState<CareAlarms>(DEFAULT_CARE_ALARMS);
  const [quickNotes, setQuickNotes] = useState<NoteEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<NoteEntry[]>([]);

  useEffect(() => {
    (async () => {
      const [ph, ln, th, comp, onboarded, uname, intKey, alarmsRaw, notesRaw, journalRaw] =
        await Promise.all([
          AsyncStorage.getItem("prema_phase"),
          AsyncStorage.getItem("prema_lang"),
          AsyncStorage.getItem("prema_theme"),
          AsyncStorage.getItem("prema_completed"),
          AsyncStorage.getItem("prema_onboarded"),
          AsyncStorage.getItem("prema_user_name"),
          AsyncStorage.getItem("prema_intention"),
          AsyncStorage.getItem("prema_care_alarms"),
          AsyncStorage.getItem("prema_quick_notes"),
          AsyncStorage.getItem("prema_journal"),
        ]);
      if (ph === "before" || ph === "during" || ph === "recovery")
        setPhaseState(ph);
      if (ln === "en" || ln === "de") setLangState(ln);
      if (th === "dark" || th === "bright") setThemeState(th);
      if (comp) { try { setCompleted(JSON.parse(comp)); } catch {} }
      setHasOnboarded(onboarded === "true");
      setUserName(uname || "");
      if (intKey) setIntentionState(intKey);
      if (alarmsRaw) { try { setCareAlarms({ ...DEFAULT_CARE_ALARMS, ...JSON.parse(alarmsRaw) }); } catch {} }
      if (notesRaw) { try { setQuickNotes(JSON.parse(notesRaw)); } catch {} }
      if (journalRaw) { try { setJournalEntries(JSON.parse(journalRaw)); } catch {} }
    })();
  }, []);

  const setPhase = useCallback((p: Phase) => {
    setPhaseState(p);
    AsyncStorage.setItem("prema_phase", p);
  }, []);

  const setLang = useCallback((l: "en" | "de") => {
    setLangState(l);
    AsyncStorage.setItem("prema_lang", l);
  }, []);

  const setTheme = useCallback((v: Vibe) => {
    setThemeState(v);
    AsyncStorage.setItem("prema_theme", v);
  }, []);

  const toggleStep = useCallback((step: PrepStep) => {
    setCompleted((prev) => {
      const next = { ...prev, [step]: !prev[step] };
      AsyncStorage.setItem("prema_completed", JSON.stringify(next));
      return next;
    });
  }, []);

  const resetSession = useCallback(() => {
    setPhaseState("before");
    setCompleted(defaultCompleted);
    setQuickNotes([]);
    AsyncStorage.multiSet([
      ["prema_phase", "before"],
      ["prema_completed", JSON.stringify(defaultCompleted)],
      ["prema_quick_notes", "[]"],
    ]);
  }, []);

  const completeOnboarding = useCallback(() => {
    setHasOnboarded(true);
    AsyncStorage.setItem("prema_onboarded", "true");
  }, []);

  const setIntention = useCallback((i: string | null) => {
    setIntentionState(i);
    if (i) AsyncStorage.setItem("prema_intention", i);
    else AsyncStorage.removeItem("prema_intention");
  }, []);

  const addQuickNote = useCallback((text: string) => {
    const entry: NoteEntry = { text, ts: Date.now() };
    setQuickNotes((prev) => {
      const next = [entry, ...prev];
      AsyncStorage.setItem("prema_quick_notes", JSON.stringify(next));
      return next;
    });
  }, []);

  const addJournalEntry = useCallback((text: string) => {
    const entry: NoteEntry = { text, ts: Date.now() };
    setJournalEntries((prev) => {
      const next = [entry, ...prev];
      AsyncStorage.setItem("prema_journal", JSON.stringify(next));
      return next;
    });
  }, []);

  const allComplete = Object.values(completed).every(Boolean);

  return (
    <SessionContext.Provider
      value={{
        phase,
        setPhase,
        lang,
        setLang,
        theme,
        setTheme,
        completed,
        toggleStep,
        allComplete,
        resetSession,
        hasOnboarded,
        completeOnboarding,
        userName,
        intention,
        setIntention,
        careAlarms,
        setCareAlarms,
        quickNotes,
        addQuickNote,
        journalEntries,
        addJournalEntry,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

/**
 * Non-throwing accessor for the active vibe-mode. Used by useColors, which may
 * (defensively) render before the provider is mounted. Falls back to "bright".
 */
export function useThemePreference(): Vibe {
  const ctx = useContext(SessionContext);
  return ctx?.theme ?? "bright";
}
