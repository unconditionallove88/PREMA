import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme } from "react-native";

import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="prepare">
        <Icon sf={{ default: "drop", selected: "drop.fill" }} />
        <Label>Water</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="session">
        <Icon sf={{ default: "wind", selected: "wind" }} />
        <Label>Breathe</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="care">
        <Icon sf={{ default: "moon", selected: "moon.fill" }} />
        <Label>Rest</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "location.north.fill", selected: "location.north.fill" }} />
        <Label>Depart</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.background,
          borderTopWidth: isWeb ? StyleSheet.hairlineWidth : 0,
          borderTopColor: colors.border,
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "dark"}
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]}
            />
          ) : null,
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="prepare"
        options={{
          title: "Water",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="drop" tintColor={color} size={22} />
            ) : (
              <Feather name="droplet" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="session"
        options={{
          title: "Breathe",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="wind" tintColor={color} size={22} />
            ) : (
              <Feather name="wind" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: "Rest",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="moon" tintColor={color} size={22} />
            ) : (
              <Feather name="moon" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Depart",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="location.north.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="navigation" size={20} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
