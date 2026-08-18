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
  spacing,
} from "@/theme";

type Props = {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
};

export default function AppButton({
  title,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
    borderRadius: radius.pill,
    minHeight: 48,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  text: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 14,
  },
});