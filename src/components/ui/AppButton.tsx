import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import {
  colors,
  radius,
  shadows,
  spacing,
} from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  style,
  disabled = false,
  loading = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && !loading && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      <Text style={styles.text}>{loading ? "Loading..." : title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    minHeight: 48,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.2,
  },
});