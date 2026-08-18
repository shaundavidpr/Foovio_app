import React from "react";
import { Tabs } from "expo-router";
import {
  Home,
  Compass,
  Plus,
  Users,
  User,
} from "lucide-react-native";

import { colors, spacing } from "@/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.blueLight,
        tabBarInactiveTintColor: colors.muted,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,

          height: 72,

          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
        },

        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: "800",
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home
              size={size}
              color={color}
              strokeWidth={2.2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Compass
              size={size}
              color={color}
              strokeWidth={2.2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          tabBarIcon: ({ color, size }) => (
            <Plus
              size={size}
              color={color}
              strokeWidth={2.5}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="social"
        options={{
          title: "Social",
          tabBarIcon: ({ color, size }) => (
            <Users
              size={size}
              color={color}
              strokeWidth={2.2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User
              size={size}
              color={color}
              strokeWidth={2.2}
            />
          ),
        }}
      />
    </Tabs>
  );
}