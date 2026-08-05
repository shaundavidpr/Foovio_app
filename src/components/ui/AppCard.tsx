import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, shadows, spacing } from "@/theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
};

export default function AppCard({
  children,
  style,
}: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,

    ...shadows.card,
  },
});