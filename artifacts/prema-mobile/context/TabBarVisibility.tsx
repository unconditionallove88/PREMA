import React, { createContext, useContext, useRef } from "react";
import { Animated, Easing } from "react-native";

/**
 * Lets a screen smoothly hide / reveal the bottom tab bar for immersive,
 * full-screen experiences (e.g. Breath of Love). `translate` runs 0 (visible)
 * → 1 (hidden); the custom tab bar in the tabs layout reads it to slide the
 * bar off-screen. Consumers outside the provider get `null` and no-op.
 */
type TabBarVisibility = {
  translate: Animated.Value;
  hide: () => void;
  show: () => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibility | null>(null);

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const translate = useRef(new Animated.Value(0)).current;
  const value = useRef<TabBarVisibility>({
    translate,
    hide: () => {
      translate.stopAnimation();
      Animated.timing(translate, {
        toValue: 1,
        duration: 3000,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    show: () => {
      translate.stopAnimation();
      Animated.timing(translate, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
  }).current;

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  return useContext(TabBarVisibilityContext);
}
