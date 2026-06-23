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
        <Icon sf={{ default: "cross.case", selected: "cross.case.fill" }} />
        <Label>lab</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>you</Label>
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
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="cross.case.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="activity" size={20} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "you",
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="heart.fill" tintColor={color} size={22} />
            ) : (
              <Feather name="heart" size={20} color={color} />
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
