import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts,
} from "@expo-google-fonts/nunito";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
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
function AlarmManager() {
  const { careAlarms, lang, hasOnboarded } = useSession();
  const [active, setActive] = useState<AlarmType | null>(null);

  useEffect(() => {
    if (!hasOnboarded) return;
    const waterMs = Math.max(1, careAlarms.hydrationSync) * 60 * 1000;
    const restMs = Math.max(1, careAlarms.breathingBreak) * 60 * 1000;
    const waterId = setInterval(() => setActive((prev) => prev ?? "water"), waterMs);
    const restId = setInterval(() => setActive((prev) => prev ?? "rest"), restMs);
    return () => {
      clearInterval(waterId);
      clearInterval(restId);
    };
  }, [hasOnboarded, careAlarms.hydrationSync, careAlarms.breathingBreak]);

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
  const { hasOnboarded } = useSession();

  useEffect(() => {
    if (hasOnboarded === null) return;
    if (!hasOnboarded) {
      router.replace("/onboarding");
    }
  }, [hasOnboarded]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
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
