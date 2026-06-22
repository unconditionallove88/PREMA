import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Phase = "before" | "during" | "recovery";

export type PrepStep =
  | "testing"
  | "essentials"
  | "nutrition"
  | "rest"
  | "alarms"
  | "sync";

export interface SessionContextValue {
  phase: Phase;
  setPhase: (p: Phase) => void;
  lang: "en" | "de";
  setLang: (l: "en" | "de") => void;
  completed: Record<PrepStep, boolean>;
  toggleStep: (step: PrepStep) => void;
  allComplete: boolean;
  resetSession: () => void;
  affirmation: string;
  hasOnboarded: boolean | null;
  userName: string;
}

const AFFIRMATIONS = [
  "You are held",
  "Your body is wise",
  "You came here to feel",
  "Love is your compass",
  "You are not alone",
  "Return to your breath",
  "You are enough",
  "Trust the unfolding",
];

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
  const [completed, setCompleted] =
    useState<Record<PrepStep, boolean>>(defaultCompleted);
  const [affirmation] = useState(
    AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]
  );
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const [ph, ln, comp, onboarded, uname] = await Promise.all([
        AsyncStorage.getItem("prema_phase"),
        AsyncStorage.getItem("prema_lang"),
        AsyncStorage.getItem("prema_completed"),
        AsyncStorage.getItem("prema_onboarded"),
        AsyncStorage.getItem("prema_user_name"),
      ]);
      if (ph === "before" || ph === "during" || ph === "recovery") {
        setPhaseState(ph);
      }
      if (ln === "en" || ln === "de") setLangState(ln);
      if (comp) {
        try {
          setCompleted(JSON.parse(comp));
        } catch {}
      }
      setHasOnboarded(onboarded === "true");
      setUserName(uname || "");
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
    AsyncStorage.multiSet([
      ["prema_phase", "before"],
      ["prema_completed", JSON.stringify(defaultCompleted)],
    ]);
  }, []);

  const allComplete = Object.values(completed).every(Boolean);

  return (
    <SessionContext.Provider
      value={{
        phase,
        setPhase,
        lang,
        setLang,
        completed,
        toggleStep,
        allComplete,
        resetSession,
        affirmation,
        hasOnboarded,
        userName,
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
