import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from "@expo-google-fonts/nunito";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AlarmOverlay, type AlarmType } from "@/components/AlarmOverlay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SessionProvider, useSession } from "@/context/SessionContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

/**
 * Fires the Nurture reminders (hydration glass / anatomical heart) on the saved
 * intervals while the user is onboarded and the app is running.
 */
const INTAKE_LOG_KEY = "prema_intake_log";

function AlarmManager() {
  const { careAlarms, lang, hasOnboarded } = useSession();
  const [active, setActive] = useState<AlarmType | null>(null);
  const lastLimitAlert = useRef<{ dateKey: string; count: number }>({ dateKey: "", count: 0 });

  useEffect(() => {
    if (!hasOnboarded) return;
    const waterMs = Math.max(1, careAlarms.hydrationSync) * 60 * 1000;
    const restMs = Math.max(1, careAlarms.breathingBreak) * 60 * 1000;
    const waterId = setInterval(() => setActive((prev) => prev ?? "water"), waterMs);
    const restId = setInterval(() => setActive((prev) => prev ?? "rest"), restMs);

    // Intake limit — synced to the lab's intake log. When today's logged
    // intakes reach the limit the user set, raise the limit alarm (once per
    // new entry that keeps them at/over the limit).
    const checkIntakeLimit = async () => {
      try {
        const raw = await AsyncStorage.getItem(INTAKE_LOG_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const dateKey = start.toDateString();
        const todayCount = parsed.filter(
          (e) => e && typeof e.ts === "number" && e.ts >= start.getTime(),
        ).length;

        // Reset the alert watermark on a new day, or when the log shrinks
        // (cleared/edited) so a fresh limit crossing can alert again.
        const prevAlert = lastLimitAlert.current;
        if (prevAlert.dateKey !== dateKey || todayCount < prevAlert.count) {
          lastLimitAlert.current = { dateKey, count: 0 };
        }

        const limit = Math.max(1, careAlarms.intakeLimit);
        if (todayCount >= limit && todayCount > lastLimitAlert.current.count) {
          lastLimitAlert.current = { dateKey, count: todayCount };
          setActive((prev) => prev ?? "limit");
        }
      } catch {}
    };
    checkIntakeLimit();
    const limitId = setInterval(checkIntakeLimit, 8000);

    return () => {
      clearInterval(waterId);
      clearInterval(restId);
      clearInterval(limitId);
    };
  }, [hasOnboarded, careAlarms.hydrationSync, careAlarms.breathingBreak, careAlarms.intakeLimit]);

  return (
    <AlarmOverlay
      visible={active !== null}
      type={active ?? "water"}
      lang={lang}
      onDone={() => setActive(null)}
    />
  );
}

function RootLayoutNav() {
  const { hasOnboarded, hasCompletedDisclaimer } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (hasOnboarded === null || hasCompletedDisclaimer === null) return;
    // Not onboarded: the onboarding screen owns the landing → disclaimer →
    // "tell us about you" flow internally, so just keep the user there.
    if (!hasOnboarded) {
      if (pathname !== "/onboarding") router.replace("/onboarding");
      return;
    }
    // Already onboarded but never saw the disclaimers (legacy install):
    // gate them through the standalone disclaimer route once.
    if (!hasCompletedDisclaimer) {
      if (pathname !== "/disclaimer") router.replace("/disclaimer");
    }
  }, [hasOnboarded, hasCompletedDisclaimer, pathname]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="disclaimer" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="heart-status" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="laboratory-test" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="self-care" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="recovery" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="before" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="during" options={{ animation: "slide_from_right" }} />
      </Stack>
      <AlarmManager />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <SessionProvider>
                <RootLayoutNav />
              </SessionProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
