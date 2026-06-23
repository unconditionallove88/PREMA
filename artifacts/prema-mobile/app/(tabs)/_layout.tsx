import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs, VectorIcon } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";

import { TabBarVisibilityProvider, useTabBarVisibility } from "@/context/TabBarVisibility";
import { YouPanelProvider } from "@/context/YouPanel";
import { useThemePreference } from "@/context/SessionContext";
import { useColors } from "@/hooks/useColors";

function AnimatedTabBar(props: BottomTabBarProps) {
  const vis = useTabBarVisibility();
  if (!vis) return <BottomTabBar {...props} />;
  const translateY = vis.translate.interpolate({ inputRange: [0, 1], outputRange: [0, 180] });
  const opacity = vis.translate.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <BottomTabBar {...props} />
    </Animated.View>
  );
}

function NativeTabLayout() {
  const colors = useColors();
  const vibe = useThemePreference();
  const isDark = vibe === "dark";
  return (
    <NativeTabs
      blurEffect={isDark ? "systemChromeMaterialDark" : "systemChromeMaterialLight"}
      tintColor={colors.primary}
      iconColor={colors.mutedForeground}
      labelStyle={{ color: colors.mutedForeground, fontFamily: "Nunito_600SemiBold" }}
    >
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "circle", selected: "circle.fill" }} />
        <Label>circle</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="breath">
        <Icon sf={{ default: "wind", selected: "wind" }} />
        <Label>breath</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="letters">
        <Icon sf={{ default: "envelope", selected: "envelope.fill" }} />
        <Label>letters</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lab">
        <Icon src={<VectorIcon family={MaterialCommunityIcons} name="microscope" />} />
        <Label>lab</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="create">
        <Icon sf={{ default: "square.and.pencil", selected: "square.and.pencil" }} />
        <Label>create</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const vibe = useThemePreference();
  const isDark = vibe === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  // Frosted-glass tab bar on web: a translucent tint + backdrop blur so the
  // void / auric glow bleeds through. Dark-tinted in dark mode, frosted-light
  // in light mode. (backdropFilter is web-only, hence the cast.)
  const webGlass =
    isWeb
      ? ({
          backgroundColor: isDark ? "rgba(8,8,16,0.55)" : "rgba(249,249,251,0.6)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        } as object)
      : null;

  return (
    <TabBarVisibilityProvider>
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS || isWeb ? "transparent" : colors.background,
          borderTopWidth: isWeb ? StyleSheet.hairlineWidth : 0,
          borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, webGlass]} />
          ) : null,
        tabBarLabelStyle: {
          fontFamily: "Nunito_600SemiBold",
          fontSize: 10,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "circle",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="circle.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="circle" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="breath"
        options={{
          title: "breath",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="wind" tintColor={color} size={22} />
            ) : (
              <Feather name="wind" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="letters"
        options={{
          title: "letters",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="envelope.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="mail" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: "lab",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="microscope" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "create",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="square.and.pencil" tintColor={color} size={22} />
            ) : (
              <Feather name="edit-3" size={20} color={color} />
            ),
        }}
      />
    </Tabs>
    </TabBarVisibilityProvider>
  );
}

export default function TabLayout() {
  return (
    <YouPanelProvider>
      {isLiquidGlassAvailable() ? <NativeTabLayout /> : <ClassicTabLayout />}
    </YouPanelProvider>
  );
}
